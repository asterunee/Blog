import type { Metadata } from "next";
import { Suspense } from "react";
import { SolutionExplorer } from "@/components/solution-explorer";
import { getSolutions } from "@/lib/content";

export const metadata: Metadata = { title: "풀이 관측 목록", description: "문제, 난이도, 태그와 사고 과정으로 탐색하는 asterunee의 알고리즘 풀이", alternates: { canonical: "/solutions" } };
export default function SolutionsPage() {
  const posts = getSolutions();
  return <div className="page-shell archive-page"><header className="page-title"><span className="section-index">OBSERVATION CATALOG / {String(posts.length).padStart(3, "0")}</span><h1>풀이 관측 목록</h1><p>문제의 답보다, 답에 도달한 궤적을 보존합니다.</p></header><Suspense fallback={<p>관측 목록을 정렬하는 중…</p>}><SolutionExplorer posts={posts} /></Suspense></div>;
}
