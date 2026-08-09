import type { Metadata } from "next";
import Link from "next/link";
import { Orbit } from "lucide-react";
import { algorithms } from "@/lib/site";

export const metadata: Metadata = { title: "알고리즘 별자리", description: "asterunee가 관측하고 분류한 알고리즘 분야", alternates: { canonical: "/algorithms" } };
export default function AlgorithmsPage() { return <div className="page-shell"><header className="page-title"><span className="section-index">CONSTELLATION INDEX</span><h1>알고리즘 별자리</h1><p>구조와 아이디어의 가까움을 기준으로 관측 분야를 잇습니다.</p></header><section className="constellation" aria-label="알고리즘 분야 목록"><div className="orbit-rings" aria-hidden><i /><i /><i /><Orbit /></div>{algorithms.map(([name,slug,count],i) => <Link href={`/tags/${slug}`} key={slug} style={{ "--i": i } as React.CSSProperties}><span>{String(i+1).padStart(2,"0")}</span><h2>{name}</h2><p>{count} observations</p></Link>)}</section><p className="microcopy centered">시각적 궤도와 무관하게 모든 항목은 키보드와 목록 순서로 탐색할 수 있습니다.</p></div>; }
