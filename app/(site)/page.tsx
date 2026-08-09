import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenText, Rss, Search } from "lucide-react";
import { getCustomPosts, getLogs, getPosts, getSolutions } from "@/lib/content";
import { getAllContentEntries } from "@/lib/content-index";
import { customContentSections } from "@/lib/editor-settings";
import { siteConfig } from "@/lib/site";
import { JudgeSignals } from "@/components/judge-signals";
import { PostCard } from "@/components/post-card";

export default function Home() {
  const posts = getPosts();
  const solutions = getSolutions();
  const logs = getLogs();
  const customPosts = getCustomPosts();
  const recent = getAllContentEntries().sort((a, b) => b.updated.localeCompare(a.updated));
  const tags = [...new Set(recent.flatMap((post) => post.tags))];
  const heroImage = siteConfig.backgroundImage || "/images/observatory-hero.webp";

  return <div className="blog-home">
    <div className="blog-main-column">
      <section className="blog-masthead">
        <Image src={heroImage} alt="블로그 배경 이미지" fill priority sizes="(max-width: 1050px) 100vw, 760px" style={{ objectPosition: siteConfig.backgroundPosition }} />
        <div className="blog-masthead-shade" />
        <div className="blog-masthead-copy"><h1>{siteConfig.koreanSubtitle}</h1><p>{siteConfig.intro}</p></div>
      </section>

      <header className="feed-header"><div><h2>최근 글</h2></div><Link href="/posts">모든 글 <ArrowRight size={15} /></Link></header>
      {posts.length ? <section className="blog-feed" aria-label="최근 글">{posts.map((post) => <PostCard key={post.slug} post={post} />)}</section> : <section className="content-empty"><BookOpenText size={22} /><h2>첫 이야기를 준비하고 있습니다</h2><p>개발, 알고리즘과 일상에서 발견한 생각을 곧 전해 드릴게요.</p><Link href="/rss.xml">새 글 RSS로 받아보기 <Rss size={14} /></Link></section>}

      {solutions.length > 0 && <><header className="feed-header notes-heading"><div><h2>최근 풀이</h2></div><Link href="/solutions">모든 풀이 <ArrowRight size={15} /></Link></header><section className="compact-notes">{solutions.map((post) => <Link href={`/solutions/${post.slug}`} key={post.slug}><time>{post.date}</time><div><span>{post.judge} · {post.problemId}</span><h3>{post.title}</h3><p>{post.description}</p></div></Link>)}</section></>}

      {logs.length > 0 && <><header className="feed-header notes-heading"><div><h2>짧은 기록</h2></div><Link href="/log">전체 기록 <ArrowRight size={15} /></Link></header><section className="compact-notes">{logs.map((entry) => <Link href={`/log/${entry.slug}`} key={entry.slug}><time>{entry.date}</time><div><span>{entry.type}</span><h3>{entry.title}</h3><p>{entry.description}</p></div></Link>)}</section></>}

      {customContentSections.filter((section) => section.visible && section.showOnHome).map((section) => { const entries = customPosts.filter((entry) => entry.section === section.key); return entries.length > 0 && <div key={section.key}><header className="feed-header notes-heading"><div><h2>{section.label}</h2></div><Link href={`/content/${section.key}`}>전체 보기 <ArrowRight size={15} /></Link></header><section className="compact-notes">{entries.map((entry) => <Link href={`/content/${section.key}/${entry.slug}`} key={entry.slug}><time>{entry.date}</time><div><span>{section.label}</span><h3>{entry.title}</h3><p>{entry.description}</p></div></Link>)}</section></div>; })}
    </div>

    <aside className="blog-widgets">
      <Link className="widget-search" href="/posts"><Search size={15} /> 글 둘러보기</Link>
      <section className="blog-widget"><h2>최근 업데이트</h2>{recent.length ? recent.slice(0, 6).map((post) => <Link key={post.href} href={post.href}><span>{post.title}</span><time>{post.updated} · {post.kind}</time></Link>) : <p className="widget-empty">아직 공개된 글이 없습니다.</p>}</section>
      {tags.length > 0 && <section className="blog-widget"><h2>태그</h2><div className="widget-tags">{tags.map((tag) => <Link key={tag} href={`/tags/${tag}`}>#{tag}</Link>)}</div></section>}
      <section className="blog-widget subscribe-widget"><h3><Rss size={13} /> 새 글 구독</h3><p>RSS 리더에서 새 글과 풀이를 받아볼 수 있습니다.</p><Link href="/rss.xml">RSS 피드 구독하기 →</Link></section>
      {siteConfig.nowTitle && <section className="blog-widget study-widget"><h3>{siteConfig.nowTitle}</h3><p>{siteConfig.nowDescription}</p><Link href="/archive">아카이브 보기 →</Link></section>}
      {siteConfig.showJudgeSignals && <section className="blog-widget signal-widget"><h2>PS 활동</h2><JudgeSignals /></section>}
    </aside>
  </div>;
}
