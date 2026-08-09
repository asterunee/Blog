import Link from "next/link";
import { Orbit } from "lucide-react";
import { getSolutions } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { InteractiveShell } from "./interactive-shell";

export function Header() {
  const items = getSolutions().map((post) => ({ title: post.title, href: `/solutions/${post.slug}`, description: post.description, tags: post.tags }));
  return <header className="site-header">
    <div className="header-inner">
      <Link className="wordmark" href="/"><Orbit size={19} aria-hidden /><span>asterunee</span></Link>
      <div className="sidebar-intro"><p>별과 달 사이의<br />알고리즘 기록</p><span>관찰에서 증명과 구현까지,<br />PS의 사고 과정을 기록합니다.</span></div>
      <nav className="desktop-nav" aria-label="주요 탐색">{siteConfig.navigation.map((item) => <Link key={item.href} href={item.href}><span className="ko">{item.ko}</span><span className="en">{item.en}</span></Link>)}</nav>
      <InteractiveShell items={items} />
    </div>
  </header>;
}
