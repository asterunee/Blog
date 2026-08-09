import { NextResponse } from "next/server";

export const revalidate = 21600;
type Submission = { epoch_second?: number };

function emptyDays() {
  const result: { date: string; count: number }[] = [];
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  for (let index = 97; index >= 0; index--) {
    const date = new Date(today);
    date.setUTCDate(date.getUTCDate() - index);
    result.push({ date: date.toISOString().slice(0, 10), count: 0 });
  }
  return result;
}

export async function GET() {
  const days = emptyDays();
  const fromSecond = Math.floor(new Date(`${days[0].date}T00:00:00Z`).getTime() / 1000);
  try {
    const response = await fetch(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=asterunee&from_second=${fromSecond}`, { next: { revalidate: 21600 }, signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error("AtCoder unavailable");
    const submissions = await response.json() as Submission[];
    if (!Array.isArray(submissions)) throw new Error("Unknown AtCoder response");
    const counts = new Map<string, number>();
    submissions.forEach((submission) => {
      if (!submission.epoch_second) return;
      const date = new Date(submission.epoch_second * 1000).toISOString().slice(0, 10);
      counts.set(date, (counts.get(date) || 0) + 1);
    });
    return NextResponse.json({ days: days.map((day) => ({ ...day, count: counts.get(day.date) || 0 })), fallback: false }, { headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" } });
  } catch {
    return NextResponse.json({ days, fallback: true }, { headers: { "Cache-Control": "public, s-maxage=3600" } });
  }
}
