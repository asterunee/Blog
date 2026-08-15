import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquareHeart } from "lucide-react";
import { Comments } from "@/components/comments";

export const metadata: Metadata = {
  title: "방명록",
  description: "asterunee 블로그에 인사와 이야기를 남기는 방명록",
  alternates: { canonical: "/guestbook" },
};

export default function GuestbookPage() {
  return <div className="page-shell guestbook-page">
    <header className="guestbook-header">
      <nav className="page-breadcrumb" aria-label="현재 위치"><Link href="/">홈</Link><span>/</span><span>방명록</span></nav>
      <div><MessageSquareHeart size={23} /><span>GUESTBOOK</span></div>
      <h1>방명록</h1>
      <p>짧은 인사부터 함께 나누고 싶은 이야기까지 편하게 남겨 주세요.</p>
    </header>
    <Comments title="방명록" description="로그인한 계정으로 남긴 이야기가 이곳에 차곡차곡 쌓입니다." />
  </div>;
}
