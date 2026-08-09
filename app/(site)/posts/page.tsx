import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, Rss } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "전체 글",
  description: "개발, 알고리즘, 기술과 일상에 관한 asterunee의 모든 글",
  alternates: { canonical: "/posts" },
};

export default function PostsPage() {
  const posts = getPosts();
  const categories = [...posts.reduce((counts, post) => counts.set(post.category, (counts.get(post.category) || 0) + 1), new Map<string, number>())].sort((a, b) => b[1] - a[1]);
  const tags = [...posts.flatMap((post) => post.tags).reduce((counts, tag) => counts.set(tag, (counts.get(tag) || 0) + 1), new Map<string, number>())].sort((a, b) => b[1] - a[1]);

  return <div className="editorial-page">
    <header className="page-shell editorial-page-header">
      <nav className="page-breadcrumb" aria-label="현재 위치"><Link href="/">홈</Link><span>/</span><span>전체 글</span></nav>
      <div className="editorial-title-row">
        <div><h1>전체 글</h1></div>
        <p>개발과 알고리즘, 도구와 배움에 관해 직접 경험하고 이해한 내용을 씁니다.</p>
      </div>
    </header>

    <div className="page-shell editorial-index-body">
      {categories.length > 0 && <nav className="editorial-filter-bar" aria-label="카테고리 바로가기"><Link className="active" href="/posts">전체</Link>{categories.map(([category, count]) => <Link href={`/categories/${encodeURIComponent(category)}`} key={category}>{category}<span>{count}</span></Link>)}</nav>}

      <div className="editorial-index-layout">
        <main>
          <header className="editorial-section-title"><h2>최신 글</h2><span>{posts.length}편</span></header>
          {posts.length ? <section className="blog-feed editorial-post-feed">{posts.map((post) => <PostCard key={post.slug} post={post} />)}</section> : <section className="editorial-empty"><BookOpenText size={22} /><h2>아직 공개된 글이 없습니다</h2><p>첫 글을 준비하고 있습니다. 새 글은 RSS로도 받아볼 수 있습니다.</p><Link href="/rss.xml">RSS 구독하기 <ArrowRight size={14} /></Link></section>}
        </main>

        <aside className="editorial-sidebar">
          <nav className="editorial-quick-links" aria-label="글 탐색"><Link href="/archive"><span>아카이브</span><ArrowRight size={14} /></Link><Link href="/categories"><span>카테고리</span><ArrowRight size={14} /></Link><Link href="/rss.xml"><span>RSS 구독</span><Rss size={14} /></Link></nav>
          <section><h2>카테고리</h2>{categories.length ? <div className="editorial-sidebar-list">{categories.slice(0, 8).map(([category, count]) => <Link key={category} href={`/categories/${encodeURIComponent(category)}`}><span>{category}</span><small>{count}</small></Link>)}</div> : <p>글이 공개되면 카테고리가 표시됩니다.</p>}</section>
          {tags.length > 0 && <section><h2>태그</h2><div className="editorial-tag-list">{tags.slice(0, 12).map(([tag]) => <Link href={`/tags/${encodeURIComponent(tag)}`} key={tag}>#{tag}</Link>)}</div></section>}
        </aside>
      </div>
    </div>
  </div>;
}
