"use client";

import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";

type TodayData = { date?: string; visitors?: number; pageviews?: number };

export function DailyVisitors() {
  const [data, setData] = useState<TodayData | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/analytics", { signal: controller.signal }).then(async (response) => response.ok ? response.json() as Promise<TodayData> : null).then(setData).catch(() => undefined);
    return () => controller.abort();
  }, []);

  if (!data || typeof data.visitors !== "number" || typeof data.pageviews !== "number") return null;
  return <section className="blog-widget visitor-widget" aria-label="오늘 방문 통계">
    <h3><BarChart3 size={14} /> 오늘의 방문</h3>
    <div><strong>{data.visitors.toLocaleString("ko-KR")}</strong><span>명 방문</span><i /><strong>{data.pageviews.toLocaleString("ko-KR")}</strong><span>회 조회</span></div>
    <p>개인을 식별하지 않는 익명 집계입니다.</p>
  </section>;
}
