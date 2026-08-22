import { cookies } from "next/headers";
import { list, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { aggregateAnalytics, analyticsCookie, analyticsPrefix, createAnalyticsEventPath, getDateRange, getKstParts, isVisitorId, normalizeAnalyticsPath } from "@/lib/analytics";
import { isKeystaticOwner } from "@/lib/keystatic-owner";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const visitorLimits = new Map<string, { count: number; resetAt: number }>();
const botPattern = /bot|crawler|spider|slurp|headless|lighthouse|preview|vercel-screenshot/i;

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try { return new URL(origin).host === request.headers.get("host"); } catch { return false; }
}

function allowEvent(visitorId: string) {
  const now = Date.now();
  const current = visitorLimits.get(visitorId);
  if (!current || current.resetAt <= now) {
    visitorLimits.set(visitorId, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return true;
  }
  if (current.count >= 60) return false;
  current.count += 1;
  return true;
}

async function listDay(date: string) {
  const pathnames: string[] = [];
  let cursor: string | undefined;
  do {
    const result = await list({ prefix: `${analyticsPrefix}/${date}/`, limit: 1000, cursor });
    pathnames.push(...result.blobs.map((blob) => blob.pathname));
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);
  return pathnames;
}

async function canViewAnalytics() {
  const token = (await cookies()).get("keystatic-gh-access-token")?.value;
  return isKeystaticOwner(token);
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const todayDate = getKstParts().date;
  if (params.get("admin") !== "1") {
    try {
      const paths = await listDay(todayDate);
      const report = aggregateAnalytics(paths, [todayDate], todayDate, todayDate);
      return NextResponse.json({ date: todayDate, ...report.today }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
    } catch {
      return NextResponse.json({ error: "방문 통계를 불러오지 못했습니다." }, { status: 503 });
    }
  }

  if (!await canViewAnalytics()) return NextResponse.json({ error: "관리자 권한이 없습니다." }, { status: 403 });
  const requestedDays = Number(params.get("days") || 30);
  const days = [7, 14, 30, 90].includes(requestedDays) ? requestedDays : 30;
  const selectedDate = /^\d{4}-\d{2}-\d{2}$/.test(params.get("date") || "") ? params.get("date")! : todayDate;
  const dayKeys = getDateRange(days);
  const datesToLoad = [...new Set([...dayKeys, selectedDate])];
  try {
    const paths = (await Promise.all(datesToLoad.map(listDay))).flat();
    return NextResponse.json(aggregateAnalytics(paths, dayKeys, selectedDate, todayDate), { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "방문 통계를 불러오지 못했습니다." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });
  if (botPattern.test(request.headers.get("user-agent") || "")) return new NextResponse(null, { status: 204 });
  let raw: { pathname?: unknown };
  try { raw = await request.json() as { pathname?: unknown }; } catch { return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 }); }
  const pathname = normalizeAnalyticsPath(raw.pathname);
  if (!pathname) return NextResponse.json({ error: "집계할 수 없는 주소입니다." }, { status: 400 });

  const cookieStore = await cookies();
  const savedId = cookieStore.get(analyticsCookie)?.value || "";
  const visitorId = isVisitorId(savedId) ? savedId : crypto.randomUUID();
  if (!allowEvent(visitorId)) return new NextResponse(null, { status: 204 });
  try {
    const eventPath = createAnalyticsEventPath(visitorId, pathname);
    await put(eventPath, "{}", { access: "private", addRandomSuffix: false, contentType: "application/json", cacheControlMaxAge: 60 });
    const response = new NextResponse(null, { status: 201 });
    if (visitorId !== savedId) response.cookies.set(analyticsCookie, visitorId, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 365 * 24 * 60 * 60 });
    return response;
  } catch {
    return NextResponse.json({ error: "방문 기록을 저장하지 못했습니다." }, { status: 503 });
  }
}
