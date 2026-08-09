import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { MdxContent } from "@/components/mdx-content";
import { TableOfContents } from "@/components/toc";
import { extractHeadings, getSolution, getSolutions } from "@/lib/content";

export function generateStaticParams() { return getSolutions(false).map((post) => ({ slug: post.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const post = getSolution(slug); return post ? { title: post.title, description: post.description, alternates: { canonical: `/solutions/${slug}` }, openGraph: { type: "article", title: post.title, description: post.description, publishedTime: post.date, modifiedTime: post.updated, tags: post.tags } } : {}; }

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const post = getSolution(slug); if (!post) notFound(); const all = getSolutions(); const index = all.findIndex((p) => p.slug === slug); const prev = all[index + 1]; const next = all[index - 1];
  return <div className="article-shell"><header className="article-header"><Link href="/solutions" className="back-link"><ArrowLeft size={15} /> 관측 목록</Link><p>{post.judge} · {post.problemId} · {post.status}</p><h1>{post.title}</h1><p className="article-description">{post.description}</p><div className="tag-row">{post.tags.map((tag) => <Link key={tag} href={`/tags/${tag}`}>{tag}</Link>)}</div><dl className="article-facts"><div><dt>Difficulty</dt><dd>{post.difficulty} · {post.tier}</dd></div><div><dt>Limits</dt><dd>{post.timeLimit} · {post.memoryLimit}</dd></div><div><dt>Observed</dt><dd>{post.date} / updated {post.updated}</dd></div><div><dt>Elapsed</dt><dd>{post.solveTime} min · {post.readingMinutes} min read</dd></div></dl><a className="original-link" href={post.problemUrl} target="_blank" rel="noreferrer">문제 원문 <ExternalLink size={14} /></a></header><div className="article-layout"><TableOfContents headings={extractHeadings(post.body)} /><article className="prose"><MdxContent source={post.body} /></article></div><nav className="post-nav">{prev ? <Link href={`/solutions/${prev.slug}`}><span>이전 관측</span><b><ArrowLeft size={15} /> {prev.title}</b></Link> : <span />}{next ? <Link href={`/solutions/${next.slug}`}><span>다음 관측</span><b>{next.title} <ArrowRight size={15} /></b></Link> : <span />}</nav></div>;
}
