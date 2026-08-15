import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createAccount, createUserSessionToken, getAccount, getUserSession, userSessionCookie, userSessionOptions, verifyAccountPassword } from "@/lib/user-auth";
import { parseAuthInput, type SessionUser } from "@/lib/user-types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const attempts = new Map<string, { count: number; resetAt: number }>();

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try { return new URL(origin).host === request.headers.get("host"); } catch { return false; }
}

function allowAttempt(request: Request) {
  const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const current = attempts.get(ip);
  if (!current || current.resetAt <= now) {
    attempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (current.count >= 10) return false;
  current.count += 1;
  return true;
}

async function setSession(user: SessionUser) {
  const token = createUserSessionToken(user);
  if (!token) return false;
  (await cookies()).set(userSessionCookie, token, userSessionOptions);
  return true;
}

export async function GET() {
  return NextResponse.json({ user: await getUserSession() }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });
  if (!allowAttempt(request)) return NextResponse.json({ error: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요." }, { status: 429 });
  let raw: Record<string, unknown>;
  try { raw = await request.json() as Record<string, unknown>; } catch { return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 }); }
  const registering = raw.action === "register";
  if (!registering && raw.action !== "login") return NextResponse.json({ error: "지원하지 않는 요청입니다." }, { status: 400 });
  const parsed = parseAuthInput(raw, registering);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  if (registering) {
    if (await getAccount(parsed.value.username)) return NextResponse.json({ error: "이미 사용 중인 아이디입니다." }, { status: 409 });
    try {
      const account = await createAccount({ username: parsed.value.username, displayName: parsed.value.displayName }, parsed.value.password);
      const user = { username: account.username, displayName: account.displayName };
      if (!await setSession(user)) throw new Error("Session secret unavailable");
      return NextResponse.json({ user }, { status: 201 });
    } catch {
      return NextResponse.json({ error: "계정을 만들지 못했습니다. 잠시 후 다시 시도해 주세요." }, { status: 503 });
    }
  }

  const account = await getAccount(parsed.value.username);
  if (!account || !await verifyAccountPassword(account, parsed.value.password)) return NextResponse.json({ error: "아이디 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  const user = { username: account.username, displayName: account.displayName };
  if (!await setSession(user)) return NextResponse.json({ error: "로그인 설정을 확인해 주세요." }, { status: 503 });
  return NextResponse.json({ user });
}

export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });
  (await cookies()).set(userSessionCookie, "", { ...userSessionOptions, maxAge: 0 });
  return NextResponse.json({ ok: true });
}
