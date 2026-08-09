import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { getPosts } from "@/lib/content";

export function generateStaticParams() {
  return [...new Set(getPosts(false).map((post) => post.category))].map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  return { title: `${category} 카테고리`, description: `${category} 주제로 분류된 asterunee의 글`, alternates: { canonical: `/categories/${encodeURIComponent(category)}` } };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const posts = getPosts().filter((post) => post.category === category);
  if (!posts.length) notFound();
  return <div className="page-shell archive-page">
    <header className="page-title"><Link className="back-link category-back" href="/categories"><ArrowLeft size={14} /> 모든 카테고리</Link><span className="section-index">CATEGORY</span><h1>{category}</h1><p>{category}에 관한 {posts.length}개의 글을 모았습니다.</p></header>
    <section className="blog-feed standalone-feed">{posts.map((post) => <PostCard key={post.slug} post={post} />)}</section>
  </div>;
}
