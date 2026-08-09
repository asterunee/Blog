import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, ChevronDown, Code2, FileText, Folder, FolderOpen, NotebookPen } from "lucide-react";
import { getLogs, getPosts, getSolutions } from "@/lib/content";
import { getCategoryName, getContentTypeName, getManagedCategories, getManagedContentTypes } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: "카테고리",
  description: "개발, 알고리즘, 도구와 일상 등 주제와 글 형식별로 asterunee의 글을 둘러봅니다.",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  const posts = getPosts();
  const solutions = getSolutions();
  const logs = getLogs();
  const allEntries = [
    ...posts.map((post) => ({ category: post.category, href: `/posts/${post.slug}`, title: post.title, date: post.updated, kind: getContentTypeName(post.contentType) })),
    ...solutions.map((post) => ({ category: post.category, href: `/solutions/${post.slug}`, title: post.title, date: post.updated, kind: "PS 풀이" })),
    ...logs.map((post) => ({ category: post.category, href: `/log/${post.slug}`, title: post.title, date: post.updated, kind: post.type })),
  ];
  const counts = allEntries.reduce((map, entry) => map.set(entry.category, (map.get(entry.category) || 0) + 1), new Map<string, number>());
  const managedCategories = getManagedCategories().filter((category) => category.visible);
  const managedSlugs = new Set(managedCategories.map((category) => category.slug));
  const categories = [
    ...managedCategories.map((category) => ({ slug: category.slug, name: category.name, count: counts.get(category.slug) || 0 })),
    ...[...counts].filter(([slug]) => slug !== "uncategorized" && !managedSlugs.has(slug)).map(([slug, count]) => ({ slug, name: getCategoryName(slug), count })),
  ];
  const typeCounts = posts.reduce((map, post) => map.set(post.contentType, (map.get(post.contentType) || 0) + 1), new Map<string, number>());
  const managedTypes = getManagedContentTypes().filter((type) => type.visible);
  const managedTypeSlugs = new Set(managedTypes.map((type) => type.slug));
  const contentTypes = [
    ...managedTypes.map((type) => ({ slug: type.slug, name: type.name, count: typeCounts.get(type.slug) || 0 })),
    ...[...typeCounts].filter(([slug]) => !managedTypeSlugs.has(slug)).map(([slug, count]) => ({ slug, name: getContentTypeName(slug), count })),
  ];
  const judges = [...solutions.reduce((map, post) => map.set(post.judge, (map.get(post.judge) || 0) + 1), new Map<string, number>())].sort((a, b) => b[1] - a[1]);
  const logTypes = [...logs.reduce((map, post) => map.set(post.type, (map.get(post.type) || 0) + 1), new Map<string, number>())].sort((a, b) => b[1] - a[1]);
  const groups = [
    { label: "카테고리", icon: Folder, count: allEntries.length, entries: categories.map((entry) => ({ name: entry.name, count: entry.count, href: `/categories/${encodeURIComponent(entry.slug)}` })) },
    { label: "글 형식", icon: FileText, count: posts.length, entries: contentTypes.map((entry) => ({ name: entry.name, count: entry.count, href: `/types/${encodeURIComponent(entry.slug)}` })) },
    { label: "문제 출처", icon: Code2, count: solutions.length, entries: judges.map(([name, count]) => ({ name, count, href: `/judge/${encodeURIComponent(name)}` })) },
    { label: "기록 형식", icon: NotebookPen, count: logs.length, entries: logTypes.map(([name, count]) => ({ name, count, href: "/log" })) },
  ].filter((group) => group.entries.length > 0);
  const recent = allEntries.sort((a, b) => b.date.localeCompare(a.date));

  return <div className="editorial-page">
    <header className="page-shell editorial-page-header">
      <nav className="page-breadcrumb" aria-label="현재 위치"><Link href="/">홈</Link><span>/</span><span>카테고리</span></nav>
      <div className="editorial-title-row"><div><h1>카테고리</h1></div><p>주제, 글 형식, 문제 출처와 기록 종류를 원하는 방식으로 둘러보세요.</p></div>
    </header>

    <div className="page-shell editorial-category-layout">
      <main>
        <header className="editorial-section-title"><h2>분류별 보기</h2><Link href="/posts">전체 글 <ArrowRight size={14} /></Link></header>
        {groups.length ? <div className="editorial-folders">{groups.map((group, index) => { const Icon = group.icon; return <details key={group.label} open={index === 0}><summary><Icon size={18} /><div><b>{group.label}</b><small>{group.entries.length}개 분류 · {group.count}개 기록</small></div><ChevronDown size={16} /></summary><div>{group.entries.map((entry) => <Link href={entry.href} key={`${group.label}-${entry.name}`}><BookOpenText size={15} /><span>{entry.name}</span><small>{entry.count}</small><ArrowRight size={13} /></Link>)}</div></details>; })}</div> : <section className="editorial-empty"><FolderOpen size={22} /><h2>아직 공개된 분류가 없습니다</h2><p>새로운 주제가 정리되면 이곳에서 한눈에 둘러볼 수 있습니다.</p><Link href="/posts">전체 글 보기 <ArrowRight size={14} /></Link></section>}
      </main>

      <aside className="editorial-sidebar category-recent-sidebar">
        <section><h2>최근 업데이트</h2>{recent.length ? <div className="editorial-recent-list">{recent.slice(0, 7).map((entry) => <Link href={entry.href} key={entry.href}><small>{entry.kind} · {entry.date}</small><span>{entry.title}</span></Link>)}</div> : <p>아직 공개된 기록이 없습니다.</p>}</section>
        <Link className="editorial-side-link" href="/archive">연도별 아카이브 보기 <ArrowRight size={14} /></Link>
      </aside>
    </div>
  </div>;
}
