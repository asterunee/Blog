import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Folder } from "lucide-react";
import type { BlogPost } from "@/lib/content";

export function PostCard({ post }: { post: BlogPost }) {
  return <article className="blog-post-card" style={post.accentColor ? { borderColor: post.accentColor } : undefined}>
    <Link href={`/posts/${post.slug}`}>
      {post.coverImage && <div className="post-card-cover"><Image src={post.coverImage} alt={post.coverAlt || ""} fill sizes="(max-width: 780px) 100vw, 760px" /></div>}
      <div className="post-card-top"><span>{post.category}</span><span>{post.pinned ? "PINNED · " : ""}{post.readingMinutes} min read</span></div>
      <h2>{post.title}</h2>
      <p>{post.description}</p>
      <div className="post-card-meta"><span><CalendarDays size={14} />{post.date}</span><span><Folder size={14} />{post.series || post.category}</span></div>
      <div className="tag-row">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
    </Link>
  </article>;
}
