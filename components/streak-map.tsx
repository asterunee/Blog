"use client";
import { useEffect, useState } from "react";

type Day = { date: string; count: number };

export function StreakMap() {
  const [days, setDays] = useState<Day[]>([]);
  const [fallback, setFallback] = useState(false);
  useEffect(() => { fetch("/api/codeforces").then((r) => r.json()).then((data) => { setDays(data.days); setFallback(data.fallback); }).catch(() => setFallback(true)); }, []);
  if (!days.length) return <div className="streak-loading" aria-live="polite">먼 별의 관측 신호를 기다리는 중…</div>;
  return <div><div className="streak-map" role="list" aria-label="최근 98일 Codeforces 제출 활동">
    {days.map((day) => <button key={day.date} role="listitem" className={`streak-star level-${Math.min(4, day.count)}`} aria-label={`${day.date}: ${day.count}회 제출`} title={`${day.date} · ${day.count} submissions`}><span /></button>)}
  </div><div className="streak-legend"><span>less</span>{[0,1,2,3,4].map((v) => <i key={v} className={`level-${v}`} />)}<span>more</span></div><p className="microcopy">UTC 날짜별 제출 횟수 · 매일 00:00 UTC에 연속 기록을 계산합니다.{fallback && " 현재 정적 관측값을 표시 중입니다."}</p></div>;
}
