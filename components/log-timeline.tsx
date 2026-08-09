"use client";

import Link from "next/link";
import { ArrowRight, PencilLine } from "lucide-react";
import { useMemo, useState } from "react";
import type { LogPost } from "@/lib/content";

export function LogTimeline({ posts }: { posts: LogPost[] }) {
  const years = [...new Set(posts.map((post) => post.date.slice(0, 4)))];
  const [year, setYear] = useState(years[0] || "all");
  const [month, setMonth] = useState("all");
  const months = [...new Set(posts.filter((post) => year === "all" || post.date.startsWith(year)).map((post) => post.date.slice(5, 7)))];
  const entries = useMemo(() => posts.filter((post) => (year === "all" || post.date.startsWith(year)) && (month === "all" || post.date.slice(5, 7) === month)), [posts, year, month]);

  if (!posts.length) return <section className="content-empty content-empty-page"><PencilLine size={24} /><h2>아직 공개된 기록이 없습니다</h2><p>형식을 정하지 않아도 좋습니다. 작성기에서 첫 기록을 남겨보세요.</p><Link href="/keystatic">작성기 열기 <ArrowRight size={14} /></Link></section>;

  return <><div className="log-controls">{years.map((value) => <button key={value} className={year === value ? "active" : ""} onClick={() => { setYear(value); setMonth("all"); }} aria-pressed={year === value}>{value}</button>)}<label>월<select value={month} onChange={(event) => setMonth(event.target.value)}><option value="all">전체</option>{months.map((value) => <option key={value} value={value}>{value}</option>)}</select></label><span>{entries.length} records</span></div><section className="logbook">{entries.map((entry, index) => <article key={entry.slug}><div><time>{entry.date.slice(5).replace("-", " / ")}</time><span>LOG-{String(index + 1).padStart(3, "0")}</span></div><i /><Link href={`/log/${entry.slug}`}><p>{entry.type}{entry.mood ? ` · ${entry.mood}` : ""}</p><h2>{entry.title}</h2><p>{entry.description}</p></Link></article>)}{!entries.length && <div className="empty-state">이 기간의 기록은 아직 없습니다.</div>}</section></>;
}
