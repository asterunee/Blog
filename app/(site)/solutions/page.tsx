import type { Metadata } from "next";
import { Suspense } from "react";
import { SolutionExplorer } from "@/components/solution-explorer";
import { getSolutions } from "@/lib/content";

export const metadata: Metadata = { title: "PS 풀이", description: "Codeforces, AtCoder, LeetCode 등 문제의 접근, 증명과 구현을 함께 설명하는 알고리즘 풀이", alternates: { canonical: "/solutions" } };
export default function SolutionsPage() {
  const posts = getSolutions();
  return <div className="page-shell archive-page"><header className="page-title"><h1>PS 풀이</h1><p>문제의 핵심 아이디어부터 증명, 복잡도와 구현까지 이해하기 쉽게 정리합니다.</p></header><Suspense fallback={<p>풀이 목록을 불러오는 중…</p>}><SolutionExplorer posts={posts} /></Suspense></div>;
}
