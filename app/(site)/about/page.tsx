import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { StreakMap } from "@/components/streak-map";
import { RatingChart } from "@/components/rating-chart";
import { LeetCodeActivity } from "@/components/leetcode-activity";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "asterunee 소개",
  description: "개발과 알고리즘, 배움과 일상의 이야기를 나누는 asterunee 소개",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <div className="editorial-page editorial-about-page">
    <header className="page-shell editorial-about-hero">
      <div className="editorial-about-copy">
        <nav className="page-breadcrumb" aria-label="현재 위치"><Link href="/">홈</Link><span>/</span><span>소개</span></nav>
        <h1>안녕하세요.<br /><span>asterunee입니다.</span></h1>
        <p>개발과 알고리즘을 공부하며 발견한 것, 오래 붙잡은 생각과 일상의 장면을 읽기 좋은 글로 전합니다.</p>
        <Link href="/posts">작성한 글 보기 <ArrowRight size={15} /></Link>
      </div>
      <figure className="editorial-about-image">
        <Image src={siteConfig.profileImage} fill priority sizes="(max-width: 780px) 100vw, 520px" alt="asterunee 프로필 이미지" />
        <figcaption><span>asterunee</span><small>{siteConfig.role}</small></figcaption>
      </figure>
    </header>

    <main className="page-shell about-streaks" aria-label="온라인 저지 제출 스트릭">
      <section>
        <header><div><span>SUBMISSION STREAK</span><h2>Codeforces</h2></div><a href="https://codeforces.com/profile/asterunee" target="_blank" rel="noreferrer">@asterunee <ArrowUpRight size={14} /></a></header>
        <RatingChart judge="Codeforces" />
        <StreakMap judge="Codeforces" />
      </section>
      <section>
        <header><div><span>SUBMISSION STREAK</span><h2>AtCoder</h2></div><a href="https://atcoder.jp/users/asterunee" target="_blank" rel="noreferrer">@asterunee <ArrowUpRight size={14} /></a></header>
        <RatingChart judge="AtCoder" />
        <StreakMap judge="AtCoder" />
      </section>
      <section>
        <header><div><span>PROBLEM SOLVING</span><h2>LeetCode</h2></div><a href="https://leetcode.com/u/asterunee/" target="_blank" rel="noreferrer">@asterunee <ArrowUpRight size={14} /></a></header>
        <LeetCodeActivity />
        <StreakMap judge="LeetCode" />
      </section>
    </main>
  </div>;
}
