export const analyticsCookie = "asterunee-visitor";
export const analyticsPrefix = "analytics/events";

export type AnalyticsPoint = { label: string; visitors: number; pageviews: number };
export type AnalyticsReport = {
  generatedAt: string;
  rangeDays: number;
  selectedDate: string;
  today: { visitors: number; pageviews: number };
  totals: { visitors: number; pageviews: number };
  days: AnalyticsPoint[];
  hours: AnalyticsPoint[];
  topPages: { pathname: string; pageviews: number; visitors: number }[];
};

export type AnalyticsEvent = { date: string; hour: string; visitorId: string; pathname: string };

const visitorPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export function isVisitorId(value: string) {
  return visitorPattern.test(value);
}

export function normalizeAnalyticsPath(value: unknown) {
  if (typeof value !== "string") return null;
  const pathname = value.trim().split(/[?#]/, 1)[0];
  if (!pathname.startsWith("/") || pathname.startsWith("//") || pathname.length > 300) return null;
  if (["/admin", "/api", "/keystatic", "/_next"].some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) return null;
  return pathname.replace(/\/{2,}/g, "/");
}

export function getKstParts(date = new Date()) {
  const shifted = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const year = shifted.getUTCFullYear();
  const month = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const day = String(shifted.getUTCDate()).padStart(2, "0");
  const hour = String(shifted.getUTCHours()).padStart(2, "0");
  return { date: `${year}-${month}-${day}`, hour };
}

export function getDateRange(days: number, end = new Date()) {
  const { date: endDate } = getKstParts(end);
  const [year, month, day] = endDate.split("-").map(Number);
  const base = Date.UTC(year, month - 1, day);
  return Array.from({ length: days }, (_, index) => new Date(base - (days - index - 1) * 86_400_000).toISOString().slice(0, 10));
}

function encodePath(pathname: string) {
  return Buffer.from(pathname, "utf8").toString("base64url");
}

function decodePath(value: string) {
  try {
    const pathname = Buffer.from(value, "base64url").toString("utf8");
    return normalizeAnalyticsPath(pathname);
  } catch {
    return null;
  }
}

export function createAnalyticsEventPath(visitorId: string, pathname: string, now = new Date(), eventId = crypto.randomUUID()) {
  if (!isVisitorId(visitorId)) throw new Error("Invalid visitor id");
  const normalized = normalizeAnalyticsPath(pathname);
  if (!normalized) throw new Error("Invalid analytics path");
  const parts = getKstParts(now);
  return `${analyticsPrefix}/${parts.date}/${parts.hour}/${visitorId}/p_${encodePath(normalized)}/${now.getTime()}-${eventId}.json`;
}

export function parseAnalyticsEventPath(pathname: string): AnalyticsEvent | null {
  const parts = pathname.split("/");
  if (parts.length !== 7 || parts[0] !== "analytics" || parts[1] !== "events" || !datePattern.test(parts[2]) || !/^([01]\d|2[0-3])$/.test(parts[3]) || !isVisitorId(parts[4]) || !parts[5].startsWith("p_") || !parts[6].endsWith(".json")) return null;
  const decoded = decodePath(parts[5].slice(2));
  return decoded ? { date: parts[2], hour: parts[3], visitorId: parts[4], pathname: decoded } : null;
}

export function aggregateAnalytics(pathnames: string[], dayKeys: string[], selectedDate: string, todayDate: string): AnalyticsReport {
  const events = pathnames.map(parseAnalyticsEventPath).filter((event): event is AnalyticsEvent => Boolean(event));
  const count = (items: AnalyticsEvent[]) => ({ visitors: new Set(items.map((event) => event.visitorId)).size, pageviews: items.length });
  const rangeEvents = events.filter((event) => dayKeys.includes(event.date));
  const today = count(events.filter((event) => event.date === todayDate));
  const totals = count(rangeEvents);
  const days = dayKeys.map((date) => ({ label: date, ...count(rangeEvents.filter((event) => event.date === date)) }));
  const selectedEvents = events.filter((event) => event.date === selectedDate);
  const hours = Array.from({ length: 24 }, (_, hour) => {
    const label = String(hour).padStart(2, "0");
    return { label, ...count(selectedEvents.filter((event) => event.hour === label)) };
  });
  const groupedPages = new Map<string, AnalyticsEvent[]>();
  for (const event of rangeEvents) groupedPages.set(event.pathname, [...(groupedPages.get(event.pathname) || []), event]);
  const topPages = [...groupedPages].map(([pathname, pageEvents]) => ({ pathname, ...count(pageEvents) })).sort((a, b) => b.pageviews - a.pageviews || b.visitors - a.visitors).slice(0, 10);
  return { generatedAt: new Date().toISOString(), rangeDays: dayKeys.length, selectedDate, today, totals, days, hours, topPages };
}
