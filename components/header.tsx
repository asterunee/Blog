import Link from "next/link";
import { Orbit, PencilLine } from "lucide-react";
import { getLogs, getPosts, getSolutions } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { InteractiveShell } from "./interactive-shell";

export function Header() {
  const items = [...getPosts().map((post) => ({ title: post.title, href: `/posts/${post.slug}`, description: post.description, tags: post.tags })), ...getSolutions().map((post) => ({ title: post.title, href: `/solutions/${post.slug}`, description: post.description, tags: post.tags })), ...getLogs().map((post) => ({ title: post.title, href: `/log/${post.slug}`, description: post.description, tags: post.tags }))];
  return <header className="site-header">
    <div className="header-inner">
      <Link className="wordmark" href="/"><Orbit size={19} aria-hidden /><span>asterunee</span></Link>
      <div className="sidebar-intro"><p>별과 달 사이의<br />기록</p><span>코드와 배움, 생각과 일상의<br />조각을 차분히 남깁니다.</span></div>
      <nav className="desktop-nav" aria-label="주요 탐색">{siteConfig.navigation.map((item) => <Link key={item.href} href={item.href}><span className="ko">{item.ko}</span><span className="en">{item.en}</span></Link>)}</nav>
      <Link className="write-link" href="/keystatic" title="Git 기반 글 편집기"><PencilLine size={14} /><span>기록하기</span></Link>
      <InteractiveShell items={items} />
    </div>
  </header>;
}
