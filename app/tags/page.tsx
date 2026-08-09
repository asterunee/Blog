import type { Metadata } from "next";
import Link from "next/link";
import { getLogs, getSolutions } from "@/lib/content";

export const metadata: Metadata = { title: "태그", description: "알고리즘과 대회 기록을 연결하는 전체 태그 목록", alternates: { canonical: "/tags" } };
export default function TagsPage() { const tags = [...getSolutions().flatMap((p) => p.tags), ...getLogs().flatMap((p) => p.tags)].reduce((map,tag) => map.set(tag,(map.get(tag)||0)+1), new Map<string,number>()); return <div className="page-shell"><header className="page-title"><span className="section-index">TAG INDEX</span><h1>태그</h1><p>같은 아이디어와 대회에 속한 글을 연결합니다.</p></header><div className="tag-index">{[...tags].sort((a,b) => b[1]-a[1]).map(([tag,count]) => <Link href={`/tags/${tag}`} key={tag}><span>#{tag}</span><b>{count}</b></Link>)}</div></div>; }
