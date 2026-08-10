import Link from "next/link";
import { notFound } from "next/navigation";
import { getSolutions } from "@/lib/content";

export function generateStaticParams() { return [...new Set(getSolutions(false).map((p) => p.judge))].map((judge) => ({ judge })); }
export default async function JudgePage({ params }: { params: Promise<{ judge: string }> }) { const { judge } = await params; const decoded = decodeURIComponent(judge); const posts = getSolutions().filter((p) => p.judge === decoded); if (!posts.length) notFound(); return <div className="page-shell archive-page"><header className="page-title"><h1>{decoded}</h1><p>이 온라인 저지에서 작성한 {posts.length}개의 풀이입니다.</p></header><div className="simple-post-list">{posts.map((p) => <Link href={`/solutions/${p.slug}`} key={p.slug} prefetch={false}><span>{p.problemId} · {p.difficulty}</span><h2>{p.title}</h2><p>{p.description}</p></Link>)}</div></div>; }
