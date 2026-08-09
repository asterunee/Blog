import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Folder, Radio, Search } from "lucide-react";
import { getLogs, getPosts, getSolutions } from "@/lib/content";
import { JudgeSignals } from "@/components/judge-signals";

export default function Home() {
  const posts = getPosts(); const solutions = getSolutions(); const logs = getLogs();
  const recent = [...posts.map((post) => ({ ...post, href: `/posts/${post.slug}`, kind: post.category })), ...solutions.map((post) => ({ ...post, href: `/solutions/${post.slug}`, kind: "PS 풀이" })), ...logs.map((post) => ({ ...post, href: `/log/${post.slug}`, kind: post.type }))].sort((a,b) => b.updated.localeCompare(a.updated));
  const tags = [...new Set(recent.flatMap((post) => post.tags))];
  return <div className="blog-home"><div className="blog-main-column">
    <section className="blog-masthead"><Image src="/images/observatory-hero.webp" alt="청록빛 은하수를 바라보며 여러 생각을 기록하는 관측자" fill priority sizes="(max-width: 1050px) 100vw, 760px" /><div className="blog-masthead-shade" /><div className="blog-masthead-copy"><span>PERSONAL LOGBOOK</span><h1>별과 달 사이의<br />기록</h1><p>코드와 배움, 생각과 일상에서 발견한 것들.</p></div></section>

    <header className="feed-header"><div><span className="section-index">RECENT POSTS</span><h2>최근 글</h2></div><Link href="/posts">모든 글 <ArrowRight size={15} /></Link></header>
    <section className="blog-feed" aria-label="최근 글">{posts.map((post) => <article className="blog-post-card" key={post.slug}><Link href={`/posts/${post.slug}`}><div className="post-card-top"><span>{post.category}</span><span>{post.readingMinutes} min read</span></div><h2>{post.title}</h2><p>{post.description}</p><div className="post-card-meta"><span><CalendarDays size={14} />{post.date}</span><span><Folder size={14} />{post.category}</span></div><div className="tag-row">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></Link></article>)}</section>

    {solutions.length > 0 && <><header className="feed-header notes-heading"><div><span className="section-index">PROBLEM SOLVING</span><h2>최근 풀이</h2></div><Link href="/solutions">모든 풀이 <ArrowRight size={15} /></Link></header><section className="compact-notes">{solutions.map((post) => <Link href={`/solutions/${post.slug}`} key={post.slug}><time>{post.date}</time><div><span>{post.judge} · {post.problemId}</span><h3>{post.title}</h3><p>{post.description}</p></div></Link>)}</section></>}

    <header className="feed-header notes-heading"><div><span className="section-index">FIELD NOTES</span><h2>짧은 기록</h2></div><Link href="/log">전체 기록 <ArrowRight size={15} /></Link></header>
    <section className="compact-notes">{logs.map((entry) => <Link href={`/log/${entry.slug}`} key={entry.slug}><time>{entry.date}</time><div><span>{entry.type}</span><h3>{entry.title}</h3><p>{entry.description}</p></div></Link>)}</section>
  </div><aside className="blog-widgets">
    <Link className="widget-search" href="/posts"><Search size={15} /> 글 둘러보기</Link>
    <section className="blog-widget"><h2>Recently updated</h2>{recent.slice(0,6).map((post) => <Link key={post.href} href={post.href}><span>{post.title}</span><time>{post.updated} · {post.kind}</time></Link>)}</section>
    <section className="blog-widget"><h2>Trending tags</h2><div className="widget-tags">{tags.map((tag) => <Link key={tag} href={`/tags/${tag}`}>#{tag}</Link>)}</div></section>
    <section className="blog-widget study-widget"><span><Radio size={13} /> NOW EXPLORING</span><h3>기록과 자동화</h3><p>글을 파일로 보존하면서 작성과 배포의 마찰을 줄이는 방법을 살펴보고 있습니다.</p><Link href="/archive">아카이브 보기 →</Link></section>
    <section className="blog-widget signal-widget"><h2>PS signals</h2><JudgeSignals /></section>
  </aside></div>;
}
