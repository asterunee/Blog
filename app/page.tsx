import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Folder, Radio, Search } from "lucide-react";
import { getSolutions } from "@/lib/content";
import { logEntries } from "@/lib/logs";
import { JudgeSignals } from "@/components/judge-signals";

export default function Home() {
  const posts = getSolutions();
  const tags = [...new Set(posts.flatMap((post) => post.tags))];
  return <div className="blog-home">
    <div className="blog-main-column">
      <section className="blog-masthead">
        <Image src="/images/observatory-hero.webp" alt="청록빛 은하수를 바라보며 알고리즘을 기록하는 관측자" fill priority sizes="(max-width: 1050px) 100vw, 760px" />
        <div className="blog-masthead-shade" />
        <div className="blog-masthead-copy"><span>ALGORITHMIC LOGBOOK</span><h1>별과 달 사이의<br />알고리즘 기록</h1><p>문제를 읽은 첫 관찰부터 증명, 구현과 디버깅까지.</p></div>
      </section>

      <header className="feed-header"><div><span className="section-index">RECENT POSTS</span><h2>최근 기록</h2></div><Link href="/solutions">모든 풀이 <ArrowRight size={15} /></Link></header>
      <section className="blog-feed" aria-label="최근 풀이 글">
        {posts.map((post) => <article className="blog-post-card" key={post.slug}>
          <Link href={`/solutions/${post.slug}`}><div className="post-card-top"><span>{post.status === "Example" ? "예시 풀이" : "문제 풀이"}</span><span>{post.readingMinutes} min read</span></div><h2>{post.title}</h2><p>{post.description}</p><div className="post-card-meta"><span><CalendarDays size={14} />{post.date}</span><span><Folder size={14} />{post.judge} · {post.problemId}</span></div><div className="tag-row">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></Link>
        </article>)}
      </section>

      <header className="feed-header notes-heading"><div><span className="section-index">FIELD NOTES</span><h2>관측 일지</h2></div><Link href="/log">전체 기록 <ArrowRight size={15} /></Link></header>
      <section className="compact-notes">{logEntries.map((entry) => <Link href="/log" key={entry.slug}><time>{entry.date}</time><div><span>{entry.type}</span><h3>{entry.title}</h3><p>{entry.description}</p></div></Link>)}</section>
    </div>

    <aside className="blog-widgets">
      <Link className="widget-search" href="/solutions"><Search size={15} /> 풀이 검색</Link>
      <section className="blog-widget"><h2>Recently updated</h2>{posts.map((post) => <Link key={post.slug} href={`/solutions/${post.slug}`}><span>{post.title}</span><time>{post.updated}</time></Link>)}</section>
      <section className="blog-widget"><h2>Trending tags</h2><div className="widget-tags">{tags.map((tag) => <Link key={tag} href={`/tags/${tag}`}>#{tag}</Link>)}</div></section>
      <section className="blog-widget study-widget"><span><Radio size={13} /> NOW STUDYING</span><h3>Formal Power Series</h3><p>exp, log와 compositional inverse의 구현 경계를 정리하는 중입니다.</p><Link href="/algorithms">알고리즘 목록 →</Link></section>
      <section className="blog-widget signal-widget"><h2>Judge signals</h2><JudgeSignals /></section>
    </aside>
  </div>;
}
