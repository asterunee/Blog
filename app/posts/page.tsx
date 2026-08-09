import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Folder, PencilLine } from "lucide-react";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = { title: "글", description: "asterunee가 직접 작성한 글 목록", alternates: { canonical: "/posts" } };

export default function PostsPage() {
  const posts = getPosts();
  return <div className="page-shell archive-page">
    <header className="page-title"><span className="section-index">ALL POSTS</span><h1>글</h1><p>주제와 형식에 제한을 두지 않고 직접 쓴 기록을 모읍니다.</p></header>
    {posts.length ? <section className="blog-feed standalone-feed">{posts.map((post) => <article className="blog-post-card" key={post.slug} style={post.accentColor ? { borderColor: post.accentColor } : undefined}><Link href={`/posts/${post.slug}`}>{post.coverImage && <div className="post-card-cover"><Image src={post.coverImage} alt={post.coverAlt || ""} fill sizes="(max-width: 780px) 100vw, 760px" /></div>}<div className="post-card-top"><span>{post.category}</span><span>{post.pinned ? "PINNED · " : ""}{post.readingMinutes} min read</span></div><h2>{post.title}</h2><p>{post.description}</p><div className="post-card-meta"><span><CalendarDays size={14} />{post.date}</span><span><Folder size={14} />{post.series || post.category}</span></div><div className="tag-row">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></Link></article>)}</section> : <section className="content-empty content-empty-page"><PencilLine size={24} /><h2>아직 공개된 글이 없습니다</h2><p>작성기에서 첫 글을 만들고 초안을 해제하면 이곳에 표시됩니다.</p><Link href="/keystatic">작성기 열기 <ArrowRight size={14} /></Link></section>}
  </div>;
}
