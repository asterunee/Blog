"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { ContentIndexEntry } from "@/lib/content-index";

type UnifiedEntry = ContentIndexEntry & { categoryName: string };

export function AllPostsExplorer({ entries }: { entries: UnifiedEntry[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const categories = useMemo(() => [...entries.reduce((map, entry) => map.set(entry.category, { name: entry.categoryName, count: (map.get(entry.category)?.count || 0) + 1 }), new Map<string, { name: string; count: number }>())], [entries]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return entries.filter((entry) => (category === "all" || entry.category === category) && (!needle || [entry.title, entry.description, entry.kind, entry.categoryName, ...entry.tags, ...entry.algorithmTopics].join(" ").toLocaleLowerCase().includes(needle)));
  }, [category, entries, query]);

  return <>
    <div className="all-posts-controls">
      <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="제목, 내용, 태그 검색" aria-label="글 검색" /></label>
      <label><span>카테고리</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">전체 카테고리</option>{categories.map(([slug, item]) => <option value={slug} key={slug}>{item.name} ({item.count})</option>)}</select></label>
    </div>
    <header className="editorial-section-title unified-feed-title"><h2>{category === "all" ? "최신 글" : categories.find(([slug]) => slug === category)?.[1].name}</h2><span>{filtered.length}편</span></header>
    {filtered.length ? <section className="unified-post-feed">{filtered.map((entry) => <article key={entry.href}><Link href={entry.href} prefetch={false}><div className="unified-post-meta"><span>{entry.kind} · {entry.categoryName}</span><time>{entry.date}</time></div><h2>{entry.title}</h2><p>{entry.description}</p>{entry.tags.length > 0 && <div className="tag-row">{entry.tags.slice(0, 6).map((tag) => <span key={tag}>{tag}</span>)}</div>}</Link></article>)}</section> : <section className="editorial-empty"><h2>조건에 맞는 글이 없습니다</h2><p>검색어나 카테고리를 변경해 보세요.</p></section>}
  </>;
}
