import Link from "next/link";
import { notFound } from "next/navigation";
import { getSolutions } from "@/lib/content";

export function generateStaticParams() { return [...new Set(getSolutions(false).flatMap((p) => p.tags))].map((tag) => ({ tag })); }
export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) { const { tag } = await params; const posts = getSolutions().filter((p) => p.tags.includes(tag)); if (!posts.length) notFound(); return <div className="page-shell archive-page"><header className="page-title"><span className="section-index">CONSTELLATION / TAG</span><h1>#{tag}</h1><p>{posts.length}개의 관측 기록이 이 별자리에 연결되어 있습니다.</p></header><div className="simple-post-list">{posts.map((p) => <Link href={`/solutions/${p.slug}`} key={p.slug}><span>{p.date}</span><h2>{p.title}</h2><p>{p.description}</p></Link>)}</div></div>; }
