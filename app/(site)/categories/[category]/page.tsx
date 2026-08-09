import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { getPosts } from "@/lib/content";
import { getManagedCategories, getCategoryName } from "@/lib/taxonomy";

export function generateStaticParams() {
  return [...new Set([...getPosts(false).map((post) => post.category), ...getManagedCategories().map((category) => category.slug)])].map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const name = getCategoryName(category);
  return { title: `${name} 카테고리`, description: `${name} 주제로 분류된 asterunee의 글`, alternates: { canonical: `/categories/${encodeURIComponent(category)}` } };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const posts = getPosts().filter((post) => post.category === category);
  const managedCategory = getManagedCategories().find((entry) => entry.slug === category);
  if (!posts.length && !managedCategory) notFound();
  const name = managedCategory?.name || category;
  return <div className="page-shell archive-page">
    <header className="page-title"><Link className="back-link category-back" href="/categories"><ArrowLeft size={14} /> 모든 카테고리</Link><h1>{name}</h1><p>{managedCategory?.description || `${name}에 관한 글을 모았습니다.`}</p></header>
    {posts.length ? <section className="blog-feed standalone-feed editorial-post-feed">{posts.map((post) => <PostCard key={post.slug} post={post} />)}</section> : <section className="editorial-empty"><h2>아직 공개된 글이 없습니다</h2><p>이 카테고리에 새 글을 작성하면 자동으로 표시됩니다.</p></section>}
  </div>;
}
