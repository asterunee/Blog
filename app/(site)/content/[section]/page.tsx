import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getCustomPosts } from "@/lib/content";
import { customContentSections, getCustomContentSection } from "@/lib/editor-settings";

export function generateStaticParams() {
  return customContentSections.filter((section) => section.visible).map((section) => ({ section: section.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  const settings = getCustomContentSection(section);
  if (!settings) return {};
  return { title: settings.label, description: settings.description, alternates: { canonical: `/content/${section}` } };
}

export default async function CustomContentIndexPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const settings = getCustomContentSection(section);
  if (!settings?.visible) notFound();
  const entries = getCustomPosts(undefined, section);

  return <div className="page-shell archive-page">
    <header className="page-title"><h1>{settings.label}</h1><p>{settings.description}</p></header>
    {entries.length ? <section className="category-entry-feed">{entries.map((entry) => <Link href={`/content/${section}/${entry.slug}`} key={entry.slug}><div><span>{settings.label}</span><time>{entry.date}</time></div><h2>{entry.title}</h2><p>{entry.description}</p><footer><div>{entry.tags.slice(0, 5).map((tag) => <span key={tag}>#{tag}</span>)}</div><ArrowRight size={15} /></footer></Link>)}</section> : <section className="editorial-empty"><h2>아직 공개된 콘텐츠가 없습니다</h2><p>관리자 작성기에서 첫 콘텐츠를 공개하면 이곳에 표시됩니다.</p></section>}
  </div>;
}
