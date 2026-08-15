import { NextResponse } from "next/server";
import { getLeetCodeActivity } from "@/lib/leetcode";

export const revalidate = 21600;

type RatingPoint = { date: string; rating: number; change: number; contest: string; rank: number; url: string };
type CodeforcesChange = { contestId: number; ratingUpdateTimeSeconds: number; oldRating: number; newRating: number; contestName: string; rank: number };
type AtCoderChange = { IsRated: boolean; EndTime: string; OldRating: number; NewRating: number; ContestName: string; ContestNameEn?: string; ContestScreenName: string; Place: number };

async function codeforces(): Promise<RatingPoint[]> {
  const response = await fetch("https://codeforces.com/api/user.rating?handle=asterunee", { next: { revalidate: 21600 }, signal: AbortSignal.timeout(5000) });
  const data = await response.json() as { status?: string; result?: CodeforcesChange[] };
  if (!response.ok || data.status !== "OK" || !Array.isArray(data.result)) throw new Error("Codeforces rating unavailable");
  return data.result.map((change) => ({ date: new Date(change.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 10), rating: change.newRating, change: change.newRating - change.oldRating, contest: change.contestName, rank: change.rank, url: `https://codeforces.com/contest/${change.contestId}` }));
}

async function atcoder(): Promise<RatingPoint[]> {
  const response = await fetch("https://atcoder.jp/users/asterunee/history/json", { next: { revalidate: 21600 }, signal: AbortSignal.timeout(5000) });
  const data = await response.json() as AtCoderChange[];
  if (!response.ok || !Array.isArray(data)) throw new Error("AtCoder rating unavailable");
  return data.filter((change) => change.IsRated).map((change) => ({ date: new Date(change.EndTime).toISOString().slice(0, 10), rating: change.NewRating, change: change.NewRating - change.OldRating, contest: change.ContestNameEn || change.ContestName, rank: change.Place, url: `https://${change.ContestScreenName}` }));
}

async function leetcode(): Promise<RatingPoint[]> {
  const activity = await getLeetCodeActivity();
  let previous = 0;
  return activity.contestHistory.map((entry) => {
    const point = {
      date: new Date(entry.contest.startTime * 1000).toISOString().slice(0, 10),
      rating: Math.round(entry.rating),
      change: previous ? Math.round(entry.rating - previous) : 0,
      contest: entry.contest.title,
      rank: entry.ranking,
      url: `https://leetcode.com/contest/${entry.contest.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
    };
    previous = entry.rating;
    return point;
  });
}

export async function GET() {
  const [codeforcesResult, atcoderResult, leetcodeResult] = await Promise.allSettled([codeforces(), atcoder(), leetcode()]);
  return NextResponse.json({
    codeforces: codeforcesResult.status === "fulfilled" ? codeforcesResult.value : [],
    atcoder: atcoderResult.status === "fulfilled" ? atcoderResult.value : [],
    leetcode: leetcodeResult.status === "fulfilled" ? leetcodeResult.value : [],
    fallback: { codeforces: codeforcesResult.status === "rejected", atcoder: atcoderResult.status === "rejected", leetcode: leetcodeResult.status === "rejected" },
  }, { headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" } });
}
