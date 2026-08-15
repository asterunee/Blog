import { NextResponse } from "next/server";
import { getLeetCodeActivity } from "@/lib/leetcode";
import { getRatingTitle } from "@/lib/ratings";

export const revalidate = 21600;
type CodeforcesUser = { handle: string; rating?: number; maxRating?: number; rank?: string };
type Signal = { judge: string; handle: string; status: "online" | "fallback"; primary: string; secondary: string; updatedAt: string };
type AtCoderChange = { IsRated: boolean; NewRating: number };

async function codeforces(): Promise<Signal> {
  const response = await fetch("https://codeforces.com/api/user.info?handles=asterunee&checkHistoricHandles=false", { next: { revalidate: 21600 }, signal: AbortSignal.timeout(5000) });
  const data = await response.json() as { status?: string; result?: CodeforcesUser[] }; const user = data.result?.[0];
  if (!response.ok || data.status !== "OK" || !user) throw new Error("Codeforces signal unavailable");
  return { judge: "Codeforces", handle: user.handle, status: "online", primary: user.rating ? `${user.rating} rating` : "Unrated", secondary: `${user.rank || "rank pending"} · max ${user.maxRating || "—"}`, updatedAt: new Date().toISOString() };
}

async function atcoder(): Promise<Signal> {
  const response = await fetch("https://atcoder.jp/users/asterunee/history/json", { next: { revalidate: 21600 }, signal: AbortSignal.timeout(5000) });
  const data = await response.json() as AtCoderChange[];
  const rated = Array.isArray(data) ? data.filter((change) => change.IsRated) : [];
  const current = rated.at(-1)?.NewRating;
  if (!response.ok || typeof current !== "number") throw new Error("AtCoder signal unavailable");
  const maximum = Math.max(...rated.map((change) => change.NewRating));
  return { judge: "AtCoder", handle: "asterunee", status: "online", primary: `${current} rating`, secondary: `${getRatingTitle("AtCoder", current)} · max ${maximum}`, updatedAt: new Date().toISOString() };
}

async function leetcode(): Promise<Signal> {
  const activity = await getLeetCodeActivity();
  const primary = activity.contestRating === null ? `${activity.solved} solved` : `${Math.round(activity.contestRating)} rating`;
  const secondary = activity.contestRating === null ? `Easy ${activity.easy} · Medium ${activity.medium} · Hard ${activity.hard}` : `${activity.badge || "Contest"} · ${activity.attendedContests} contests`;
  return { judge: "LeetCode", handle: activity.username, status: "online", primary, secondary, updatedAt: new Date().toISOString() };
}

export async function GET() {
  const settled = await Promise.allSettled([codeforces(), atcoder(), leetcode()]); const names = ["Codeforces", "AtCoder", "LeetCode"];
  const signals = settled.map((result, index): Signal => result.status === "fulfilled" ? result.value : { judge: names[index], handle: "asterunee", status: "fallback", primary: "Signal unavailable", secondary: "cached fallback", updatedAt: new Date().toISOString() });
  return NextResponse.json({ signals }, { headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" } });
}
