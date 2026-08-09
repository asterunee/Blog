import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { profiles, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "asterunee 소개",
  description: "개발과 알고리즘, 배움과 일상의 이야기를 나누는 asterunee 소개",
  alternates: { canonical: "/about" },
};

const topics = [
  ["개발", "TypeScript와 Next.js를 중심으로 직접 만들며 배운 내용을 정리합니다."],
  ["알고리즘", "문제의 답뿐 아니라 접근을 떠올리고 다듬는 과정을 함께 설명합니다."],
  ["배움과 일상", "도구, 책, 생각과 오래 기억하고 싶은 일상의 장면을 기록합니다."],
] as const;

const principles = [
  ["과정을 함께 씁니다", "결론만 남기지 않고 질문이 생긴 지점과 답에 도착한 흐름을 기록합니다."],
  ["사실과 생각을 구분합니다", "직접 확인한 내용과 개인적인 해석이 선명하게 보이도록 씁니다."],
  ["실패를 숨기지 않습니다", "틀린 접근과 바뀐 생각도 다음 사람에게 도움이 되는 정보로 남깁니다."],
  ["다시 읽을 수 있게 씁니다", "시간이 지나도 맥락을 복원할 수 있도록 정확하고 차분하게 설명합니다."],
] as const;

export default function AboutPage() {
  const publicProfiles = profiles.filter((profile) => profile.url);

  return <div className="editorial-page editorial-about-page">
    <header className="page-shell editorial-about-hero">
      <div className="editorial-about-copy">
        <nav className="page-breadcrumb" aria-label="현재 위치"><Link href="/">홈</Link><span>/</span><span>소개</span></nav>
        <h1>안녕하세요.<br /><span>asterunee입니다.</span></h1>
        <p>개발과 알고리즘을 공부하며 발견한 것, 오래 붙잡은 생각과 일상의 장면을 읽기 좋은 글로 전합니다.</p>
        <Link href="/posts">작성한 글 보기 <ArrowRight size={15} /></Link>
      </div>
      <figure className="editorial-about-image">
        <Image src="/images/earth-orbit.webp" fill priority sizes="(max-width: 780px) 100vw, 520px" alt="깊은 우주에서 바라본 푸른 지구와 보랏빛 항성" />
        <figcaption><span>asterunee</span><small>{siteConfig.role}</small></figcaption>
      </figure>
    </header>

    <main className="page-shell editorial-about-body">
      <section className="editorial-about-story" aria-labelledby="about-story-title">
        <div><span>이름에 대하여</span><h2 id="about-story-title">별과 달 사이에서 생각을 문장으로 옮깁니다.</h2></div>
        <div><p><strong>aster</strong>의 별과 <strong>lune</strong>의 달 사이. asterunee는 개발하며 배운 것과 오래 붙잡은 생각을 한곳에서 나누기 위한 이름입니다.</p><p>정답을 빠르게 요약하기보다 왜 그런 질문이 생겼는지, 어떤 접근을 거쳐 이해하게 되었는지까지 설명합니다. 독자가 다음 생각으로 자연스럽게 이어갈 수 있는 글을 지향합니다.</p><blockquote>“{siteConfig.motto}”</blockquote></div>
      </section>

      <section className="editorial-about-section">
        <header><span>다루는 이야기</span><h2>코드 너머의 맥락까지</h2></header>
        <div className="editorial-topic-list">{topics.map(([title, description], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
      </section>

      <section className="editorial-about-section">
        <header><span>글쓰기 원칙</span><h2>이 블로그가 쓰는 방식</h2></header>
        <ol className="editorial-principle-list">{principles.map(([title, description], index) => <li key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></li>)}</ol>
      </section>

      {publicProfiles.length > 0 && <section className="editorial-about-section editorial-profile-section"><header><span>다른 곳에서</span><h2>온라인 프로필</h2></header><div>{publicProfiles.map((profile) => <a key={profile.name} href={profile.url} target="_blank" rel="noreferrer"><span>{profile.name}</span><small>@{profile.handle}</small><ArrowUpRight size={15} /></a>)}</div></section>}

      <section className="editorial-about-closing"><div><span>다음 이야기</span><h2>새로운 글에서<br />다시 만나요.</h2></div><p>개발과 알고리즘, 배움에 관한 기록을 천천히 이어갑니다.</p><Link href="/posts">전체 글 보기 <ArrowRight size={15} /></Link></section>
    </main>
  </div>;
}
