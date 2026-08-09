import type { Metadata } from "next";
import Link from "next/link";
import { getAllContentEntries } from "@/lib/content-index";

export const metadata: Metadata = { title: "태그", description: "개발, 공부, 생각과 알고리즘 기록을 연결하는 전체 태그 목록", alternates: { canonical: "/tags" } };
export default function TagsPage() { const tags = getAllContentEntries().flatMap((p) => p.tags).reduce((map,tag) => map.set(tag,(map.get(tag)||0)+1), new Map<string,number>()); return <div className="page-shell"><header className="page-title"><h1>태그</h1><p>관심 있는 키워드로 서로 다른 주제의 콘텐츠를 이어서 읽어보세요.</p></header>{tags.size ? <div className="tag-index">{[...tags].sort((a,b) => b[1]-a[1]).map(([tag,count]) => <Link href={`/tags/${tag}`} key={tag}><span>#{tag}</span><b>{count}</b></Link>)}</div> : <div className="content-empty content-empty-page"><h2>태그별 이야기를 준비 중입니다</h2><p>글이 공개되면 주제별 태그가 이곳에 자동으로 모입니다.</p><Link href="/posts">전체 글 둘러보기 →</Link></div>}</div>; }
