import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MdxContent } from "@/components/mdx-content";
import { TableOfContents } from "@/components/toc";
import { extractHeadings, getLog, getLogs } from "@/lib/content";

export function generateStaticParams() { return getLogs(false).map((post) => ({ slug: post.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const post = getLog(slug); return post ? { title: post.title, description: post.description, alternates: { canonical: `/log/${slug}` }, openGraph: { type: "article", title: post.title, description: post.description, publishedTime: post.date, modifiedTime: post.updated, tags: post.tags } } : {}; }

export default async function LogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const post = getLog(slug); if (!post) notFound();
  return <div className="article-shell"><header className="article-header"><Link href="/log" className="back-link"><ArrowLeft size={15} /> 관측 일지</Link><p>{post.type} · {post.date}</p><h1>{post.title}</h1><p className="article-description">{post.description}</p><div className="tag-row">{post.tags.map((tag) => <Link href={`/tags/${tag}`} key={tag}>{tag}</Link>)}</div><dl className="article-facts"><div><dt>Published</dt><dd>{post.date}</dd></div><div><dt>Updated</dt><dd>{post.updated}</dd></div><div><dt>Reading time</dt><dd>{post.readingMinutes} min</dd></div><div><dt>Author</dt><dd>asterunee</dd></div></dl></header><div className="article-layout"><TableOfContents headings={extractHeadings(post.body)} /><article className="prose"><MdxContent source={post.body} /></article></div></div>;
}
