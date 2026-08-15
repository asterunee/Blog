import { NextResponse } from "next/server";
import { getLeetCodeActivity } from "@/lib/leetcode";

export const revalidate = 21600;

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
  try {
    const activity = await getLeetCodeActivity();
    const counts = new Map(Object.entries(activity.submissionCalendar).map(([timestamp, count]) => [new Date(Number(timestamp) * 1000).toISOString().slice(0, 10), count]));
    return NextResponse.json({ days: days.map((day) => ({ ...day, count: counts.get(day.date) || 0 })), fallback: false, summary: { solved: activity.solved, easy: activity.easy, medium: activity.medium, hard: activity.hard, streak: activity.streak, totalActiveDays: activity.totalActiveDays, contestRating: activity.contestRating, attendedContests: activity.attendedContests, badge: activity.badge } }, { headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" } });
  } catch {
    return NextResponse.json({ days, fallback: true }, { headers: { "Cache-Control": "public, s-maxage=3600" } });
  }
}
