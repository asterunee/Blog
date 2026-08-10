import { NextResponse } from "next/server";

export const revalidate = 21600;

type RatingPoint = { date: string; rating: number; contest: string; rank: number };
type CodeforcesChange = { ratingUpdateTimeSeconds: number; newRating: number; contestName: string; rank: number };
type AtCoderChange = { IsRated: boolean; EndTime: string; NewRating: number; ContestName: string; ContestNameEn?: string; Place: number };

async function codeforces(): Promise<RatingPoint[]> {
  const response = await fetch("https://codeforces.com/api/user.rating?handle=asterunee", { next: { revalidate: 21600 }, signal: AbortSignal.timeout(5000) });
  const data = await response.json() as { status?: string; result?: CodeforcesChange[] };
  if (!response.ok || data.status !== "OK" || !Array.isArray(data.result)) throw new Error("Codeforces rating unavailable");
  return data.result.map((change) => ({ date: new Date(change.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 10), rating: change.newRating, contest: change.contestName, rank: change.rank }));
}

async function atcoder(): Promise<RatingPoint[]> {
  const response = await fetch("https://atcoder.jp/users/asterunee/history/json", { next: { revalidate: 21600 }, signal: AbortSignal.timeout(5000) });
  const data = await response.json() as AtCoderChange[];
  if (!response.ok || !Array.isArray(data)) throw new Error("AtCoder rating unavailable");
  return data.filter((change) => change.IsRated).map((change) => ({ date: new Date(change.EndTime).toISOString().slice(0, 10), rating: change.NewRating, contest: change.ContestNameEn || change.ContestName, rank: change.Place }));
}

export async function GET() {
  const [codeforcesResult, atcoderResult] = await Promise.allSettled([codeforces(), atcoder()]);
  return NextResponse.json({
    codeforces: codeforcesResult.status === "fulfilled" ? codeforcesResult.value : [],
    atcoder: atcoderResult.status === "fulfilled" ? atcoderResult.value : [],
    fallback: { codeforces: codeforcesResult.status === "rejected", atcoder: atcoderResult.status === "rejected" },
  }, { headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" } });
}
