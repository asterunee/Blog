import type { Metadata } from "next";
import Link from "next/link";
import { getLogs, getSolutions } from "@/lib/content";

export const metadata: Metadata = { title: "아카이브", description: "asterunee의 PS 풀이와 관측 일지를 연도와 월로 탐색합니다.", alternates: { canonical: "/archive" } };
export default function ArchivePage() {
  const entries = [...getSolutions().map((post) => ({ ...post, href: `/solutions/${post.slug}`, kind: "풀이" })), ...getLogs().map((post) => ({ ...post, href: `/log/${post.slug}`, kind: post.type }))].sort((a,b) => b.date.localeCompare(a.date));
  const groups = Map.groupBy(entries, (entry) => entry.date.slice(0,7));
  return <div className="page-shell archive-index"><header className="page-title"><span className="section-index">ARCHIVE</span><h1>글 아카이브</h1><p>풀이와 관측 일지를 날짜별로 모았습니다.</p></header>{[...groups].map(([month, posts]) => <section key={month}><h2>{month.replace("-", " / ")}</h2><div>{posts.map((post) => <Link href={post.href} key={post.href}><time>{post.date.slice(8)}</time><span>{post.kind}</span><h3>{post.title}</h3></Link>)}</div></section>)}</div>;
}
