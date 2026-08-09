import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Folder, PencilLine, Radio, Search } from "lucide-react";
import { getLogs, getPosts, getSolutions } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { JudgeSignals } from "@/components/judge-signals";

export default function Home() {
  const posts = getPosts();
  const solutions = getSolutions();
  const logs = getLogs();
  const recent = [
    ...posts.map((post) => ({ ...post, href: `/posts/${post.slug}`, kind: post.category })),
    ...solutions.map((post) => ({ ...post, href: `/solutions/${post.slug}`, kind: "PS 풀이" })),
    ...logs.map((post) => ({ ...post, href: `/log/${post.slug}`, kind: post.type })),
  ].sort((a, b) => b.updated.localeCompare(a.updated));
  const tags = [...new Set(recent.flatMap((post) => post.tags))];
  const heroImage = siteConfig.backgroundImage || "/images/observatory-hero.webp";

  return <div className="blog-home">
    <div className="blog-main-column">
      <section className="blog-masthead">
        <Image src={heroImage} alt="블로그 배경 이미지" fill priority sizes="(max-width: 1050px) 100vw, 760px" style={{ objectPosition: siteConfig.backgroundPosition }} />
        <div className="blog-masthead-shade" />
        <div className="blog-masthead-copy"><span>PERSONAL LOGBOOK</span><h1>{siteConfig.koreanSubtitle}</h1><p>{siteConfig.intro}</p></div>
      </section>

      <header className="feed-header"><div><span className="section-index">RECENT POSTS</span><h2>최근 글</h2></div><Link href="/posts">모든 글 <ArrowRight size={15} /></Link></header>
      {posts.length ? <section className="blog-feed" aria-label="최근 글">{posts.map((post) => <article className="blog-post-card" key={post.slug} style={post.accentColor ? { borderColor: post.accentColor } : undefined}><Link href={`/posts/${post.slug}`}>{post.coverImage && <div className="post-card-cover"><Image src={post.coverImage} alt={post.coverAlt || ""} fill sizes="(max-width: 780px) 100vw, 720px" /></div>}<div className="post-card-top"><span>{post.category}</span><span>{post.pinned ? "PINNED · " : ""}{post.readingMinutes} min read</span></div><h2>{post.title}</h2><p>{post.description}</p><div className="post-card-meta"><span><CalendarDays size={14} />{post.date}</span><span><Folder size={14} />{post.series || post.category}</span></div><div className="tag-row">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></Link></article>)}</section> : <section className="content-empty"><PencilLine size={22} /><h2>첫 글을 기다리고 있습니다</h2><p>작성기에서 직접 쓴 글만 이곳에 표시됩니다.</p><Link href="/keystatic">새 글 작성하기 <ArrowRight size={14} /></Link></section>}

      {solutions.length > 0 && <><header className="feed-header notes-heading"><div><span className="section-index">PROBLEM SOLVING</span><h2>최근 풀이</h2></div><Link href="/solutions">모든 풀이 <ArrowRight size={15} /></Link></header><section className="compact-notes">{solutions.map((post) => <Link href={`/solutions/${post.slug}`} key={post.slug}><time>{post.date}</time><div><span>{post.judge} · {post.problemId}</span><h3>{post.title}</h3><p>{post.description}</p></div></Link>)}</section></>}

      {logs.length > 0 && <><header className="feed-header notes-heading"><div><span className="section-index">FIELD NOTES</span><h2>짧은 기록</h2></div><Link href="/log">전체 기록 <ArrowRight size={15} /></Link></header><section className="compact-notes">{logs.map((entry) => <Link href={`/log/${entry.slug}`} key={entry.slug}><time>{entry.date}</time><div><span>{entry.type}</span><h3>{entry.title}</h3><p>{entry.description}</p></div></Link>)}</section></>}
    </div>

    <aside className="blog-widgets">
      <Link className="widget-search" href="/posts"><Search size={15} /> 글 둘러보기</Link>
      <section className="blog-widget"><h2>Recently updated</h2>{recent.length ? recent.slice(0, 6).map((post) => <Link key={post.href} href={post.href}><span>{post.title}</span><time>{post.updated} · {post.kind}</time></Link>) : <p className="widget-empty">아직 공개된 글이 없습니다.</p>}</section>
      {tags.length > 0 && <section className="blog-widget"><h2>Trending tags</h2><div className="widget-tags">{tags.map((tag) => <Link key={tag} href={`/tags/${tag}`}>#{tag}</Link>)}</div></section>}
      {siteConfig.nowTitle && <section className="blog-widget study-widget"><span><Radio size={13} /> NOW</span><h3>{siteConfig.nowTitle}</h3><p>{siteConfig.nowDescription}</p><Link href="/archive">아카이브 보기 →</Link></section>}
      {siteConfig.showJudgeSignals && <section className="blog-widget signal-widget"><h2>PS signals</h2><JudgeSignals /></section>}
    </aside>
  </div>;
}
