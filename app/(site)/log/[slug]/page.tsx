import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MdxContent } from "@/components/mdx-content";
import { ArticleAuthor } from "@/components/article-author";
import { TableOfContents } from "@/components/toc";
import { extractHeadings, getLog, getLogs } from "@/lib/content";
import { getCategoryName } from "@/lib/taxonomy";

export function generateStaticParams() { return getLogs(false).map((post) => ({ slug: post.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const post = getLog(slug); return post ? { title: post.title, description: post.description, alternates: { canonical: `/log/${slug}` }, openGraph: { type: "article", title: post.title, description: post.description, publishedTime: post.date, modifiedTime: post.updated, tags: post.tags, images: post.coverImage ? [{ url: post.coverImage, alt: post.coverAlt || post.title }] : undefined } } : {}; }

export default async function LogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getLog(slug);
  if (!post) notFound();
  const headings = extractHeadings(post.body);
  const categoryName = getCategoryName(post.category);
  return <div className="article-shell"><header className="article-header"><Link href="/log" className="back-link"><ArrowLeft size={15} /> 짧은 기록</Link><p>{post.type} · <Link href={`/categories/${encodeURIComponent(post.category)}`}>{categoryName}</Link> · {post.date}</p><h1>{post.title}</h1><p className="article-description">{post.description}</p><div className="tag-row">{post.tags.map((tag) => <Link href={`/tags/${tag}`} key={tag}>{tag}</Link>)}</div>{post.algorithmTopics.length > 0 && <div className="tag-row algorithm-topic-row">{post.algorithmTopics.map((topic) => <Link href={`/algorithms/${topic}`} key={topic}>알고리즘 · {topic}</Link>)}</div>}<dl className="article-facts"><div><dt>작성일</dt><dd>{post.date}</dd></div><div><dt>수정일</dt><dd>{post.updated}</dd></div><div><dt>카테고리</dt><dd>{categoryName}</dd></div><div><dt>장소</dt><dd>{post.location || "—"}</dd></div></dl>{post.coverImage && <div className="article-cover"><Image src={post.coverImage} alt={post.coverAlt || ""} fill priority sizes="(max-width: 900px) 100vw, 820px" /></div>}</header><div className={`article-layout${headings.length ? "" : " without-toc"}`}>{headings.length > 0 && <TableOfContents headings={headings} />}<article className="prose"><MdxContent source={post.body} /></article></div><ArticleAuthor name={post.author} /></div>;
}
