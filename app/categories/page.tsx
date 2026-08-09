import type { Metadata } from "next";
import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "카테고리",
  description: "개발, 알고리즘, 도구와 일상 등 주제별로 asterunee의 글을 둘러봅니다.",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  const categories = [...getPosts().reduce((counts, post) => counts.set(post.category, (counts.get(post.category) || 0) + 1), new Map<string, number>())].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ko"));
  return <div className="page-shell">
    <header className="page-title"><span className="section-index">CATEGORY INDEX</span><h1>카테고리</h1><p>관심 있는 주제를 골라 asterunee의 글을 이어서 읽어보세요.</p></header>
    {categories.length ? <div className="category-index">{categories.map(([category, count]) => <Link href={`/categories/${encodeURIComponent(category)}`} key={category}><FolderOpen size={20} /><div><h2>{category}</h2><p>{count}개의 글</p></div><span>둘러보기 →</span></Link>)}</div> : <section className="content-empty content-empty-page"><FolderOpen size={24} /><h2>카테고리별 글을 준비 중입니다</h2><p>첫 글이 공개되면 주제별 카테고리가 이곳에 표시됩니다.</p><Link href="/posts">전체 글 둘러보기 →</Link></section>}
  </div>;
}
