import Link from "next/link";
import { profiles, siteConfig } from "@/lib/site";
import { getLogs, getPosts, getSolutions } from "@/lib/content";

export function Footer() {
  const latest = [...getPosts(), ...getSolutions(), ...getLogs()].sort((a, b) => b.updated.localeCompare(a.updated))[0]?.updated;
  return <footer className="site-footer"><div className="footer-main">
    <div><Link href="/" className="footer-brand">{siteConfig.name}</Link><p>{siteConfig.motto}</p></div>
    <div className="footer-links">
      {profiles.map((profile) => profile.url ? <a key={profile.name} href={profile.url} target="_blank" rel="noreferrer">{profile.name}</a> : <span key={profile.name} title="URL을 설정해 주세요">{profile.name}</span>)}
      <Link href="/rss.xml">RSS</Link><Link href="/sitemap.xml">Sitemap</Link>
    </div>
  </div><div className="footer-meta"><span>© 2026 {siteConfig.name}</span><span>Last updated · {latest || "새 기록을 기다리는 중"}</span></div></footer>;
}
