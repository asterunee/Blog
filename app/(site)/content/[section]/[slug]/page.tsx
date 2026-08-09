import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ArticleAuthor } from "@/components/article-author";
import { MdxContent } from "@/components/mdx-content";
import { TableOfContents } from "@/components/toc";
import { extractHeadings, getCustomPost, getCustomPosts } from "@/lib/content";
import { getCustomContentSection } from "@/lib/editor-settings";
import { getCategoryName } from "@/lib/taxonomy";

export function generateStaticParams() {
  return getCustomPosts(false).map((post) => ({ section: post.section, slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string; slug: string }> }): Promise<Metadata> {
  const { section, slug } = await params;
  const post = getCustomPost(section, slug);
  if (!post) return {};
  return { title: post.title, description: post.description, alternates: { canonical: `/content/${section}/${slug}` }, openGraph: { type: "article", title: post.title, description: post.description, publishedTime: post.date, modifiedTime: post.updated, tags: post.tags, images: post.coverImage ? [{ url: post.coverImage, alt: post.coverAlt || post.title }] : undefined } };
}

export default async function CustomContentPage({ params }: { params: Promise<{ section: string; slug: string }> }) {
  const { section, slug } = await params;
  const settings = getCustomContentSection(section);
  const post = getCustomPost(section, slug);
  if (!settings?.visible || !post) notFound();
  const all = getCustomPosts(undefined, section);
  const index = all.findIndex((entry) => entry.slug === slug);
  const prev = all[index + 1];
  const next = all[index - 1];
  const headings = extractHeadings(post.body);
  const categoryName = getCategoryName(post.category);

  return <div className="article-shell">
    <header className="article-header">
      <Link href={`/content/${section}`} className="back-link"><ArrowLeft size={15} /> 모든 {settings.label}</Link>
      <p><Link href={`/content/${section}`}>{settings.label}</Link> · <Link href={`/categories/${encodeURIComponent(post.category)}`}>{categoryName}</Link> · {post.date}</p>
      <h1>{post.title}</h1><p className="article-description">{post.description}</p>
      <div className="tag-row">{post.tags.map((tag) => <Link href={`/tags/${tag}`} key={tag}>{tag}</Link>)}</div>
      {post.algorithmTopics.length > 0 && <div className="tag-row algorithm-topic-row">{post.algorithmTopics.map((topic) => <Link href={`/algorithms/${topic}`} key={topic}>알고리즘 · {topic}</Link>)}</div>}
      <dl className="article-facts"><div><dt>작성일</dt><dd>{post.date}</dd></div><div><dt>수정일</dt><dd>{post.updated}</dd></div><div><dt>콘텐츠</dt><dd>{settings.label}</dd></div><div><dt>카테고리</dt><dd>{categoryName}</dd></div></dl>
      {post.coverImage && <div className="article-cover"><Image src={post.coverImage} alt={post.coverAlt || ""} fill priority sizes="(max-width: 900px) 100vw, 820px" /></div>}
    </header>
    <div className={`article-layout${post.showToc && headings.length ? "" : " without-toc"}`}>{post.showToc && headings.length > 0 && <TableOfContents headings={headings} />}<article className="prose"><MdxContent source={post.body} /></article></div>
    <ArticleAuthor name={post.author} />
    <nav className="post-nav">{prev ? <Link href={`/content/${section}/${prev.slug}`}><span>이전 글</span><b><ArrowLeft size={15} /> {prev.title}</b></Link> : <span />}{next ? <Link href={`/content/${section}/${next.slug}`}><span>다음 글</span><b>{next.title} <ArrowRight size={15} /></b></Link> : <span />}</nav>
  </div>;
}
