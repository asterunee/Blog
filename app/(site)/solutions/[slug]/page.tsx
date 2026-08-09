import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { MdxContent } from "@/components/mdx-content";
import { ArticleAuthor } from "@/components/article-author";
import { TableOfContents } from "@/components/toc";
import { extractHeadings, getSolution, getSolutions } from "@/lib/content";
import { getCategoryName } from "@/lib/taxonomy";

export function generateStaticParams() { return getSolutions(false).map((post) => ({ slug: post.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const post = getSolution(slug); return post ? { title: post.title, description: post.description, alternates: { canonical: `/solutions/${slug}` }, openGraph: { type: "article", title: post.title, description: post.description, publishedTime: post.date, modifiedTime: post.updated, tags: post.tags, images: post.coverImage ? [{ url: post.coverImage, alt: post.coverAlt || post.title }] : undefined } } : {}; }

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getSolution(slug);
  if (!post) notFound();
  const all = getSolutions();
  const index = all.findIndex((entry) => entry.slug === slug);
  const prev = all[index + 1];
  const next = all[index - 1];
  const headings = extractHeadings(post.body);
  const categoryName = getCategoryName(post.category);

  return <div className="article-shell"><header className="article-header"><Link href="/solutions" className="back-link"><ArrowLeft size={15} /> 풀이 목록</Link><p>{post.judge} · {post.problemId} · <Link href={`/categories/${encodeURIComponent(post.category)}`}>{categoryName}</Link> · {post.status}{post.contest ? ` · ${post.contest}` : ""}</p><h1>{post.title}</h1><p className="article-description">{post.description}</p><div className="tag-row">{post.tags.map((tag) => <Link key={tag} href={`/tags/${tag}`}>{tag}</Link>)}</div><dl className="article-facts"><div><dt>난이도</dt><dd>{post.difficulty} · {post.tier}</dd></div><div><dt>개발 환경</dt><dd>{post.language}{post.solutionType ? ` · ${post.solutionType}` : ""}</dd></div><div><dt>제한</dt><dd>{post.timeLimit} · {post.memoryLimit}</dd></div><div><dt>카테고리</dt><dd>{categoryName}</dd></div></dl><a className="original-link" href={post.problemUrl} target="_blank" rel="noreferrer">문제 원문 <ExternalLink size={14} /></a>{post.coverImage && <div className="article-cover"><Image src={post.coverImage} alt={post.coverAlt || ""} fill priority sizes="(max-width: 900px) 100vw, 820px" /></div>}</header><div className={`article-layout${headings.length ? "" : " without-toc"}`}>{headings.length > 0 && <TableOfContents headings={headings} />}<article className="prose"><MdxContent source={post.body} /></article></div><ArticleAuthor name={post.author} /><nav className="post-nav">{prev ? <Link href={`/solutions/${prev.slug}`}><span>이전 풀이</span><b><ArrowLeft size={15} /> {prev.title}</b></Link> : <span />}{next ? <Link href={`/solutions/${next.slug}`}><span>다음 풀이</span><b>{next.title} <ArrowRight size={15} /></b></Link> : <span />}</nav></div>;
}
