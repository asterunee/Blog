import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Asterisk, Radio } from "lucide-react";
import { algorithms, profiles, siteConfig } from "@/lib/site";
import { getSolutions } from "@/lib/content";
import { logEntries } from "@/lib/logs";
import { StreakMap } from "@/components/streak-map";
import { JudgeSignals } from "@/components/judge-signals";

export default function Home() {
  const posts = getSolutions();
  return <>
    <section className="hero"><Image src="/images/observatory-hero.webp" alt="청록빛 은하수를 올려다보는 한 관측자의 실루엣" fill priority sizes="100vw" /><div className="hero-overlay" /><div className="hero-copy"><div className="eyebrow"><span /> personal algorithm observatory · 37.5665° N</div><h1>asterunee</h1><p className="hero-subtitle"><span className="ko">{siteConfig.koreanSubtitle}</span><span className="en">{siteConfig.englishSubtitle}</span></p><p className="hero-intro"><span className="ko">별과 달 사이, 알고리즘의 구조를 오래 바라보고<br />정확한 증명과 구현의 궤적을 남깁니다.</span><span className="en">Observing structures, preserving the orbit<br />from intuition to proof and implementation.</span></p><div className="hero-links"><Link href="/solutions">풀이 탐색 <ArrowRight size={16} /></Link><Link href="/about">소개</Link></div></div><div className="hero-coordinate"><span>ASTER-OBS / 026</span><span>CYG · LYRA · LUNE</span></div><div className="scroll-mark">SCROLL TO OBSERVE <i /></div></section>
    <div className="page-shell home-shell">
      <section className="opening-note"><span className="section-index">01 — LOGBOOK</span><div><p className="display-quote">“문제를 푼다는 것은,<br />흩어진 별 사이에 <em>선을 긋는 일.</em>”</p><p>직관이 증명이 되고, 증명이 코드가 되기까지의 실제 사고 과정을 기록합니다. 답보다 오래 남는 관찰을 위해.</p></div></section>
      <section className="section-block"><header className="section-heading"><div><span className="section-index">02 — RECENT OBSERVATIONS</span><h2>최근 풀이</h2></div><Link href="/solutions">모든 관측 보기 <ArrowRight size={15} /></Link></header><div className="featured-solutions">{posts.slice(0,2).map((post, i) => <Link href={`/solutions/${post.slug}`} key={post.slug} className="featured-row"><span className="large-index">0{i+1}</span><div><p>{post.judge} · {post.problemId}</p><h3>{post.title}</h3><div className="tag-row">{post.tags.map((t) => <span key={t}>{t}</span>)}</div></div><dl><dt>MAGNITUDE</dt><dd>{post.difficulty}</dd><dt>OBSERVED</dt><dd>{post.date}</dd></dl><ArrowRight className="row-arrow" /></Link>)}</div></section>
      <section className="two-column-section"><div><span className="section-index">03 — CONSTELLATIONS</span><h2>알고리즘 지도</h2><p>자주 관측하는 분야를 별자리처럼 이어 둡니다.</p><div className="algorithm-links">{algorithms.slice(0,8).map(([name,slug,count]) => <Link href={`/tags/${slug}`} key={slug}><Asterisk size={12} />{name}<span>{count}</span></Link>)}</div></div><aside className="study-panel"><Radio size={18} /><span>NOW OBSERVING</span><h3>Formal Power Series</h3><p>exp, log, compositional inverse 사이의 관계와 구현의 경계 조건을 정리하고 있습니다.</p><div className="orbit-progress"><i /><span>63%</span></div></aside></section>
      <section className="section-block"><header className="section-heading"><div><span className="section-index">04 — ACTIVITY SIGNAL</span><h2>Codeforces 별빛 기록</h2></div><span className="live-label"><i /> cached signal</span></header><StreakMap /></section>
      <section className="profile-earth"><div><span className="section-index">05 — OPERATOR</span><h2>관측자, asterunee</h2><p>{siteConfig.role}</p><p>복잡한 구조를 단순한 불변식으로 번역하고, 그 과정을 다시 읽을 수 있는 기록으로 남깁니다.</p><JudgeSignals /><div className="profile-list">{profiles.slice(0,4).map((p) => p.url ? <a key={p.name} href={p.url}>{p.name}<span>@asterunee ↗</span></a> : <div key={p.name}>{p.name}<span>@asterunee · URL pending</span></div>)}</div><Link className="text-link" href="/about">관측자 기록 읽기 <ArrowRight size={15} /></Link></div><div className="earth-thumb"><Image src="/images/earth-orbit.webp" fill sizes="(max-width: 768px) 100vw, 50vw" alt="푸른 대기광을 두른 지구의 곡선과 보랏빛 별" /></div></section>
      <section className="timeline-section"><header className="section-heading"><div><span className="section-index">06 — FIELD NOTES</span><h2>최근 활동 궤적</h2></div><Link href="/log">기록 전체 <ArrowRight size={15} /></Link></header><div className="timeline">{logEntries.map((entry) => <article key={entry.slug}><time>{entry.date}</time><i /><div><span>{entry.type}</span><h3>{entry.title}</h3><p>{entry.description}</p></div></article>)}</div></section>
    </div>
  </>;
}
