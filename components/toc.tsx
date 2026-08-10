"use client";
import { useEffect, useRef, useState } from "react";

export function TableOfContents({ headings }: { headings: { title: string; id: string }[] }) {
  const [active, setActive] = useState(headings[0]?.id || "");
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const sections = headings.flatMap((heading) => {
      const element = document.getElementById(heading.id);
      return element ? [{ id: heading.id, element }] : [];
    });
    let positions: { id: string; top: number }[] = [];
    let frame = 0;

    const measure = () => {
      positions = sections.map(({ id, element }) => ({ id, top: element.getBoundingClientRect().top + window.scrollY }));
      requestUpdate();
    };

    const update = () => {
      frame = 0;
      const height = document.documentElement.scrollHeight - innerHeight;
      const progress = height > 0 ? Math.min(1, Math.max(0, scrollY / height)) : 0;
      progressRef.current?.style.setProperty("--reading-progress", String(progress));

      const marker = scrollY + 160;
      let next = positions[0]?.id || "";
      for (const position of positions) {
        if (position.top > marker) break;
        next = position.id;
      }
      if (next) setActive((current) => current === next ? current : next);
    };

    function requestUpdate() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    const resizeObserver = new ResizeObserver(measure);
    const article = document.querySelector(".prose") || document.body;
    resizeObserver.observe(article);
    measure();
    addEventListener("scroll", requestUpdate, { passive: true });
    addEventListener("resize", measure, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      removeEventListener("scroll", requestUpdate);
      removeEventListener("resize", measure);
    };
  }, [headings]);

  return <aside className="toc"><div className="progress-track"><span ref={progressRef} /></div><details open><summary>이 글의 목차</summary><nav>{headings.map((heading) => <a key={heading.id} className={active === heading.id ? "active" : ""} href={`#${heading.id}`}>{heading.title}</a>)}</nav></details></aside>;
}
