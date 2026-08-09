import Image from "next/image";
import Link from "next/link";
import { getAllContentEntries } from "@/lib/content-index";
import { siteConfig } from "@/lib/site";
import { InteractiveShell } from "./interactive-shell";

export function Header() {
  const items = getAllContentEntries().map(({ title, href, description, tags, algorithmTopics }) => ({ title, href, description, tags: [...new Set([...tags, ...algorithmTopics])] }));
  return <header className="site-header">
    <div className="header-inner">
      <Link className="wordmark" href="/"><span className="wordmark-avatar">{siteConfig.profileImage ? <Image src={siteConfig.profileImage} alt="" fill sizes="30px" priority /> : siteConfig.name.slice(0, 1).toUpperCase()}</span><span>{siteConfig.name}</span></Link>
      <div className="sidebar-intro"><p>{siteConfig.koreanSubtitle}</p><span>{siteConfig.sidebarIntro}</span></div>
      <nav className="desktop-nav" aria-label="주요 탐색">{siteConfig.navigation.map((item) => <Link key={item.href} href={item.href}><span className="ko">{item.ko}</span><span className="en">{item.en}</span></Link>)}</nav>
      <InteractiveShell items={items} />
    </div>
  </header>;
}
