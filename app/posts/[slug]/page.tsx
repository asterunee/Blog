import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MdxContent } from "@/components/mdx-content";
import { TableOfContents } from "@/components/toc";
import { extractHeadings, getPost, getPosts } from "@/lib/content";

export function generateStaticParams() { return getPosts(false).map((post) => ({ slug: post.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const post = getPost(slug); return post ? { title: post.title, description: post.description, alternates: { canonical: `/posts/${slug}` }, openGraph: { type: "article", title: post.title, description: post.description, publishedTime: post.date, modifiedTime: post.updated, tags: post.tags } } : {}; }
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const post = getPost(slug); if (!post) notFound(); return <div className="article-shell"><header className="article-header"><Link href="/posts" className="back-link"><ArrowLeft size={15} /> 모든 글</Link><p>{post.category} · {post.date}</p><h1>{post.title}</h1><p className="article-description">{post.description}</p><div className="tag-row">{post.tags.map((tag) => <Link href={`/tags/${tag}`} key={tag}>{tag}</Link>)}</div><dl className="article-facts"><div><dt>Published</dt><dd>{post.date}</dd></div><div><dt>Updated</dt><dd>{post.updated}</dd></div><div><dt>Reading time</dt><dd>{post.readingMinutes} min</dd></div><div><dt>Category</dt><dd>{post.category}</dd></div></dl></header><div className="article-layout"><TableOfContents headings={extractHeadings(post.body)} /><article className="prose"><MdxContent source={post.body} /></article></div></div>; }
