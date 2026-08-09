import { NextResponse } from "next/server";

export const revalidate = 21600;
type Submission = { creationTimeSeconds?: number };

function emptyDays() {
  const result: { date: string; count: number }[] = []; const today = new Date(); today.setUTCHours(0,0,0,0);
  for (let i = 97; i >= 0; i--) { const date = new Date(today); date.setUTCDate(date.getUTCDate() - i); result.push({ date: date.toISOString().slice(0,10), count: 0 }); }
  return result;
}

export async function GET() {
  const days = emptyDays();
  try {
    const response = await fetch("https://codeforces.com/api/user.status?handle=asterunee&from=1&count=10000", { next: { revalidate: 21600 }, signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error("Codeforces unavailable");
    const data = await response.json() as { status?: string; result?: Submission[] };
    if (data.status !== "OK" || !Array.isArray(data.result)) throw new Error("Unknown profile or empty response");
    const counts = new Map<string, number>(); data.result.forEach((item) => { if (item.creationTimeSeconds) { const date = new Date(item.creationTimeSeconds * 1000).toISOString().slice(0,10); counts.set(date, (counts.get(date) || 0) + 1); } });
    return NextResponse.json({ days: days.map((day) => ({ ...day, count: counts.get(day.date) || 0 })), fallback: false }, { headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" } });
  } catch { return NextResponse.json({ days, fallback: true }, { headers: { "Cache-Control": "public, s-maxage=3600" } }); }
}
