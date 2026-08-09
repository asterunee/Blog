"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { LogPost } from "@/lib/content";

export function LogTimeline({ posts }: { posts: LogPost[] }) {
  const years = ["2026", "2025"]; const [year, setYear] = useState("2026"); const [month, setMonth] = useState("all");
  const entries = useMemo(() => posts.filter((e) => e.date.startsWith(year) && (month === "all" || e.date.slice(5,7) === month)), [posts, year, month]);
  return <><div className="log-controls">{years.map((value) => <button key={value} className={year === value ? "active" : ""} onClick={() => setYear(value)} aria-pressed={year === value}>{value}</button>)}<label>월<select value={month} onChange={(e) => setMonth(e.target.value)}><option value="all">전체</option><option value="08">08</option><option value="07">07</option><option value="06">06</option></select></label><span>{entries.length} observations</span></div><section className="logbook">{entries.map((entry,i) => <article key={entry.slug}><div><time>{entry.date.slice(5).replace("-", " / ")}</time><span>OBS-{String(i+1).padStart(3,"0")}</span></div><i /><Link href={`/log/${entry.slug}`}><p>{entry.type}</p><h2>{entry.title}</h2><p>{entry.description}</p></Link></article>)}{!entries.length && <div className="empty-state">이 기간의 관측 기록은 아직 없습니다.</div>}</section></>;
}
