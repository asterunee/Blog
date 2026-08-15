import "server-only";

import { createHash, createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { get, put } from "@vercel/blob";
import type { SessionUser } from "@/lib/user-types";

const scryptAsync = promisify(scrypt);
export const userSessionCookie = "asterunee-user-session";
const sessionSeconds = 60 * 60 * 24 * 30;

type AccountRecord = SessionUser & { passwordHash: string; salt: string; createdAt: string };
type SessionPayload = SessionUser & { exp: number };

function secret() {
  return process.env.BLOG_AUTH_SECRET || process.env.KEYSTATIC_SECRET || (process.env.NODE_ENV === "production" ? "" : "asterunee-development-session-secret");
}

function accountPath(username: string) {
  const key = createHash("sha256").update(username).digest("hex");
  return `accounts/${key}.json`;
}

function sign(value: string) {
  const key = secret();
  return key ? createHmac("sha256", key).update(value).digest("base64url") : "";
}

export function createUserSessionToken(user: SessionUser) {
  if (!secret()) return null;
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Math.floor(Date.now() / 1000) + sessionSeconds } satisfies SessionPayload)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyUserSessionToken(token?: string): SessionUser | null {
  if (!token || !secret()) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionPayload;
    if (!data.username || !data.displayName || data.exp <= Math.floor(Date.now() / 1000)) return null;
    return { username: data.username, displayName: data.displayName };
  } catch {
    return null;
  }
}

export async function getUserSession() {
  return verifyUserSessionToken((await cookies()).get(userSessionCookie)?.value);
}

export const userSessionOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: sessionSeconds };

export async function getAccount(username: string): Promise<AccountRecord | null> {
  try {
    const result = await get(accountPath(username), { access: "private", useCache: false });
    if (!result || result.statusCode !== 200) return null;
    return await new Response(result.stream).json() as AccountRecord;
  } catch {
    return null;
  }
}

export async function createAccount(user: SessionUser, password: string) {
  const salt = randomBytes(16).toString("base64url");
  const hash = await scryptAsync(password, salt, 64) as Buffer;
  const account: AccountRecord = { ...user, salt, passwordHash: hash.toString("base64url"), createdAt: new Date().toISOString() };
  await put(accountPath(user.username), JSON.stringify(account), { access: "private", addRandomSuffix: false, contentType: "application/json", cacheControlMaxAge: 60 });
  return account;
}

export async function verifyAccountPassword(account: AccountRecord, password: string) {
  const expected = Buffer.from(account.passwordHash, "base64url");
  const actual = await scryptAsync(password, account.salt, expected.length) as Buffer;
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
