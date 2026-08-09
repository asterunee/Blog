import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, ChevronDown, Code2, Folder, FolderOpen, NotebookPen } from "lucide-react";
import { getLogs, getPosts, getSolutions } from "@/lib/content";
import { getManagedCategories } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: "카테고리",
  description: "개발, 알고리즘, 도구와 일상 등 주제별로 asterunee의 글을 둘러봅니다.",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  const posts = getPosts();
  const solutions = getSolutions();
  const logs = getLogs();
  const managedCategories = getManagedCategories().filter((category) => category.visible);
  const articleCounts = posts.reduce((counts, post) => counts.set(post.category, (counts.get(post.category) || 0) + 1), new Map<string, number>());
  const managedSlugs = new Set(managedCategories.map((category) => category.slug));
  const articleCategories = [
    ...managedCategories.map((category) => [category.slug, category.name, articleCounts.get(category.slug) || 0] as const),
    ...[...articleCounts].filter(([slug]) => !managedSlugs.has(slug)).map(([slug, count]) => [slug, slug, count] as const),
  ];
  const judges = [...solutions.reduce((counts, post) => counts.set(post.judge, (counts.get(post.judge) || 0) + 1), new Map<string, number>())].sort((a, b) => b[1] - a[1]);
  const logTypes = [...logs.reduce((counts, post) => counts.set(post.type, (counts.get(post.type) || 0) + 1), new Map<string, number>())].sort((a, b) => b[1] - a[1]);
  const groups = [
    { label: "일반 글", icon: BookOpenText, count: posts.length, entries: articleCategories.map(([slug, name, count]) => ({ name, count, href: `/categories/${encodeURIComponent(slug)}` })) },
    { label: "PS 풀이", icon: Code2, count: solutions.length, entries: judges.map(([name, count]) => ({ name, count, href: `/judge/${encodeURIComponent(name)}` })) },
    { label: "짧은 기록", icon: NotebookPen, count: logs.length, entries: logTypes.map(([name, count]) => ({ name, count, href: "/log" })) },
  ].filter((group) => group.entries.length > 0);
  const recent = [
    ...posts.map((post) => ({ title: post.title, href: `/posts/${post.slug}`, date: post.updated, kind: post.category })),
    ...solutions.map((post) => ({ title: post.title, href: `/solutions/${post.slug}`, date: post.updated, kind: "PS 풀이" })),
    ...logs.map((post) => ({ title: post.title, href: `/log/${post.slug}`, date: post.updated, kind: post.type })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return <div className="editorial-page">
    <header className="page-shell editorial-page-header">
      <nav className="page-breadcrumb" aria-label="현재 위치"><Link href="/">홈</Link><span>/</span><span>카테고리</span></nav>
      <div className="editorial-title-row"><div><h1>카테고리</h1></div><p>글, 문제 풀이와 짧은 기록을 관심 있는 주제부터 차례로 둘러보세요.</p></div>
    </header>

    <div className="page-shell editorial-category-layout">
      <main>
        <header className="editorial-section-title"><h2>주제별 보기</h2><Link href="/posts">전체 글 <ArrowRight size={14} /></Link></header>
        {groups.length ? <div className="editorial-folders">{groups.map((group, index) => { const Icon = group.icon; return <details key={group.label} open={index === 0}><summary><Icon size={18} /><div><b>{group.label}</b><small>{group.entries.length}개 분류 · {group.count}개 기록</small></div><ChevronDown size={16} /></summary><div>{group.entries.map((entry) => <Link href={entry.href} key={`${group.label}-${entry.name}`}><Folder size={15} /><span>{entry.name}</span><small>{entry.count}</small><ArrowRight size={13} /></Link>)}</div></details>; })}</div> : <section className="editorial-empty"><FolderOpen size={22} /><h2>아직 공개된 카테고리가 없습니다</h2><p>새로운 주제가 정리되면 이곳에서 한눈에 둘러볼 수 있습니다.</p><Link href="/posts">전체 글 보기 <ArrowRight size={14} /></Link></section>}
      </main>

      <aside className="editorial-sidebar category-recent-sidebar">
        <section><h2>최근 업데이트</h2>{recent.length ? <div className="editorial-recent-list">{recent.slice(0, 7).map((entry) => <Link href={entry.href} key={entry.href}><small>{entry.kind} · {entry.date}</small><span>{entry.title}</span></Link>)}</div> : <p>아직 공개된 기록이 없습니다.</p>}</section>
        <Link className="editorial-side-link" href="/archive">연도별 아카이브 보기 <ArrowRight size={14} /></Link>
      </aside>
    </div>
  </div>;
}
