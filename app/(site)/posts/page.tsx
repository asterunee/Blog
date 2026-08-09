import type { Metadata } from "next";
import Link from "next/link";
import { AllPostsExplorer } from "@/components/all-posts-explorer";
import { getAllContentEntries } from "@/lib/content-index";
import { getCategoryName } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: "전체 글",
  description: "개발, 알고리즘, 기술과 일상에 관한 asterunee의 모든 글",
  alternates: { canonical: "/posts" },
};

export default function PostsPage() {
  const entries = getAllContentEntries().map((entry) => ({ ...entry, categoryName: getCategoryName(entry.category) }));

  return <div className="editorial-page">
    <header className="page-shell editorial-page-header">
      <nav className="page-breadcrumb" aria-label="현재 위치"><Link href="/">홈</Link><span>/</span><span>전체 글</span></nav>
      <div className="editorial-title-row">
        <div><h1>전체 글</h1></div>
        <p>작성 형식과 관계없이 공개한 모든 글을 한곳에서 검색하고 읽을 수 있습니다.</p>
      </div>
    </header>
    <main className="page-shell editorial-index-body unified-posts-page"><AllPostsExplorer entries={entries} /></main>
  </div>;
}
