import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Folder } from "lucide-react";
import type { BlogPost } from "@/lib/content";
import { getCategoryName } from "@/lib/taxonomy";

export function PostCard({ post }: { post: BlogPost }) {
  const categoryName = getCategoryName(post.category);
  return <article className="blog-post-card" style={post.accentColor ? { borderColor: post.accentColor } : undefined}>
    <Link href={`/posts/${post.slug}`}>
      {post.coverImage && <div className="post-card-cover"><Image src={post.coverImage} alt={post.coverAlt || ""} fill sizes="(max-width: 780px) 100vw, 760px" /></div>}
      <div className="post-card-top"><span>{categoryName}</span><span>{post.pinned ? "고정 · " : ""}{post.readingMinutes}분</span></div>
      <h2>{post.title}</h2>
      <p>{post.description}</p>
      <div className="post-card-meta"><span><CalendarDays size={14} />{post.date}</span><span><Folder size={14} />{post.series || categoryName}</span></div>
      <div className="tag-row">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
    </Link>
  </article>;
}
