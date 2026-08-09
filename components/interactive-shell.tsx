"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Languages, Menu, MoonStar, Search, Sun, X } from "lucide-react";
import { profiles, siteConfig } from "@/lib/site";

type SearchItem = { title: string; href: string; description: string; tags: string[] };
type Theme = "dark" | "light" | "system";

export function InteractiveShell({ items }: { items: SearchItem[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState<"ko" | "en">("ko");
  const [theme, setTheme] = useState<Theme>("dark");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setTheme((localStorage.getItem("asterunee-theme") as Theme) || "dark");
      setLanguage((localStorage.getItem("asterunee-language") as "ko" | "en") || "ko");
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const media = matchMedia("(prefers-color-scheme: light)");
    const apply = () => { const resolved = theme === "system" ? media.matches ? "light" : "dark" : theme; root.dataset.theme = resolved; root.dataset.themePreference = theme; };
    apply(); media.addEventListener("change", apply);
    localStorage.setItem("asterunee-theme", theme);
    return () => media.removeEventListener("change", apply);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.lang = language;
    localStorage.setItem("asterunee-language", language);
  }, [language]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setPaletteOpen((v) => !v); }
      if (event.key === "Escape") { setPaletteOpen(false); setMenuOpen(false); }
    };
    addEventListener("keydown", onKey); return () => removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => { if (paletteOpen) setTimeout(() => inputRef.current?.focus(), 20); }, [paletteOpen]);

  const results = useMemo(() => {
    const q = query.toLowerCase();
    const pages = siteConfig.navigation.map((n) => ({ title: `${n.ko} · ${n.en}`, href: n.href, description: "페이지 이동", tags: [] }));
    return [...pages, ...items].filter((item) => [item.title, item.description, ...item.tags].join(" ").toLowerCase().includes(q)).slice(0, 8);
  }, [items, query]);
  const nextTheme = () => setTheme((value) => value === "dark" ? "light" : value === "light" ? "system" : "dark");

  return <>
    <div className="header-actions">
      <button className="icon-button search-trigger" onClick={() => setPaletteOpen(true)} aria-label="검색 열기"><Search size={17} /><span>⌘K</span></button>
      <button className="icon-button" onClick={() => setLanguage((v) => v === "ko" ? "en" : "ko")} aria-label={`언어: ${language === "ko" ? "한국어" : "English"}`} title="한국어 / English"><Languages size={18} /></button>
      <button className="icon-button" onClick={nextTheme} aria-label={`테마: ${theme}`} title={`Theme: ${theme}`}>{theme === "light" ? <Sun size={18} /> : <MoonStar size={18} />}</button>
      <button className="icon-button menu-trigger" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="메뉴"><Menu size={20} /></button>
    </div>
    {menuOpen && <nav className="mobile-menu" aria-label="모바일 탐색">
      {siteConfig.navigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}><span className="ko">{item.ko}</span><span className="en">{item.en}</span></Link>)}
    </nav>}
    {paletteOpen && <div className="palette-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setPaletteOpen(false); }}>
      <section className="palette" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="palette-input"><Search size={18} /><input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="글과 페이지를 관측하세요…" /><button onClick={() => setPaletteOpen(false)} aria-label="닫기"><X size={18} /></button></div>
        <div className="palette-results">
          {results.map((item) => <Link key={item.href} href={item.href} onClick={() => setPaletteOpen(false)}><span>{item.title}</span><small>{item.description}</small></Link>)}
          {!results.length && <p className="empty-state">이 궤도에서는 기록을 찾지 못했습니다.</p>}
        </div>
        <div className="palette-commands">
          <button onClick={nextTheme}>테마 변경 <kbd>T</kbd></button>
          <button onClick={() => setLanguage((v) => v === "ko" ? "en" : "ko")}>언어 변경 <kbd>L</kbd></button>
          {profiles.filter((p) => p.url).slice(0, 2).map((p) => <a key={p.name} href={p.url} target="_blank" rel="noreferrer">{p.name} 열기 ↗</a>)}
        </div>
      </section>
    </div>}
  </>;
}
