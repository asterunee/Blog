"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { getRatingTitle, type RatingJudge } from "@/lib/ratings";

type RatingPoint = { date: string; rating: number; change: number; contest: string; rank: number; url: string };
type RatingsResponse = { codeforces: RatingPoint[]; atcoder: RatingPoint[] };

export function RatingChart({ judge }: { judge: RatingJudge }) {
  const [points, setPoints] = useState<RatingPoint[]>([]);
  const key = judge.toLowerCase() as "codeforces" | "atcoder";

  useEffect(() => {
    fetch("/api/ratings").then((response) => response.json()).then((data: RatingsResponse) => setPoints(data[key] || [])).catch(() => setPoints([]));
  }, [key]);

  const chart = useMemo(() => {
    if (!points.length) return null;
    const width = 560;
    const height = 190;
    const padX = 22;
    const padY = 22;
    const ratings = points.map((point) => point.rating);
    const min = Math.max(0, Math.floor((Math.min(...ratings) - 150) / 200) * 200);
    const max = Math.max(min + 400, Math.ceil((Math.max(...ratings) + 150) / 200) * 200);
    const coordinates = points.map((point, index) => ({
      ...point,
      x: points.length === 1 ? width / 2 : padX + index * ((width - padX * 2) / (points.length - 1)),
      y: height - padY - ((point.rating - min) / (max - min)) * (height - padY * 2),
    }));
    return { width, height, min, max, coordinates, path: coordinates.map((point) => `${point.x},${point.y}`).join(" ") };
  }, [points]);

  if (!chart) return <div className="rating-chart-loading">레이팅 기록을 불러오는 중…</div>;
  const latest = chart.coordinates.at(-1)!;
  const title = getRatingTitle(judge, latest.rating);

  return <div className="rating-chart-wrap">
    <div className="rating-chart-summary"><span>현재 레이팅</span><strong>{latest.rating} <em>({title})</em></strong><small>{points.length}회 반영</small></div>
    <svg className="rating-chart" viewBox={`0 0 ${chart.width} ${chart.height}`} role="img" aria-label={`${judge} 레이팅 변화 그래프`}>
      {[0, 1, 2].map((line) => { const y = 22 + line * 73; return <line key={line} x1="22" y1={y} x2="538" y2={y} className="rating-grid-line" />; })}
      <polyline points={chart.path} className="rating-line" />
      {chart.coordinates.map((point) => <g key={`${point.date}-${point.contest}`}><circle cx={point.x} cy={point.y} r="4" className="rating-dot"><title>{point.date} · {point.rating} · {point.contest} · {point.rank}위</title></circle></g>)}
      <text x="22" y="16" className="rating-axis-label">{chart.max}</text><text x="22" y="184" className="rating-axis-label">{chart.min}</text>
    </svg>
    <div className="rating-chart-caption"><span>{points[0].date}</span><span>{latest.date}</span></div>
    <details className="rating-history"><summary>대회 기록 자세히 보기 <ChevronDown size={14} /></summary><div>{[...points].reverse().map((point) => <a key={`${point.date}-${point.contest}`} href={point.url} target="_blank" rel="noreferrer"><time>{point.date}</time><span>{point.contest}</span><small>{point.rank}위</small><b className={point.change >= 0 ? "positive" : "negative"}>{point.change >= 0 ? "+" : ""}{point.change}</b><em>{point.rating}</em><ExternalLink size={11} /></a>)}</div></details>
  </div>;
}
