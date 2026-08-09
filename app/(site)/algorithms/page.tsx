import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSolutions } from "@/lib/content";
import { algorithms } from "@/lib/site";

export const metadata: Metadata = {
  title: "알고리즘",
  description: "문제 풀이에서 다룬 알고리즘과 자료구조를 주제별로 정리합니다.",
  alternates: { canonical: "/algorithms" },
};

export default function AlgorithmsPage() {
  const solutions = getSolutions();
  return <div className="page-shell archive-page">
    <header className="page-title"><h1>알고리즘</h1><p>문제 풀이에서 다룬 알고리즘과 자료구조를 주제별로 살펴봅니다.</p></header>
    <section className="algorithm-index" aria-label="알고리즘 분야 목록">{algorithms.map(([name, slug]) => {
      const count = solutions.filter((post) => post.tags.includes(slug)).length;
      return count ? <Link href={`/tags/${slug}`} key={slug}><div><h2>{name}</h2><p>{count}개의 풀이</p></div><ArrowRight size={15} /></Link> : <div key={slug}><div><h2>{name}</h2><p>풀이 준비 중</p></div><span>0</span></div>;
    })}</section>
  </div>;
}
