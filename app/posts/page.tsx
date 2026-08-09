import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Folder } from "lucide-react";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = { title: "글", description: "개발, 공부, 생각과 일상을 기록한 asterunee의 글 목록", alternates: { canonical: "/posts" } };
export default function PostsPage() { return <div className="page-shell archive-page"><header className="page-title"><span className="section-index">ALL POSTS</span><h1>글</h1><p>개발과 알고리즘부터 공부, 생각과 일상의 조각까지 기록합니다.</p></header><section className="blog-feed standalone-feed">{getPosts().map((post) => <article className="blog-post-card" key={post.slug}><Link href={`/posts/${post.slug}`}><div className="post-card-top"><span>{post.category}</span><span>{post.readingMinutes} min read</span></div><h2>{post.title}</h2><p>{post.description}</p><div className="post-card-meta"><span><CalendarDays size={14} />{post.date}</span><span><Folder size={14} />{post.category}</span></div><div className="tag-row">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></Link></article>)}</section></div>; }
