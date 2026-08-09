import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function ArticleAuthor({ name }: { name: string }) {
  return <aside className="article-author">
    <div className="article-author-avatar"><Image src={siteConfig.profileImage} alt="asterunee 프로필" fill sizes="44px" /></div>
    <div><span>작성자</span><h2>{name}</h2><p>{siteConfig.sidebarIntro}</p></div>
    <Link href="/about">작성자 소개 <ArrowRight size={14} /></Link>
  </aside>;
}
