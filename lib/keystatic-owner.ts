export const keystaticOwner = { login: "asterunee", id: 314607214 } as const;

export async function isKeystaticOwner(accessToken?: string) {
  if (!accessToken) return false;
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return false;
    const user = await response.json() as { login?: string; id?: number };
    return user.id === keystaticOwner.id && user.login?.toLowerCase() === keystaticOwner.login;
  } catch {
    return false;
  }
}
