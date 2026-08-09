"use client";
import { useEffect, useState } from "react";

export function TableOfContents({ headings }: { headings: { title: string; id: string }[] }) {
  const [active, setActive] = useState(headings[0]?.id || "");
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - innerHeight;
      setProgress(height > 0 ? Math.min(100, scrollY / height * 100) : 0);
      const current = headings.map((h) => document.getElementById(h.id)).filter(Boolean).reverse().find((el) => (el?.getBoundingClientRect().top || 0) < 160);
      if (current) setActive(current.id);
    };
    onScroll(); addEventListener("scroll", onScroll, { passive: true }); return () => removeEventListener("scroll", onScroll);
  }, [headings]);
  return <aside className="toc"><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><details open><summary>이 관측의 좌표</summary><nav>{headings.map((heading) => <a key={heading.id} className={active === heading.id ? "active" : ""} href={`#${heading.id}`}>{heading.title}</a>)}</nav></details></aside>;
}
