import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenText, Rss } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = { title: "전체 글", description: "개발, 알고리즘, 기술과 일상에 관한 asterunee의 모든 글", alternates: { canonical: "/posts" } };

export default function PostsPage() {
  const posts = getPosts();
  const categories = [...posts.reduce((counts, post) => counts.set(post.category, (counts.get(post.category) || 0) + 1), new Map<string, number>())];
  return <div className="page-shell archive-page">
    <header className="page-title"><span className="section-index">ALL POSTS</span><h1>전체 글</h1><p>개발과 알고리즘부터 도구, 배움과 일상까지 다양한 이야기를 전합니다.</p></header>
    {categories.length > 0 && <nav className="category-strip" aria-label="카테고리 바로가기"><Link href="/categories">전체 카테고리</Link>{categories.map(([category, count]) => <Link href={`/categories/${encodeURIComponent(category)}`} key={category}>{category}<span>{count}</span></Link>)}</nav>}
    {posts.length ? <section className="blog-feed standalone-feed">{posts.map((post) => <PostCard key={post.slug} post={post} />)}</section> : <section className="content-empty content-empty-page"><BookOpenText size={24} /><h2>새로운 글을 준비하고 있습니다</h2><p>곧 첫 글로 인사드릴게요. RSS를 구독하면 새 글을 가장 먼저 확인할 수 있습니다.</p><Link href="/rss.xml">RSS 구독하기 <Rss size={14} /></Link></section>}
  </div>;
}
