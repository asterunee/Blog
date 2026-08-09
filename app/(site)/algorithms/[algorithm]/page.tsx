import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { entryMatchesAlgorithm, getAllContentEntries } from "@/lib/content-index";
import { getManagedAlgorithms } from "@/lib/taxonomy";

export function generateStaticParams() {
  return getManagedAlgorithms().map((algorithm) => ({ algorithm: algorithm.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ algorithm: string }> }): Promise<Metadata> {
  const { algorithm } = await params;
  const item = getManagedAlgorithms().find((entry) => entry.slug === algorithm);
  if (!item) return {};
  return { title: item.name, description: item.description || `${item.name} 관련 글과 문제 풀이`, alternates: { canonical: `/algorithms/${algorithm}` } };
}

export default async function AlgorithmPage({ params }: { params: Promise<{ algorithm: string }> }) {
  const { algorithm } = await params;
  const item = getManagedAlgorithms().find((entry) => entry.slug === algorithm && entry.visible);
  if (!item) notFound();
  const entries = getAllContentEntries().filter((entry) => entryMatchesAlgorithm(entry, algorithm));

  return <div className="page-shell archive-page">
    <header className="page-title"><Link className="back-link category-back" href="/algorithms"><ArrowLeft size={14} /> 모든 알고리즘</Link><h1>{item.name}</h1><p>{item.description || `${item.name}을 사용한 글과 문제 풀이를 모았습니다.`}</p></header>
    {entries.length ? <section className="category-entry-feed">{entries.map((entry) => <Link href={entry.href} key={entry.href}><div><span>{entry.kind}</span><time>{entry.date}</time></div><h2>{entry.title}</h2><p>{entry.description}</p><footer><div>{entry.tags.slice(0, 5).map((tag) => <span key={tag}>#{tag}</span>)}</div><ArrowRight size={15} /></footer></Link>)}</section> : <section className="editorial-empty"><h2>아직 공개된 콘텐츠가 없습니다</h2><p>작성기에서 이 알고리즘 주제를 연결한 콘텐츠가 공개되면 자동으로 표시됩니다.</p></section>}
  </div>;
}
