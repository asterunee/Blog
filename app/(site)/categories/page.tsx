import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, Code2, Folder, FolderOpen, Hash, NotebookPen } from "lucide-react";
import { getLogs, getPosts, getSolutions } from "@/lib/content";

export const metadata: Metadata = {
  title: "카테고리",
  description: "개발, 알고리즘, 도구와 일상 등 주제별로 asterunee의 글을 둘러봅니다.",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  const posts = getPosts();
  const solutions = getSolutions();
  const logs = getLogs();
  const articleCategories = [...posts.reduce((counts, post) => counts.set(post.category, (counts.get(post.category) || 0) + 1), new Map<string, number>())].sort((a, b) => b[1] - a[1]);
  const judges = [...solutions.reduce((counts, post) => counts.set(post.judge, (counts.get(post.judge) || 0) + 1), new Map<string, number>())].sort((a, b) => b[1] - a[1]);
  const logTypes = [...logs.reduce((counts, post) => counts.set(post.type, (counts.get(post.type) || 0) + 1), new Map<string, number>())].sort((a, b) => b[1] - a[1]);
  const groups = [
    { title: "Articles", label: "일반 글", icon: BookOpenText, count: posts.length, entries: articleCategories.map(([name, count]) => ({ name, count, href: `/categories/${encodeURIComponent(name)}` })) },
    { title: "Problem Solving", label: "PS 풀이", icon: Code2, count: solutions.length, entries: judges.map(([name, count]) => ({ name, count, href: `/judge/${encodeURIComponent(name)}` })) },
    { title: "Field Notes", label: "짧은 기록", icon: NotebookPen, count: logs.length, entries: logTypes.map(([name, count]) => ({ name, count, href: "/log" })) },
  ].filter((group) => group.entries.length > 0);
  const recent = [
    ...posts.map((post) => ({ title: post.title, href: `/posts/${post.slug}`, date: post.updated, kind: post.category })),
    ...solutions.map((post) => ({ title: post.title, href: `/solutions/${post.slug}`, date: post.updated, kind: "PS 풀이" })),
    ...logs.map((post) => ({ title: post.title, href: `/log/${post.slug}`, date: post.updated, kind: post.type })),
  ].sort((a, b) => b.date.localeCompare(a.date));
  const tags = [...[...posts, ...solutions, ...logs].flatMap((post) => post.tags).reduce((counts, tag) => counts.set(tag, (counts.get(tag) || 0) + 1), new Map<string, number>())].sort((a, b) => b[1] - a[1]);

  return <div className="modern-index-page category-browser-page">
    <section className="modern-page-hero compact-modern-hero"><div className="modern-page-hero-inner"><nav className="page-breadcrumb" aria-label="현재 위치"><Link href="/">asterunee</Link><span>/</span><span>카테고리</span></nav><div className="modern-hero-copy"><span className="section-index"><FolderOpen size={13} /> CATEGORY INDEX</span><h1>카테고리</h1><p>관심 있는 주제에서 시작해 글과 풀이, 짧은 기록을 이어서 둘러보세요.</p></div><div className="category-hero-mark" aria-hidden><FolderOpen /></div></div></section>
    <div className="page-shell category-browser-layout">
      <main className="category-browser-main">
        <div className="category-browser-toolbar"><div><span>{groups.length} GROUPS</span><h2>주제별 둘러보기</h2></div><Link href="/posts">전체 글 보기 <ArrowRight size={15} /></Link></div>
        {groups.length ? <div className="category-folders">{groups.map((group, groupIndex) => { const Icon = group.icon; return <details key={group.title} open={groupIndex === 0}><summary><span className="folder-icon"><Icon size={18} /></span><div><b>{group.label}</b><small>{group.entries.length}개 분류 · {group.count}개 글</small></div><span className="folder-en">{group.title}</span><ArrowRight className="folder-arrow" size={16} /></summary><div className="folder-entries">{group.entries.map((entry) => <Link href={entry.href} key={`${group.title}-${entry.name}`}><Folder size={17} /><span>{entry.name}</span><small>{entry.count} {entry.count === 1 ? "post" : "posts"}</small><ArrowRight size={14} /></Link>)}</div></details>; })}</div> : <section className="content-empty modern-empty category-empty"><FolderOpen size={25} /><span>BUILDING THE INDEX</span><h2>카테고리를 정리하고 있습니다</h2><p>첫 글과 풀이가 공개되면 이곳에 주제별 폴더가 자동으로 만들어집니다.</p><Link href="/posts">전체 글 둘러보기 <ArrowRight size={14} /></Link></section>}
      </main>
      <aside className="category-browser-aside">
        <section><header><span>RECENTLY UPDATED</span><h2>최근 업데이트</h2></header>{recent.length ? <div className="recent-mini-list">{recent.slice(0, 6).map((entry) => <Link href={entry.href} key={entry.href}><span>{entry.kind}</span><h3>{entry.title}</h3><time>{entry.date}</time></Link>)}</div> : <p className="aside-empty">새로운 글을 준비하고 있습니다.</p>}</section>
        <section><header><span><Hash size={12} /> TRENDING TAGS</span><h2>인기 태그</h2></header>{tags.length ? <div className="modern-tag-cloud">{tags.slice(0, 12).map(([tag]) => <Link href={`/tags/${encodeURIComponent(tag)}`} key={tag}>#{tag}</Link>)}</div> : <p className="aside-empty">글이 공개되면 태그가 표시됩니다.</p>}</section>
      </aside>
    </div>
  </div>;
}
