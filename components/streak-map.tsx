"use client";
import { useEffect, useState } from "react";

type Day = { date: string; count: number };

export function StreakMap({ judge = "Codeforces" }: { judge?: "Codeforces" | "AtCoder" }) {
  const [days, setDays] = useState<Day[]>([]);
  const [fallback, setFallback] = useState(false);
  const endpoint = judge === "AtCoder" ? "/api/atcoder" : "/api/codeforces";
  useEffect(() => { fetch(endpoint).then((r) => r.json()).then((data) => { setDays(data.days); setFallback(data.fallback); }).catch(() => setFallback(true)); }, [endpoint]);
  if (!days.length) return <div className="streak-loading" aria-live="polite">제출 활동을 불러오는 중…</div>;
  return <div><div className="streak-map" role="list" aria-label={`최근 98일 ${judge} 제출 활동`}>
    {days.map((day) => <button key={day.date} role="listitem" className={`streak-star level-${Math.min(4, day.count)}`} aria-label={`${day.date}: ${day.count}회 제출`} title={`${day.date} · ${day.count} submissions`}><span /></button>)}
  </div><div className="streak-legend"><span>적음</span>{[0,1,2,3,4].map((v) => <i key={v} className={`level-${v}`} />)}<span>많음</span></div><p className="microcopy">최근 98일 UTC 날짜별 제출 횟수입니다.{fallback && " 현재 활동 데이터를 불러오지 못했습니다."}</p></div>;
}
