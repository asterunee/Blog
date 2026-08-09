import type { Metadata } from "next";
import Image from "next/image";
import { profiles, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "asterunee 소개",
  description: "코드와 배움, 생각과 일상을 기록하는 asterunee 소개",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-visual">
        <Image
          src="/images/earth-orbit.webp"
          fill
          priority
          sizes="100vw"
          alt="깊은 우주에서 바라본 푸른 지구와 왼쪽의 보랏빛 항성"
        />
        <div />
        <div>
          <span className="section-index">ABOUT / ASTER–LUNE</span>
          <h1>asterunee</h1>
          <p>{siteConfig.role}</p>
        </div>
      </section>

      <div className="page-shell about-content">
        <aside>
          <p>{siteConfig.motto}</p>
          <span>{siteConfig.supportingLine}</span>
        </aside>
        <article>
          <section>
            <span className="section-index">01 — IDENTITY</span>
            <h2>별과 달 사이에서</h2>
            <p>
              <strong>aster</strong>의 별과 <strong>lune</strong>의 달 사이. asterunee는
              개발하며 배운 것, 오래 붙잡은 생각, 일상의 작은 장면을 한곳에 남기기 위한 이름입니다.
            </p>
          </section>
          <section>
            <span className="section-index">02 — INTERESTS</span>
            <h2>무엇을 기록하나요</h2>
            <p>
              소프트웨어 개발과 경쟁 프로그래밍, 공부 과정과 도구, 읽고 본 것과 일상을 기록합니다.
              정답만 요약하기보다 질문이 생긴 지점과 생각이 변한 과정을 함께 남깁니다.
            </p>
          </section>
          <section>
            <span className="section-index">03 — ENVIRONMENT</span>
            <h2>주로 다루는 것</h2>
            <dl className="about-facts">
              <div><dt>Code</dt><dd>C++17 · TypeScript</dd></div>
              <div><dt>Topics</dt><dd>Web · Algorithms · Tools</dd></div>
              <div><dt>Role</dt><dd>{siteConfig.role}</dd></div>
            </dl>
          </section>
          <section>
            <span className="section-index">04 — SIGNALS</span>
            <h2>온라인 프로필</h2>
            <div className="profile-list">
              {profiles.map((profile) => profile.url ? (
                <a key={profile.name} href={profile.url} target="_blank" rel="noreferrer">
                  {profile.name}<span>@{profile.handle} ↗</span>
                </a>
              ) : (
                <div key={profile.name}>{profile.name}<span>@{profile.handle} · URL pending</span></div>
              ))}
            </div>
          </section>
          <section>
            <span className="section-index">05 — PRINCIPLES</span>
            <h2>기록 원칙</h2>
            <ol>
              <li>결론뿐 아니라 그곳에 도착한 과정도 남긴다.</li>
              <li>직접 확인한 사실과 개인적인 생각을 구분한다.</li>
              <li>틀린 접근과 바뀐 생각을 숨기지 않는다.</li>
              <li>나중에 다시 읽어도 이해할 수 있는 문장으로 쓴다.</li>
            </ol>
          </section>
        </article>
      </div>
    </div>
  );
}
