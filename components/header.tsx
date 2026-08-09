import Link from "next/link";
import { Orbit } from "lucide-react";
import { getLogs, getPosts, getSolutions } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { InteractiveShell } from "./interactive-shell";

export function Header() {
  const items = [...getPosts().map((post) => ({ title: post.title, href: `/posts/${post.slug}`, description: post.description, tags: post.tags })), ...getSolutions().map((post) => ({ title: post.title, href: `/solutions/${post.slug}`, description: post.description, tags: post.tags })), ...getLogs().map((post) => ({ title: post.title, href: `/log/${post.slug}`, description: post.description, tags: post.tags }))];
  return <header className="site-header">
    <div className="header-inner">
      <Link className="wordmark" href="/"><Orbit size={19} aria-hidden /><span>{siteConfig.name}</span></Link>
      <div className="sidebar-intro"><p>{siteConfig.koreanSubtitle}</p><span>{siteConfig.sidebarIntro}</span></div>
      <nav className="desktop-nav" aria-label="주요 탐색">{siteConfig.navigation.map((item) => <Link key={item.href} href={item.href}><span className="ko">{item.ko}</span><span className="en">{item.en}</span></Link>)}</nav>
      <InteractiveShell items={items} />
    </div>
  </header>;
}
