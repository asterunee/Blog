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
      <nav className="desktop-nav" aria-label="주요 탐색">{siteConfig.navigation.map((item) => <Link key={item.href} href={item.href}><span className="ko">{item.ko}</span><span className="en">{item.en}</span></Link>)}</nav>
      <InteractiveShell items={items} />
    </div>
  </header>;
}
