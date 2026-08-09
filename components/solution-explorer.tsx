"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Grid2X2, List, Search, SlidersHorizontal } from "lucide-react";
import { useMemo } from "react";
import type { Solution } from "@/lib/content";

export function SolutionExplorer({ posts }: { posts: Solution[] }) {
  const params = useSearchParams(); const router = useRouter(); const pathname = usePathname();
  const q = params.get("q") || ""; const tag = params.get("tag") || "all"; const judge = params.get("judge") || "all";
  const min = Number(params.get("min") || 0); const max = Number(params.get("max") || 4000); const sort = params.get("sort") || "latest"; const view = params.get("view") || "list";
  const tags = [...new Set(posts.flatMap((p) => p.tags))]; const judges = [...new Set(posts.map((p) => p.judge))];
  const set = (key: string, value: string) => { const next = new URLSearchParams(params); if (!value || value === "all") next.delete(key); else next.set(key, value); router.replace(`${pathname}?${next.toString()}`, { scroll: false }); };
  const filtered = useMemo(() => posts.filter((p) => [p.title, p.description, p.problemId, ...p.tags, p.body].join(" ").toLowerCase().includes(q.toLowerCase()) && (tag === "all" || p.tags.includes(tag)) && (judge === "all" || p.judge === judge) && p.difficulty >= min && p.difficulty <= max).sort((a,b) => sort === "difficulty" ? b.difficulty-a.difficulty : sort === "title" ? a.title.localeCompare(b.title, "ko") : b.date.localeCompare(a.date)), [posts,q,tag,judge,min,max,sort]);
  return <>
    <div className="explorer-bar"><label className="search-field"><Search size={18} /><input value={q} onChange={(e) => set("q", e.target.value)} placeholder="제목, 태그, 본문 검색" /></label><div className="view-switch"><button className={view === "list" ? "active" : ""} onClick={() => set("view", "list")} aria-label="목록 보기"><List size={18} /></button><button className={view === "grid" ? "active" : ""} onClick={() => set("view", "grid")} aria-label="격자 보기"><Grid2X2 size={18} /></button></div></div>
    <div className="filters"><span><SlidersHorizontal size={15} /> 필터</span><label>태그<select value={tag} onChange={(e) => set("tag", e.target.value)}><option value="all">전체</option>{tags.map((v) => <option key={v}>{v}</option>)}</select></label><label>저지<select value={judge} onChange={(e) => set("judge", e.target.value)}><option value="all">전체</option>{judges.map((v) => <option key={v}>{v}</option>)}</select></label><label>난이도<input type="number" value={min} onChange={(e) => set("min", e.target.value)} aria-label="최소 난이도" /><span>—</span><input type="number" value={max} onChange={(e) => set("max", e.target.value)} aria-label="최대 난이도" /></label><label>정렬<select value={sort} onChange={(e) => set("sort", e.target.value)}><option value="latest">최신순</option><option value="difficulty">난이도순</option><option value="title">제목순</option></select></label></div>
    <p className="result-count">{filtered.length}개 풀이</p>
    <div className={`solution-results ${view}`}>{filtered.map((post, index) => <Link key={post.slug} className="solution-row" href={`/solutions/${post.slug}`}>
      <span className="catalog-no">{String(index + 1).padStart(2,"0")}</span><div className="solution-main"><div><span className="status-dot" />{post.status}</div><h2>{post.title}</h2><p>{post.description}</p><div className="tag-row">{post.tags.map((t) => <span key={t}>{t}</span>)}</div></div><dl><div><dt>출처</dt><dd>{post.judge} · {post.problemId}</dd></div><div><dt>난이도</dt><dd>{post.difficulty} · {post.tier}</dd></div><div><dt>작성일</dt><dd>{post.date} · {post.solveTime}분</dd></div></dl>
    </Link>)}</div>
    {!filtered.length && <div className="empty-state">{posts.length ? "이 조건과 일치하는 풀이가 없습니다." : "첫 PS 풀이를 준비하고 있습니다. Codeforces와 AtCoder를 비롯한 다양한 문제의 접근 과정을 곧 공유합니다."}</div>}
  </>;
}
