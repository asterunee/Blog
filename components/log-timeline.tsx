"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LogPost } from "@/lib/content";

export function LogTimeline({ posts }: { posts: LogPost[] }) {
  const years = [...new Set(posts.map((post) => post.date.slice(0, 4)))];
  const [year, setYear] = useState(years[0] || "all");
  const [month, setMonth] = useState("all");
  const months = [...new Set(posts.filter((post) => year === "all" || post.date.startsWith(year)).map((post) => post.date.slice(5, 7)))];
  const entries = useMemo(() => posts.filter((post) => (year === "all" || post.date.startsWith(year)) && (month === "all" || post.date.slice(5, 7) === month)), [posts, year, month]);

  return <><div className="log-controls">{years.map((value) => <button key={value} className={year === value ? "active" : ""} onClick={() => { setYear(value); setMonth("all"); }} aria-pressed={year === value}>{value}</button>)}<label>월<select value={month} onChange={(event) => setMonth(event.target.value)}><option value="all">전체</option>{months.map((value) => <option key={value} value={value}>{value}</option>)}</select></label><span>{entries.length} observations</span></div><section className="logbook">{entries.map((entry, index) => <article key={entry.slug}><div><time>{entry.date.slice(5).replace("-", " / ")}</time><span>OBS-{String(index + 1).padStart(3, "0")}</span></div><i /><Link href={`/log/${entry.slug}`}><p>{entry.type}</p><h2>{entry.title}</h2><p>{entry.description}</p></Link></article>)}{!entries.length && <div className="empty-state">이 기간의 기록은 아직 없습니다.</div>}</section></>;
}
