"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";

export function Comments() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/comments/status").then((response) => response.json()).then((data) => setReady(data.ready === true)).catch(() => setReady(false));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !ready) return;
    container.replaceChildren();
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.repo = "asterunee/Blog";
    script.dataset.repoId = "R_kgDOTyXqIA";
    script.dataset.category = "General";
    script.dataset.categoryId = "DIC_kwDOTyXqIM4DDCen";
    script.dataset.mapping = "pathname";
    script.dataset.strict = "1";
    script.dataset.reactionsEnabled = "1";
    script.dataset.emitMetadata = "0";
    script.dataset.inputPosition = "top";
    script.dataset.theme = ["light", "paper"].includes(document.documentElement.dataset.theme || "") ? "light" : "transparent_dark";
    script.dataset.lang = "ko";
    script.dataset.loading = "lazy";
    container.append(script);
    return () => container.replaceChildren();
  }, [pathname, ready]);

  return <section className="article-comments" aria-labelledby="comments-title">
    <header><div><MessageCircle size={17} /><h2 id="comments-title">댓글</h2></div><p>GitHub 계정으로 로그인해 질문과 의견을 남길 수 있습니다.</p></header>
    {ready === null && <p className="comments-state">댓글을 불러오는 중…</p>}
    {ready === false && <div className="comments-state"><p>댓글 연결 승인을 기다리고 있습니다.</p><Link href="https://github.com/asterunee/Blog/discussions" target="_blank">GitHub Discussions 열기 ↗</Link></div>}
    <div ref={containerRef} />
  </section>;
}
