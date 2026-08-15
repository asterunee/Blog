export const accountLimits = { username: 24, displayName: 24, password: 72 } as const;
export const authEvents = { open: "asterunee-open-auth", changed: "asterunee-auth-changed" } as const;

export type SessionUser = {
  username: string;
  displayName: string;
};

export type AuthInput = SessionUser & { password: string };

export function normalizeUsername(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function parseAuthInput(input: unknown, registering: boolean): { ok: true; value: AuthInput } | { ok: false; error: string } {
  if (!input || typeof input !== "object") return { ok: false, error: "잘못된 요청입니다." };
  const data = input as Record<string, unknown>;
  const username = normalizeUsername(data.username);
  const displayName = typeof data.displayName === "string" ? data.displayName.trim().replace(/\s+/g, " ") : "";
  const password = typeof data.password === "string" ? data.password : "";

  if (!/^[a-z0-9][a-z0-9_-]{2,23}$/.test(username)) return { ok: false, error: "아이디는 영문 소문자와 숫자, 밑줄, 하이픈으로 3~24자 입력해 주세요." };
  if (registering && (!displayName || displayName.length > accountLimits.displayName)) return { ok: false, error: `표시 이름은 1~${accountLimits.displayName}자로 입력해 주세요.` };
  if (password.length < 8 || password.length > accountLimits.password) return { ok: false, error: `비밀번호는 8~${accountLimits.password}자로 입력해 주세요.` };
  return { ok: true, value: { username, displayName, password } };
}
