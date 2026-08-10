"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Megaphone } from "lucide-react";
import { useState } from "react";
import type { Notice } from "@/lib/notices";

type NoticeBannerProps = {
  notices: Notice[];
  fallback: { title: string; summary: string; image: string; position: string };
};

export function NoticeBanner({ notices, fallback }: NoticeBannerProps) {
  const [index, setIndex] = useState(0);
  const notice = notices[index];
  const image = notice?.backgroundImage || fallback.image;
  const position = notice?.backgroundPosition || fallback.position;
  const href = notice?.href.trim();
  const external = Boolean(href && /^https?:\/\//.test(href));

  function move(direction: number) {
    setIndex((current) => (current + direction + notices.length) % notices.length);
  }

  return <section className={`blog-masthead${notice ? " notice-masthead" : ""}`} aria-label={notice ? "공지사항" : "블로그 소개"}>
    <Image src={image} alt="" fill priority sizes="(max-width: 1050px) 100vw, 760px" style={{ objectPosition: position }} />
    <div className="blog-masthead-shade" />
    <div className="blog-masthead-copy">
      {notice && <div className="notice-eyebrow"><Megaphone size={13} /><span>{notice.label}</span><time>{notice.publishedAt}</time></div>}
      <h1>{notice?.title || fallback.title}</h1>
      <p>{notice?.summary || fallback.summary}</p>
      {href && (external || notice.newTab
        ? <a className="notice-link" href={href} target={notice.newTab ? "_blank" : undefined} rel={notice.newTab ? "noreferrer" : undefined}>{notice.linkLabel || "자세히 보기"}<ArrowUpRight size={14} /></a>
        : <Link className="notice-link" href={href}>{notice.linkLabel || "자세히 보기"}<ArrowRight size={14} /></Link>)}
    </div>
    {notices.length > 1 && <div className="notice-controls"><span>{String(index + 1).padStart(2, "0")} / {String(notices.length).padStart(2, "0")}</span><button type="button" onClick={() => move(-1)} aria-label="이전 공지"><ArrowLeft size={14} /></button><button type="button" onClick={() => move(1)} aria-label="다음 공지"><ArrowRight size={14} /></button></div>}
  </section>;
}
