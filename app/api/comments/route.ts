import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { del, get, list, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { parseCommentInput, type PublicComment } from "@/lib/comments";
import { isKeystaticOwner } from "@/lib/keystatic-owner";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const rateLimits = new Map<string, { count: number; resetAt: number }>();

function pagePrefix(page: string) {
  const key = createHash("sha256").update(page).digest("hex").slice(0, 32);
  return `comments/${key}/`;
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

function allowRequest(request: Request) {
  const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const current = rateLimits.get(ip);
  if (!current || current.resetAt <= now) {
    rateLimits.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return true;
  }
  if (current.count >= 3) return false;
  current.count += 1;
  return true;
}

async function canModerate() {
  const accessToken = (await cookies()).get("keystatic-gh-access-token")?.value;
  return isKeystaticOwner(accessToken);
}

async function readComment(url: string): Promise<PublicComment | null> {
  try {
    const result = await get(url, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200) return null;
    return await new Response(result.stream).json() as PublicComment;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const page = new URL(request.url).searchParams.get("page") || "";
  if (!page.startsWith("/") || page.length > 300) return NextResponse.json({ error: "올바른 글 주소가 아닙니다." }, { status: 400 });

  try {
    const result = await list({ prefix: pagePrefix(page), limit: 1000 });
    const newest = result.blobs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()).slice(0, 100);
    const comments = (await Promise.all(newest.map((blob) => readComment(blob.url)))).filter((comment): comment is PublicComment => Boolean(comment));
    return NextResponse.json({ comments, canModerate: await canModerate() }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "댓글을 불러오지 못했습니다." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });
  if (!allowRequest(request)) return NextResponse.json({ error: "댓글을 너무 빠르게 작성하고 있습니다. 잠시 후 다시 시도해 주세요." }, { status: 429, headers: { "Retry-After": "600" } });

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }
  if (raw && typeof raw === "object" && "website" in raw && Boolean((raw as { website?: unknown }).website)) return NextResponse.json({ ok: true }, { status: 201 });
  const parsed = parseCommentInput(raw);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const createdAt = new Date().toISOString();
  const id = `${pagePrefix(parsed.value.page)}${Date.now()}-${crypto.randomUUID()}.json`;
  const comment: PublicComment = { id, name: parsed.value.name, body: parsed.value.body, createdAt };
  try {
    await put(id, JSON.stringify(comment), { access: "private", addRandomSuffix: false, contentType: "application/json", cacheControlMaxAge: 60 });
    return NextResponse.json({ comment }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "댓글을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  if (!sameOrigin(request) || !await canModerate()) return NextResponse.json({ error: "삭제 권한이 없습니다." }, { status: 403 });
  let raw: { page?: unknown; id?: unknown };
  try {
    raw = await request.json() as { page?: unknown; id?: unknown };
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }
  if (typeof raw.page !== "string" || typeof raw.id !== "string" || !raw.id.startsWith(pagePrefix(raw.page))) return NextResponse.json({ error: "올바른 댓글이 아닙니다." }, { status: 400 });
  try {
    await del(raw.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "댓글을 삭제하지 못했습니다." }, { status: 503 });
  }
}
