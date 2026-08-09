"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Languages, Menu, Monitor, MoonStar, Palette, Search, Sun, X } from "lucide-react";
import { profiles, siteConfig } from "@/lib/site";

type SearchItem = { title: string; href: string; description: string; tags: string[] };
const themeOptions = [
  { id: "dark", label: "별밤", color: "#5ee7f7", icon: MoonStar },
  { id: "aurora", label: "오로라", color: "#72f1b8", icon: Palette },
  { id: "forest", label: "숲", color: "#86d293", icon: MoonStar },
  { id: "sunset", label: "노을", color: "#ff9f7a", icon: Sun },
  { id: "paper", label: "종이", color: "#9a6b3f", icon: Sun },
  { id: "light", label: "밝게", color: "#087f95", icon: Sun },
  { id: "system", label: "시스템", color: "#91a4be", icon: Monitor },
] as const;
type Theme = (typeof themeOptions)[number]["id"];

function isTheme(value: string | null): value is Theme {
  return themeOptions.some((theme) => theme.id === value);
}

export function InteractiveShell({ items }: { items: SearchItem[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState<"ko" | "en">("ko");
  const fallbackTheme: Theme = isTheme(siteConfig.defaultTheme) ? siteConfig.defaultTheme : "dark";
  const [theme, setTheme] = useState<Theme>(fallbackTheme);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const savedTheme = localStorage.getItem("asterunee-theme");
      setTheme(isTheme(savedTheme) ? savedTheme : fallbackTheme);
      setLanguage(localStorage.getItem("asterunee-language") === "en" ? "en" : "ko");
    });
    return () => cancelAnimationFrame(frame);
  }, [fallbackTheme]);

  useEffect(() => {
    const root = document.documentElement;
    const media = matchMedia("(prefers-color-scheme: light)");
    const apply = () => {
      const resolved = theme === "system" ? media.matches ? "light" : "dark" : theme;
      root.dataset.theme = resolved;
      root.dataset.themePreference = theme;
    };
    apply();
    media.addEventListener("change", apply);
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
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((value) => !value);
      }
      if (event.key === "Escape") {
        setPaletteOpen(false);
        setMenuOpen(false);
        setThemeMenuOpen(false);
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => { if (paletteOpen) setTimeout(() => inputRef.current?.focus(), 20); }, [paletteOpen]);

  const results = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    const pages = siteConfig.navigation.map((item) => ({ title: `${item.ko} · ${item.en}`, href: item.href, description: "페이지 이동", tags: [] }));
    return [...pages, ...items].filter((item) => [item.title, item.description, ...item.tags].join(" ").toLowerCase().includes(normalizedQuery)).slice(0, 8);
  }, [items, query]);

  const activeTheme = themeOptions.find((option) => option.id === theme) || themeOptions[0];
  const ActiveThemeIcon = activeTheme.icon;

  return <>
    <div className="header-actions">
      <button className="icon-button search-trigger" onClick={() => setPaletteOpen(true)} aria-label="검색 열기"><Search size={17} /><span>⌘K</span></button>
      <button className="icon-button" onClick={() => setLanguage((value) => value === "ko" ? "en" : "ko")} aria-label={`언어: ${language === "ko" ? "한국어" : "English"}`} title="한국어 / English"><Languages size={18} /></button>
      <div className="theme-picker">
        <button className="icon-button" onClick={() => setThemeMenuOpen((value) => !value)} aria-expanded={themeMenuOpen} aria-label={`테마: ${activeTheme.label}`} title={`테마: ${activeTheme.label}`}><ActiveThemeIcon size={18} /></button>
        {themeMenuOpen && <div className="theme-menu" role="menu" aria-label="테마 선택">
          <p>화면 테마</p>
          {themeOptions.map((option) => <button key={option.id} role="menuitemradio" aria-checked={theme === option.id} onClick={() => { setTheme(option.id); setThemeMenuOpen(false); }}><i style={{ background: option.color }} /><span>{option.label}</span>{theme === option.id && <Check size={14} />}</button>)}
        </div>}
      </div>
      <button className="icon-button menu-trigger" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="메뉴"><Menu size={20} /></button>
    </div>
    {menuOpen && <nav className="mobile-menu" aria-label="모바일 탐색">
      {siteConfig.navigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}><span className="ko">{item.ko}</span><span className="en">{item.en}</span></Link>)}
    </nav>}
    {paletteOpen && <div className="palette-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPaletteOpen(false); }}>
      <section className="palette" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="palette-input"><Search size={18} /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="글과 페이지를 검색하세요…" /><button onClick={() => setPaletteOpen(false)} aria-label="닫기"><X size={18} /></button></div>
        <div className="palette-results">
          {results.map((item) => <Link key={item.href} href={item.href} onClick={() => setPaletteOpen(false)}><span>{item.title}</span><small>{item.description}</small></Link>)}
          {!results.length && <p className="empty-state">검색 결과가 없습니다.</p>}
        </div>
        <div className="palette-commands">
          <button onClick={() => { setPaletteOpen(false); setThemeMenuOpen(true); }}>테마 선택 <kbd>T</kbd></button>
          <button onClick={() => setLanguage((value) => value === "ko" ? "en" : "ko")}>언어 변경 <kbd>L</kbd></button>
          {profiles.filter((profile) => profile.url).slice(0, 2).map((profile) => <a key={profile.name} href={profile.url} target="_blank" rel="noreferrer">{profile.name} 열기 ↗</a>)}
        </div>
      </section>
    </div>}
  </>;
}
