import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, Rss, Sparkles } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = { title: "전체 글", description: "개발, 알고리즘, 기술과 일상에 관한 asterunee의 모든 글", alternates: { canonical: "/posts" } };

export default function PostsPage() {
  const posts = getPosts();
  const categories = [...posts.reduce((counts, post) => counts.set(post.category, (counts.get(post.category) || 0) + 1), new Map<string, number>())].sort((a, b) => b[1] - a[1]);
  const tags = [...posts.flatMap((post) => post.tags).reduce((counts, tag) => counts.set(tag, (counts.get(tag) || 0) + 1), new Map<string, number>())].sort((a, b) => b[1] - a[1]);
  const latestUpdate = posts.reduce<string | undefined>((latest, post) => !latest || post.updated > latest ? post.updated : latest, undefined);
  return <div className="modern-index-page">
    <section className="modern-page-hero posts-modern-hero">
      <div className="modern-page-hero-inner">
        <nav className="page-breadcrumb" aria-label="현재 위치"><Link href="/">asterunee</Link><span>/</span><span>전체 글</span></nav>
        <div className="modern-hero-copy"><span className="section-index"><Sparkles size={13} /> ALL POSTS</span><h1>전체 글</h1><p>개발과 알고리즘부터 도구, 배움과 일상까지.<br />배운 것을 정리하고, 생각한 것을 나눕니다.</p></div>
        <dl className="modern-hero-stats"><div><dt>Published</dt><dd>{String(posts.length).padStart(2, "0")}</dd></div><div><dt>Categories</dt><dd>{String(categories.length).padStart(2, "0")}</dd></div><div><dt>Latest update</dt><dd>{latestUpdate || "Coming soon"}</dd></div></dl>
      </div>
    </section>

    <div className="page-shell modern-index-content">
      {categories.length > 0 && <nav className="modern-category-pills" aria-label="카테고리 바로가기"><Link className="all" href="/categories">모든 카테고리 <ArrowRight size={13} /></Link>{categories.map(([category, count]) => <Link href={`/categories/${encodeURIComponent(category)}`} key={category}>{category}<span>{count}</span></Link>)}</nav>}
      <div className="post-index-layout">
        <main className="post-index-main">
          <header className="index-section-heading"><div><span>LATEST STORIES</span><h2>최근 이야기</h2></div><p>{posts.length ? `${posts.length}개의 글을 최신순으로 보여드립니다.` : "첫 이야기를 차분히 준비하고 있습니다."}</p></header>
          {posts.length ? <section className="blog-feed standalone-feed modern-post-feed">{posts.map((post) => <PostCard key={post.slug} post={post} />)}</section> : <section className="content-empty content-empty-page modern-empty"><BookOpenText size={25} /><span>COMING SOON</span><h2>새로운 이야기를 준비하고 있습니다</h2><p>개발하며 배운 것과 문제를 풀며 발견한 생각을 곧 전해 드릴게요.</p><Link href="/rss.xml">새 글 RSS로 받아보기 <Rss size={14} /></Link></section>}
        </main>
        <aside className="modern-index-aside">
          <Link className="aside-search" href="/archive"><BookOpenText size={16} /><span>아카이브 둘러보기</span><ArrowRight size={14} /></Link>
          <section><header><span>EXPLORE</span><h2>카테고리</h2></header>{categories.length ? <div className="aside-link-list">{categories.slice(0, 6).map(([category, count]) => <Link key={category} href={`/categories/${encodeURIComponent(category)}`}><span>{category}</span><b>{count}</b></Link>)}</div> : <p className="aside-empty">공개된 카테고리를 준비 중입니다.</p>}<Link className="aside-more" href="/categories">전체 카테고리 <ArrowRight size={13} /></Link></section>
          {tags.length > 0 && <section><header><span>DISCOVER</span><h2>인기 태그</h2></header><div className="modern-tag-cloud">{tags.slice(0, 10).map(([tag]) => <Link href={`/tags/${encodeURIComponent(tag)}`} key={tag}>#{tag}</Link>)}</div></section>}
          <section className="aside-subscribe"><Rss size={18} /><div><h2>새 글 구독</h2><p>RSS 리더에서 업데이트를 받아보세요.</p></div><Link href="/rss.xml" aria-label="RSS 구독"><ArrowRight size={16} /></Link></section>
        </aside>
      </div>
    </div>
  </div>;
}
