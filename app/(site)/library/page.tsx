import type { Metadata } from "next";
import Link from "next/link";
import { Code2, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { libraryItems } from "@/lib/site";

export const metadata: Metadata = { title: "C++17 라이브러리", description: "suisen-cp/cp-library-cpp 기반 경쟁 프로그래밍 라이브러리 정리", alternates: { canonical: "/library" } };
const usage = `#include "library/template.hpp"\n\nusing namespace std;\nusing namespace suisen;`;

export default function LibraryPage() {
  return <div className="page-shell"><header className="page-title"><h1>라이브러리</h1><p><a href="https://github.com/suisen-cp/cp-library-cpp" target="_blank" rel="noreferrer">suisen-cp/cp-library-cpp <ExternalLink size={13} /></a>를 기본으로, 대회 중 다시 찾기 위한 조건과 사용법을 정리합니다.</p></header><div className="library-intro"><Code2 /><div><h2>기본 템플릿</h2><p>모든 예제는 다음 namespace와 템플릿을 기준으로 합니다.</p></div></div><CodeBlock filename="snippet.cpp" code={usage} /><section className="library-list">{libraryItems.map((item,i) => {
    const snippet = `#include "library/template.hpp"\n#include "${item.include}"\n\nusing namespace std;\nusing namespace suisen;\n\nint main() {\n    // ${item.name} usage\n    return 0;\n}`;
    return <article key={item.name}><span className="large-index">{String(i+1).padStart(2,"0")}</span><div className="library-copy"><p>{item.category}</p><h2>{item.name}</h2><code>{item.include}</code><p>{item.description}</p><details className="library-code"><summary>짧은 사용 코드</summary><CodeBlock filename={`${item.name.toLowerCase().replaceAll(" ", "-")}.cpp`} code={snippet} /></details></div><dl><div><dt>사용 조건</dt><dd>{item.condition}</dd></div><div><dt>복잡도</dt><dd>{item.complexity}</dd></div><div><dt>전체 코드</dt><dd><a href={`https://github.com/suisen-cp/cp-library-cpp/blob/main/${item.include}`} target="_blank" rel="noreferrer">원본 소스 보기 ↗</a></dd></div><div><dt>관련 풀이</dt><dd>{item.related ? <Link href={`/solutions/${item.related}`}>풀이 보기 →</Link> : "준비 중"}</dd></div></dl></article>;
  })}</section></div>;
}
