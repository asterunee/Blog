import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { del, get, list, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { parseCommentEdit, parseCommentInput, type AdminComment, type PublicComment } from "@/lib/comments";
import { getAllContentEntries } from "@/lib/content-index";
import { isKeystaticOwner } from "@/lib/keystatic-owner";
import { getUserSession } from "@/lib/user-auth";

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
  if (current.count >= 8) return false;
  current.count += 1;
  return true;
}

async function canModerate() {
  const accessToken = (await cookies()).get("keystatic-gh-access-token")?.value;
  return isKeystaticOwner(accessToken);
}

function validCommentId(id: string) {
  return id.startsWith("comments/") && id.endsWith(".json") && id.length < 300;
}

async function readComment(url: string, pathname?: string): Promise<PublicComment | null> {
  try {
    const result = await get(url, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200) return null;
    const comment = await new Response(result.stream).json() as PublicComment;
    return { ...comment, id: pathname || comment.id };
  } catch {
    return null;
  }
}

async function listAllComments(): Promise<AdminComment[]> {
  const blobs: { url: string; pathname: string; uploadedAt: Date }[] = [];
  let cursor: string | undefined;
  do {
    const result = await list({ prefix: "comments/", limit: 1000, cursor });
    blobs.push(...result.blobs);
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  const entries = getAllContentEntries(true);
  const knownPages = new Map(entries.map((entry) => [pagePrefix(entry.href), { page: entry.href, title: entry.title }]));
  knownPages.set(pagePrefix("/guestbook"), { page: "/guestbook", title: "방명록" });
  const comments = await Promise.all(blobs.map(async (blob): Promise<AdminComment | null> => {
    const comment = await readComment(blob.url, blob.pathname);
    if (!comment) return null;
    const known = knownPages.get(blob.pathname.split("/").slice(0, 2).join("/") + "/");
    const page = comment.page || known?.page || "";
    return { ...comment, page, pageTitle: known?.title || (page ? page : "이전 댓글 · 원문 경로 정보 없음") };
  }));
  return comments.filter((comment): comment is AdminComment => Boolean(comment)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  if (params.get("admin") === "1") {
    if (!await canModerate()) return NextResponse.json({ error: "관리자 권한이 없습니다." }, { status: 403 });
    try {
      return NextResponse.json({ comments: await listAllComments() }, { headers: { "Cache-Control": "private, no-store" } });
    } catch {
      return NextResponse.json({ error: "전체 댓글을 불러오지 못했습니다." }, { status: 503 });
    }
  }

  const page = params.get("page") || "";
  if (!page.startsWith("/") || page.length > 300) return NextResponse.json({ error: "올바른 글 주소가 아닙니다." }, { status: 400 });

  try {
    const result = await list({ prefix: pagePrefix(page), limit: 1000 });
    const newest = result.blobs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()).slice(0, 100);
    const comments = (await Promise.all(newest.map((blob) => readComment(blob.url, blob.pathname)))).filter((comment): comment is PublicComment => Boolean(comment));
    const [moderator, currentUser] = await Promise.all([canModerate(), getUserSession()]);
    return NextResponse.json({ comments, canModerate: moderator, currentUser }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "댓글을 불러오지 못했습니다." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });
  const user = await getUserSession();
  if (!user) return NextResponse.json({ error: "로그인 후 댓글을 남길 수 있습니다." }, { status: 401 });
  if (!allowRequest(request)) return NextResponse.json({ error: "댓글을 너무 빠르게 작성하고 있습니다. 잠시 후 다시 시도해 주세요." }, { status: 429, headers: { "Retry-After": "600" } });

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }
  if (raw && typeof raw === "object" && "website" in raw && Boolean((raw as { website?: unknown }).website)) return NextResponse.json({ ok: true }, { status: 201 });
  const parsed = parseCommentInput(raw && typeof raw === "object" ? { ...raw, name: user.displayName } : raw);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  let parentId = parsed.value.parentId;
  if (parentId) {
    if (!parentId.startsWith(pagePrefix(parsed.value.page))) return NextResponse.json({ error: "다른 글의 댓글에는 답글을 달 수 없습니다." }, { status: 400 });
    const parent = await readComment(parentId, parentId);
    if (!parent) return NextResponse.json({ error: "답글을 남길 댓글을 찾을 수 없습니다." }, { status: 404 });
    parentId = parent.parentId || parent.id;
  }

  const createdAt = new Date().toISOString();
  const id = `${pagePrefix(parsed.value.page)}${Date.now()}-${crypto.randomUUID()}.json`;
  const comment: PublicComment = { id, name: user.displayName, body: parsed.value.body, createdAt, page: parsed.value.page, authorId: user.username, ...(parentId ? { parentId } : {}) };
  try {
    await put(id, JSON.stringify(comment), { access: "private", addRandomSuffix: false, contentType: "application/json", cacheControlMaxAge: 60 });
    return NextResponse.json({ comment }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "댓글을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "수정 권한이 없습니다." }, { status: 403 });
  let raw: Record<string, unknown>;
  try {
    raw = await request.json() as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }
  const id = typeof raw.id === "string" ? raw.id : "";
  if (!validCommentId(id)) return NextResponse.json({ error: "올바른 댓글이 아닙니다." }, { status: 400 });
  const existing = await readComment(id, id);
  if (!existing) return NextResponse.json({ error: "댓글을 찾을 수 없습니다." }, { status: 404 });
  const [moderator, user] = await Promise.all([canModerate(), getUserSession()]);
  if (!moderator && (!user || existing.authorId !== user.username)) return NextResponse.json({ error: "수정 권한이 없습니다." }, { status: 403 });
  const parsed = parseCommentEdit({ ...raw, name: moderator ? raw.name : existing.name });
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const comment: PublicComment = { ...existing, ...parsed.value, id };
  try {
    await put(id, JSON.stringify(comment), { access: "private", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json", cacheControlMaxAge: 60 });
    return NextResponse.json({ comment });
  } catch {
    return NextResponse.json({ error: "댓글을 수정하지 못했습니다." }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "삭제 권한이 없습니다." }, { status: 403 });
  let raw: { page?: unknown; id?: unknown };
  try {
    raw = await request.json() as { page?: unknown; id?: unknown };
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }
  if (typeof raw.id !== "string" || !validCommentId(raw.id) || (typeof raw.page === "string" && !raw.id.startsWith(pagePrefix(raw.page)))) return NextResponse.json({ error: "올바른 댓글이 아닙니다." }, { status: 400 });
  const existing = await readComment(raw.id, raw.id);
  if (!existing) return NextResponse.json({ error: "댓글을 찾을 수 없습니다." }, { status: 404 });
  const [moderator, user] = await Promise.all([canModerate(), getUserSession()]);
  if (!moderator && (!user || existing.authorId !== user.username)) return NextResponse.json({ error: "삭제 권한이 없습니다." }, { status: 403 });
  try {
    const ids = [raw.id];
    if (!existing.parentId) {
      const page = existing.page || (typeof raw.page === "string" ? raw.page : "");
      if (page) {
        const result = await list({ prefix: pagePrefix(page), limit: 1000 });
        const children = await Promise.all(result.blobs.map((blob) => readComment(blob.url, blob.pathname)));
        ids.push(...children.filter((comment): comment is PublicComment => Boolean(comment?.parentId === raw.id)).map((comment) => comment.id));
      }
    }
    await del(ids);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "댓글을 삭제하지 못했습니다." }, { status: 503 });
  }
}
