import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Braces, Code2, Compass, Orbit, Rss, Sparkles } from "lucide-react";
import { profiles, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "asterunee 소개",
  description: "개발과 알고리즘, 배움과 일상의 이야기를 나누는 asterunee 소개",
  alternates: { canonical: "/about" },
};

const principles = [
  ["01", "과정을 함께 씁니다", "결론만 남기지 않고, 질문이 생긴 지점과 답에 도착한 흐름을 기록합니다."],
  ["02", "사실과 생각을 구분합니다", "직접 확인한 내용과 개인적인 해석이 독자에게 선명하게 보이도록 씁니다."],
  ["03", "실패를 숨기지 않습니다", "틀린 접근과 바뀐 생각도 다음 사람에게 도움이 되는 정보로 남깁니다."],
  ["04", "다시 읽을 문장으로 씁니다", "시간이 지나도 맥락을 복원할 수 있도록 정확하고 차분하게 설명합니다."],
] as const;

export default function AboutPage() {
  const publicProfiles = profiles.filter((profile) => profile.url);
  return <div className="modern-about-page">
    <section className="modern-about-hero">
      <div className="page-shell modern-about-hero-grid">
        <div className="modern-about-copy">
          <nav className="page-breadcrumb" aria-label="현재 위치"><Link href="/">asterunee</Link><span>/</span><span>소개</span></nav>
          <span className="section-index"><Sparkles size={13} /> ABOUT ASTERUNEE</span>
          <h1>관찰하고,<br /><em>이해하고,</em><br />나눕니다.</h1>
          <p>안녕하세요, asterunee입니다. 개발과 알고리즘을 공부하며 발견한 것, 오래 붙잡은 생각과 일상의 장면을 읽기 좋은 이야기로 전합니다.</p>
          <div className="modern-about-actions"><Link href="/posts">글 읽으러 가기 <ArrowRight size={15} /></Link><Link href="/solutions">PS 풀이 보기 <Code2 size={15} /></Link></div>
        </div>
        <figure className="modern-about-portrait">
          <div className="portrait-orbit" aria-hidden><i /><i /><Orbit /></div>
          <Image src="/images/earth-orbit.webp" fill priority sizes="(max-width: 900px) 100vw, 560px" alt="깊은 우주에서 바라본 푸른 지구와 보랏빛 항성" />
          <figcaption><span><i /> AVAILABLE FOR NEW IDEAS</span><div><b>asterunee</b><small>{siteConfig.role}</small></div></figcaption>
        </figure>
      </div>
    </section>

    <div className="page-shell modern-about-body">
      <section className="about-story-grid" aria-labelledby="about-story-title">
        <article className="about-story-card">
          <span className="section-index">THE STORY BEHIND THE NAME</span>
          <h2 id="about-story-title">별과 달 사이에서<br />생각을 문장으로 옮깁니다.</h2>
          <div><p><strong>aster</strong>의 별과 <strong>lune</strong>의 달 사이. asterunee는 개발하며 배운 것과 오래 붙잡은 생각을 한곳에서 나누기 위한 이름입니다.</p><p>정답을 빠르게 요약하기보다 왜 그런 질문이 생겼는지, 어떤 접근을 거쳐 이해하게 되었는지까지 설명합니다. 독자가 다음 생각으로 자연스럽게 이어갈 수 있는 글을 지향합니다.</p></div>
        </article>
        <aside className="about-quote-card"><Orbit size={24} /><blockquote>“{siteConfig.motto}”</blockquote><p>{siteConfig.supportingLine}</p></aside>
      </section>

      <section className="about-bento" aria-label="관심 분야와 작업 환경">
        <article className="about-bento-intro"><span><Compass size={15} /> WHAT I EXPLORE</span><h2>코드 너머의 맥락까지</h2><p>소프트웨어 개발과 경쟁 프로그래밍을 중심으로, 공부 과정과 도구, 읽고 본 것과 일상까지 폭넓게 다룹니다.</p></article>
        <article className="about-topic-card"><Braces size={21} /><span>CODE</span><h3>Web Development</h3><p>TypeScript · Next.js · Tools</p></article>
        <article className="about-topic-card"><Code2 size={21} /><span>PROBLEM SOLVING</span><h3>Algorithms</h3><p>C++17 · Codeforces · AtCoder</p></article>
        <article className="about-topic-card"><BookOpen size={21} /><span>NOTES</span><h3>Learning & Life</h3><p>Books · Ideas · Everyday moments</p></article>
      </section>

      <section className="modern-principles">
        <header className="modern-about-section-heading"><div><span className="section-index">WRITING PRINCIPLES</span><h2>이 블로그가 글을 쓰는 방식</h2></div><p>읽는 사람의 시간을 존중하면서도 중요한 맥락은 생략하지 않습니다.</p></header>
        <div>{principles.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
      </section>

      <section className="modern-profiles">
        <header className="modern-about-section-heading"><div><span className="section-index">ELSEWHERE</span><h2>다른 곳에서도 만나요</h2></div><p>문제 풀이 활동과 코드, 온라인에서의 기록을 확인할 수 있습니다.</p></header>
        <div>{publicProfiles.map((profile) => <a key={profile.name} href={profile.url} target="_blank" rel="noreferrer"><div><span>{profile.name.slice(0, 2).toUpperCase()}</span><p><b>{profile.name}</b><small>@{profile.handle}</small></p></div><ArrowUpRight size={17} /></a>)}</div>
      </section>

      <section className="modern-about-cta"><div><span><Rss size={14} /> KEEP IN TOUCH</span><h2>다음 이야기에서<br />다시 만나요.</h2></div><p>개발과 알고리즘, 배움에 관한 새로운 글을 천천히 이어갑니다.</p><div><Link href="/posts">전체 글 보기 <ArrowRight size={15} /></Link><Link href="/rss.xml">RSS 구독 <Rss size={15} /></Link></div></section>
    </div>
  </div>;
}
