import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { entryMatchesAlgorithm, getAllContentEntries } from "@/lib/content-index";
import { getManagedAlgorithms } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: "알고리즘",
  description: "문제 풀이에서 다룬 알고리즘과 자료구조를 주제별로 정리합니다.",
  alternates: { canonical: "/algorithms" },
};

export default function AlgorithmsPage() {
  const entries = getAllContentEntries();
  const algorithms = getManagedAlgorithms().filter((algorithm) => algorithm.visible);
  return <div className="page-shell archive-page">
    <header className="page-title"><h1>알고리즘</h1><p>글과 문제 풀이에서 다룬 알고리즘과 자료구조를 주제별로 살펴봅니다.</p></header>
    {algorithms.length ? <section className="algorithm-index" aria-label="알고리즘 분야 목록">{algorithms.map((algorithm) => {
      const count = entries.filter((entry) => entryMatchesAlgorithm(entry, algorithm.slug)).length;
      return <Link href={`/algorithms/${algorithm.slug}`} key={algorithm.slug}><div><h2>{algorithm.name}</h2><p>{count ? `${count}개의 콘텐츠` : algorithm.description || "콘텐츠 준비 중"}</p></div>{count ? <ArrowRight size={15} /> : <span>0</span>}</Link>;
    })}</section> : <section className="editorial-empty"><h2>알고리즘 주제를 준비 중입니다</h2><p>관리자 화면에서 원하는 주제를 추가하면 이곳에 표시됩니다.</p></section>}
  </div>;
}
