import type { Metadata } from "next";
import Link from "next/link";
import { Orbit } from "lucide-react";
import { getSolutions } from "@/lib/content";
import { algorithms } from "@/lib/site";

export const metadata: Metadata = {
  title: "알고리즘 별자리",
  description: "asterunee가 관측하고 분류한 알고리즘 분야",
  alternates: { canonical: "/algorithms" },
};

export default function AlgorithmsPage() {
  const solutions = getSolutions();

  return (
    <div className="page-shell">
      <header className="page-title">
        <span className="section-index">CONSTELLATION INDEX</span>
        <h1>알고리즘 별자리</h1>
        <p>구조와 아이디어의 가까움을 기준으로 PS 주제를 잇습니다.</p>
      </header>
      <section className="constellation" aria-label="알고리즘 분야 목록">
        <div className="orbit-rings" aria-hidden><i /><i /><i /><Orbit /></div>
        {algorithms.map(([name, slug], index) => {
          const count = solutions.filter((post) => post.tags.includes(slug)).length;
          const content = <><span>{String(index + 1).padStart(2, "0")}</span><h2>{name}</h2><p>{count ? `${count}개의 풀이` : "기록 준비 중"}</p></>;
          return count ? <Link href={`/tags/${slug}`} key={slug} style={{ "--i": index } as React.CSSProperties}>{content}</Link> : <div key={slug} style={{ "--i": index } as React.CSSProperties}>{content}</div>;
        })}
      </section>
      <p className="microcopy centered">풀이를 공개하면 해당 주제의 실제 기록 수가 자동으로 반영됩니다.</p>
    </div>
  );
}
