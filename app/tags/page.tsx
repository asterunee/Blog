import type { Metadata } from "next";
import Link from "next/link";
import { getLogs, getPosts, getSolutions } from "@/lib/content";

export const metadata: Metadata = { title: "태그", description: "개발, 공부, 생각과 알고리즘 기록을 연결하는 전체 태그 목록", alternates: { canonical: "/tags" } };
export default function TagsPage() { const tags = [...getPosts().flatMap((p) => p.tags), ...getSolutions().flatMap((p) => p.tags), ...getLogs().flatMap((p) => p.tags)].reduce((map,tag) => map.set(tag,(map.get(tag)||0)+1), new Map<string,number>()); return <div className="page-shell"><header className="page-title"><span className="section-index">TAG INDEX</span><h1>태그</h1><p>서로 다른 주제의 글을 공통된 관심사로 연결합니다.</p></header>{tags.size ? <div className="tag-index">{[...tags].sort((a,b) => b[1]-a[1]).map(([tag,count]) => <Link href={`/tags/${tag}`} key={tag}><span>#{tag}</span><b>{count}</b></Link>)}</div> : <div className="content-empty content-empty-page"><h2>아직 태그가 없습니다</h2><p>글에 자유롭게 태그를 추가하면 이곳에 자동으로 모입니다.</p><Link href="/keystatic">작성기 열기 →</Link></div>}</div>; }
