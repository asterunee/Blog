import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, UserRound } from "lucide-react";
import { MdxContent } from "@/components/mdx-content";
import { TableOfContents } from "@/components/toc";
import { extractHeadings, getPost, getPosts } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { getCategoryName } from "@/lib/taxonomy";

export function generateStaticParams() { return getPosts(false).map((post) => ({ slug: post.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.description;
  return {
    title,
    description,
    alternates: { canonical: post.canonicalUrl || `/posts/${slug}` },
    openGraph: { type: "article", title, description, publishedTime: post.date, modifiedTime: post.updated, tags: post.tags, images: post.coverImage ? [{ url: post.coverImage, alt: post.coverAlt || post.title }] : undefined },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const all = getPosts();
  const index = all.findIndex((entry) => entry.slug === slug);
  const prev = all[index + 1];
  const next = all[index - 1];
  const related = all.filter((entry) => entry.slug !== slug && entry.category === post.category).slice(0, 3);
  const headings = extractHeadings(post.body);
  const showToc = post.showToc && headings.length > 0;
  const articleStyle = post.accentColor ? { "--cyan": post.accentColor } as CSSProperties : undefined;
  const categoryName = getCategoryName(post.category);

  return <div className="article-shell" style={articleStyle}>
    <header className="article-header">
      <Link href="/posts" className="back-link"><ArrowLeft size={15} /> 모든 글</Link>
      <p><Link href={`/categories/${encodeURIComponent(post.category)}`}>{categoryName}</Link> · {post.date}{post.series ? ` · ${post.series}` : ""}</p>
      <h1>{post.title}</h1>
      <p className="article-description">{post.description}</p>
      <div className="tag-row">{post.tags.map((tag) => <Link href={`/tags/${tag}`} key={tag}>{tag}</Link>)}</div>
      <dl className="article-facts"><div><dt>작성일</dt><dd>{post.date}</dd></div><div><dt>수정일</dt><dd>{post.updated}</dd></div><div><dt>읽는 시간</dt><dd>{post.readingMinutes}분</dd></div><div><dt>카테고리</dt><dd>{categoryName}</dd></div></dl>
      {post.coverImage && <div className="article-cover"><Image src={post.coverImage} alt={post.coverAlt || ""} fill priority sizes="(max-width: 900px) 100vw, 820px" /></div>}
    </header>
    <div className={`article-layout${showToc ? "" : " without-toc"}`}>{showToc && <TableOfContents headings={headings} />}<article className="prose"><MdxContent source={post.body} /></article></div>
    <aside className="article-author"><UserRound size={26} aria-hidden /><div><span>작성자</span><h2>{post.author}</h2><p>{siteConfig.sidebarIntro}</p></div><Link href="/about">작성자 소개 <ArrowRight size={14} /></Link></aside>
    {related.length > 0 && <section className="related-posts"><header><h2>같은 카테고리의 글</h2></header><div>{related.map((entry) => <Link href={`/posts/${entry.slug}`} key={entry.slug}><span>{entry.date} · {entry.readingMinutes}분</span><h3>{entry.title}</h3><p>{entry.description}</p></Link>)}</div></section>}
    <nav className="post-nav">{prev ? <Link href={`/posts/${prev.slug}`}><span>이전 글</span><b><ArrowLeft size={15} /> {prev.title}</b></Link> : <span />}{next ? <Link href={`/posts/${next.slug}`}><span>다음 글</span><b>{next.title} <ArrowRight size={15} /></b></Link> : <span />}</nav>
  </div>;
}
