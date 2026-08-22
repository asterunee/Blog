"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, ArrowLeft, BarChart3, Eye, ExternalLink, RefreshCw, UsersRound } from "lucide-react";
import type { AnalyticsPoint, AnalyticsReport } from "@/lib/analytics";
import styles from "@/app/admin/analytics/analytics-admin.module.css";

type AnalyticsResponse = Partial<AnalyticsReport> & { error?: string };

function TrendChart({ points }: { points: AnalyticsPoint[] }) {
  const width = 920;
  const height = 250;
  const padding = { top: 20, right: 16, bottom: 34, left: 42 };
  const max = Math.max(1, ...points.flatMap((point) => [point.visitors, point.pageviews]));
  const x = (index: number) => padding.left + index * ((width - padding.left - padding.right) / Math.max(1, points.length - 1));
  const y = (value: number) => height - padding.bottom - value / max * (height - padding.top - padding.bottom);
  const line = (key: "visitors" | "pageviews") => points.map((point, index) => `${x(index)},${y(point[key])}`).join(" ");
  const guides = [0, .25, .5, .75, 1];
  return <div className={styles.chartFrame}>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="날짜별 방문자와 페이지 조회 추이">
      {guides.map((ratio) => <g key={ratio}><line x1={padding.left} x2={width - padding.right} y1={y(max * ratio)} y2={y(max * ratio)} className={styles.guide} /><text x={padding.left - 9} y={y(max * ratio) + 4} textAnchor="end">{Math.round(max * ratio)}</text></g>)}
      <polyline points={line("pageviews")} className={styles.viewsLine} />
      <polyline points={line("visitors")} className={styles.visitorsLine} />
      {points.map((point, index) => (index === 0 || index === points.length - 1 || index % Math.max(1, Math.ceil(points.length / 7)) === 0) && <text key={point.label} x={x(index)} y={height - 8} textAnchor={index === 0 ? "start" : index === points.length - 1 ? "end" : "middle"}>{point.label.slice(5).replace("-", ".")}</text>)}
    </svg>
  </div>;
}

function HourlyChart({ points }: { points: AnalyticsPoint[] }) {
  const max = Math.max(1, ...points.map((point) => point.pageviews));
  return <div className={styles.hourlyChart} aria-label="시간대별 페이지 조회">
    {points.map((point) => <div key={point.label} title={`${point.label}시 · ${point.visitors}명 · ${point.pageviews}회`}><span style={{ height: `${Math.max(point.pageviews ? 5 : 0, point.pageviews / max * 100)}%` }} /><b>{Number(point.label) % 3 === 0 ? point.label : ""}</b></div>)}
  </div>;
}

export function AnalyticsAdmin() {
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [days, setDays] = useState(30);
  const [selectedDate, setSelectedDate] = useState(() => new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10));
  const [message, setMessage] = useState("방문 통계를 불러오는 중…");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (nextDays = days, nextDate = selectedDate) => {
    setBusy(true);
    try {
      const query = new URLSearchParams({ admin: "1", days: String(nextDays) });
      query.set("date", nextDate);
      const response = await fetch(`/api/analytics?${query}`, { cache: "no-store" });
      const data = await response.json() as AnalyticsResponse;
      if (!response.ok || !data.days || !data.hours || !data.today || !data.totals || !data.topPages || !data.generatedAt || !data.selectedDate || !data.rangeDays) throw new Error(data.error || "통계를 불러오지 못했습니다.");
      const complete = data as AnalyticsReport;
      setReport(complete);
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "통계를 불러오지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }, [days, selectedDate]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => void load());
    return () => cancelAnimationFrame(frame);
  }, [load]);

  const average = report ? report.totals.pageviews / report.rangeDays : 0;
  const number = useMemo(() => new Intl.NumberFormat("ko-KR"), []);

  return <main className={styles.page}>
    <header className={styles.header}>
      <div><nav><Link href="/keystatic"><ArrowLeft size={15} /> 작성기로 돌아가기</Link><Link href="/admin/comments">댓글 관리</Link></nav><span>ASTERUNEE STUDIO</span><h1>방문 통계</h1><p>익명으로 집계한 방문자와 페이지 조회 흐름을 날짜와 시간대별로 확인합니다.</p></div>
      <button type="button" onClick={() => void load()} disabled={busy}><RefreshCw size={15} className={busy ? styles.spinning : ""} /> 새로고침</button>
    </header>

    <section className={styles.controls}>
      <label>조회 기간<select value={days} onChange={(event) => setDays(Number(event.target.value))}><option value={7}>최근 7일</option><option value={14}>최근 14일</option><option value={30}>최근 30일</option><option value={90}>최근 90일</option></select></label>
      <label>시간대 상세 날짜<input type="date" value={selectedDate} max={report?.days.at(-1)?.label} onChange={(event) => setSelectedDate(event.target.value)} /></label>
      {report && <span>마지막 집계 · {new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(report.generatedAt))}</span>}
    </section>

    {message && <p className={styles.message} aria-live="polite">{message}</p>}
    {report && <>
      <section className={styles.summary} aria-label="방문 통계 요약">
        <article><UsersRound size={18} /><span>오늘 방문자</span><strong>{number.format(report.today.visitors)}</strong><small>명</small></article>
        <article><Eye size={18} /><span>오늘 조회</span><strong>{number.format(report.today.pageviews)}</strong><small>회</small></article>
        <article><Activity size={18} /><span>{report.rangeDays}일 방문자</span><strong>{number.format(report.totals.visitors)}</strong><small>명</small></article>
        <article><BarChart3 size={18} /><span>일평균 조회</span><strong>{number.format(Math.round(average * 10) / 10)}</strong><small>회</small></article>
      </section>

      <section className={styles.panel}>
        <header><div><span>DAILY TREND</span><h2>일별 방문 흐름</h2></div><div className={styles.legend}><i className={styles.visitorKey} /> 방문자 <i className={styles.viewKey} /> 페이지 조회</div></header>
        <TrendChart points={report.days} />
      </section>

      <section className={styles.grid}>
        <section className={styles.panel}>
          <header><div><span>HOURLY VIEW</span><h2>{report.selectedDate} 시간대별 조회</h2></div></header>
          <HourlyChart points={report.hours} />
          <p className={styles.note}>한국 표준시(KST) 기준 · 막대에 마우스를 올리면 방문자와 조회 수를 볼 수 있습니다.</p>
        </section>
        <section className={styles.panel}>
          <header><div><span>TOP PAGES</span><h2>많이 읽은 페이지</h2></div></header>
          {report.topPages.length ? <ol className={styles.pages}>{report.topPages.map((page) => <li key={page.pathname}><Link href={page.pathname} target="_blank"><span>{page.pathname}</span><ExternalLink size={12} /></Link><div><b>{number.format(page.pageviews)}회</b><small>{number.format(page.visitors)}명</small></div></li>)}</ol> : <p className={styles.empty}>선택한 기간에 집계된 방문이 없습니다.</p>}
        </section>
      </section>
    </>}
  </main>;
}
