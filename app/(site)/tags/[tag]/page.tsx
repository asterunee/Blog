import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllContentEntries } from "@/lib/content-index";

export function generateStaticParams() { return [...new Set(getAllContentEntries(false).flatMap((p) => p.tags))].map((tag) => ({ tag })); }
export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) { const { tag } = await params; const posts = getAllContentEntries().filter((p) => p.tags.includes(tag)); if (!posts.length) notFound(); return <div className="page-shell archive-page"><header className="page-title"><h1>#{tag}</h1><p>{posts.length}개의 콘텐츠가 이 태그에 연결되어 있습니다.</p></header><div className="simple-post-list">{posts.map((p) => <Link href={p.href} key={p.href} prefetch={false}><span>{p.date} · {p.kind}</span><h2>{p.title}</h2><p>{p.description}</p></Link>)}</div></div>; }
