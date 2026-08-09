import { NextResponse } from "next/server";

export const revalidate = 21600;
type CodeforcesUser = { handle: string; rating?: number; maxRating?: number; rank?: string };
type Signal = { judge: string; handle: string; status: "online" | "fallback"; primary: string; secondary: string; updatedAt: string };

async function codeforces(): Promise<Signal> {
  const response = await fetch("https://codeforces.com/api/user.info?handles=asterunee&checkHistoricHandles=false", { next: { revalidate: 21600 }, signal: AbortSignal.timeout(5000) });
  const data = await response.json() as { status?: string; result?: CodeforcesUser[] }; const user = data.result?.[0];
  if (!response.ok || data.status !== "OK" || !user) throw new Error("Codeforces signal unavailable");
  return { judge: "Codeforces", handle: user.handle, status: "online", primary: user.rating ? `${user.rating} rating` : "Unrated", secondary: `${user.rank || "rank pending"} · max ${user.maxRating || "—"}`, updatedAt: new Date().toISOString() };
}

async function atcoder(): Promise<Signal> {
  const to = Math.floor(Date.now() / 1000); const url = `https://kenkoooo.com/atcoder/atcoder-api/v3/user/submission_count?user=asterunee&from_second=0&to_second=${to}`;
  const response = await fetch(url, { next: { revalidate: 21600 }, signal: AbortSignal.timeout(5000) }); const data = await response.json() as { count?: number };
  if (!response.ok || typeof data.count !== "number") throw new Error("AtCoder signal unavailable");
  return { judge: "AtCoder", handle: "asterunee", status: "online", primary: `${data.count} submissions`, secondary: "via AtCoder Problems", updatedAt: new Date().toISOString() };
}

export async function GET() {
  const settled = await Promise.allSettled([codeforces(), atcoder()]); const names = ["Codeforces", "AtCoder"];
  const signals = settled.map((result, index): Signal => result.status === "fulfilled" ? result.value : { judge: names[index], handle: "asterunee", status: "fallback", primary: "Signal unavailable", secondary: "cached fallback", updatedAt: new Date().toISOString() });
  return NextResponse.json({ signals, note: "AtCoder data is provided by the unofficial AtCoder Problems API." }, { headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" } });
}
