import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { getPosts } from "@/lib/content";
import { getContentTypeName, getManagedContentTypes } from "@/lib/taxonomy";

export function generateStaticParams() {
  return [...new Set([...getPosts(false).map((post) => post.contentType), ...getManagedContentTypes().map((type) => type.slug)])].map((type) => ({ type }));
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  const name = getContentTypeName(type);
  return { title: `${name} 글`, description: `${name} 형식으로 작성한 asterunee의 글`, alternates: { canonical: `/types/${encodeURIComponent(type)}` } };
}

export default async function ContentTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const posts = getPosts().filter((post) => post.contentType === type);
  const managedType = getManagedContentTypes().find((entry) => entry.slug === type);
  if (!posts.length && !managedType) notFound();
  const name = managedType?.name || getContentTypeName(type);
  return <div className="page-shell archive-page">
    <header className="page-title"><Link className="back-link category-back" href="/categories"><ArrowLeft size={14} /> 모든 분류</Link><h1>{name}</h1><p>{managedType?.description || `${name} 형식으로 작성한 글을 모았습니다.`}</p></header>
    {posts.length ? <section className="blog-feed standalone-feed editorial-post-feed">{posts.map((post) => <PostCard key={post.slug} post={post} />)}</section> : <section className="editorial-empty"><h2>아직 공개된 글이 없습니다</h2><p>이 형식의 글이 공개되면 자동으로 표시됩니다.</p></section>}
  </div>;
}
