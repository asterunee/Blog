import rawSettings from "@/content/settings/site.json";

export const siteThemes = ["dark", "aurora", "forest", "sunset", "paper", "light"] as const;
export type SiteTheme = (typeof siteThemes)[number];

type SiteSettings = {
  siteName: string;
  tagline: string;
  description: string;
  intro: string;
  sidebarIntro: string;
  motto: string;
  supportingLine: string;
  role: string;
  nowTitle: string;
  nowDescription: string;
  backgroundImage: string;
  backgroundPosition: string;
  backgroundStrength: number;
  backgroundPattern: "stars" | "aurora" | "quiet" | "none";
  accentColor: string;
  defaultTheme: SiteTheme;
  showJudgeSignals: boolean;
};

const defaults: SiteSettings = {
  siteName: "asterunee",
  tagline: "별과 달 사이의 기록",
  description: "개발과 알고리즘, 기술과 일상에서 발견한 이야기를 나누는 블로그",
  intro: "개발과 알고리즘, 배움과 일상에서 발견한 이야기를 나눕니다.",
  sidebarIntro: "개발과 알고리즘, 배움과 일상의 이야기를 함께 나눕니다.",
  motto: "Observe deeply. Write honestly.",
  supportingLine: "Thoughts gathered across an endless night.",
  role: "Developer, Competitive Programmer & Writer",
  nowTitle: "",
  nowDescription: "",
  backgroundImage: "/images/observatory-hero.webp",
  backgroundPosition: "center",
  backgroundStrength: 16,
  backgroundPattern: "stars",
  accentColor: "#5ee7f7",
  defaultTheme: "dark",
  showJudgeSignals: true,
};

const stored = rawSettings as Partial<SiteSettings>;
const selectedTheme = siteThemes.includes(stored.defaultTheme as SiteTheme) ? stored.defaultTheme as SiteTheme : defaults.defaultTheme;

export const siteSettings: SiteSettings = {
  ...defaults,
  ...stored,
  backgroundImage: stored.backgroundImage || "",
  backgroundStrength: Number.isFinite(stored.backgroundStrength) ? stored.backgroundStrength as number : defaults.backgroundStrength,
  defaultTheme: selectedTheme,
};
