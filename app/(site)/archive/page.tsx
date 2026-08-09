import type { Metadata } from "next";
import Link from "next/link";
import { getAllContentEntries } from "@/lib/content-index";

export const metadata: Metadata = { title: "아카이브", description: "asterunee의 모든 글과 기록을 연도와 월로 탐색합니다.", alternates: { canonical: "/archive" } };
export default function ArchivePage() {
  const entries = getAllContentEntries();
  const groups = Map.groupBy(entries, (entry) => entry.date.slice(0,7));
  return <div className="page-shell archive-index"><header className="page-title"><h1>아카이브</h1><p>모든 글과 콘텐츠를 날짜순으로 한곳에서 둘러보세요.</p></header>{entries.length ? [...groups].map(([month, posts]) => <section key={month}><h2>{month.replace("-", " / ")}</h2><div>{posts.map((post) => <Link href={post.href} key={post.href}><time>{post.date.slice(8)}</time><span>{post.kind}</span><h3>{post.title}</h3></Link>)}</div></section>) : <div className="content-empty content-empty-page"><h2>새 글을 준비하고 있습니다</h2><p>공개된 글은 이곳에서 월별로 편하게 찾아볼 수 있습니다.</p><Link href="/rss.xml">RSS로 소식 받기 →</Link></div>}</div>;
}
