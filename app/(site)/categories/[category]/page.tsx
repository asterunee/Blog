import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAllContentEntries } from "@/lib/content-index";
import { getManagedCategories, getCategoryName } from "@/lib/taxonomy";

export function generateStaticParams() {
  return [...new Set([
    ...getAllContentEntries(false).map((post) => post.category),
    ...getManagedCategories().map((category) => category.slug),
  ])].map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const name = getCategoryName(category);
  return { title: `${name} 카테고리`, description: `${name} 주제로 분류된 asterunee의 글과 기록`, alternates: { canonical: `/categories/${encodeURIComponent(category)}` } };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const entries = getAllContentEntries().filter((post) => post.category === category);
  const managedCategory = getManagedCategories().find((entry) => entry.slug === category);
  if (!entries.length && !managedCategory) notFound();
  const name = managedCategory?.name || category;
  return <div className="page-shell archive-page">
    <header className="page-title"><Link className="back-link category-back" href="/categories"><ArrowLeft size={14} /> 모든 카테고리</Link><h1>{name}</h1><p>{managedCategory?.description || `${name}에 관한 글과 기록을 모았습니다.`}</p></header>
    {entries.length ? <section className="category-entry-feed">{entries.map((entry) => <Link href={entry.href} key={entry.href} prefetch={false}><div><span>{entry.kind}</span><time>{entry.date}</time></div><h2>{entry.title}</h2><p>{entry.description}</p><footer><div>{entry.tags.slice(0, 5).map((tag) => <span key={tag}>#{tag}</span>)}</div><ArrowRight size={15} /></footer></Link>)}</section> : <section className="editorial-empty"><h2>아직 공개된 글이 없습니다</h2><p>이 카테고리에 새 콘텐츠가 공개되면 자동으로 표시됩니다.</p></section>}
  </div>;
}
