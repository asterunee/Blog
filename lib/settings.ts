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
  profileImage: string;
  nowTitle: string;
  nowDescription: string;
  backgroundImage: string;
  backgroundPosition: string;
  backgroundStrength: number;
  backgroundPattern: "stars" | "aurora" | "quiet" | "none";
  accentColor: string;
  defaultTheme: SiteTheme;
  showJudgeSignals: boolean;
  navigation: NavigationItem[];
};

export type NavigationItem = {
  label: string;
  labelEn: string;
  href: string;
  visible: boolean;
};

const defaultNavigation: NavigationItem[] = [
  { label: "글", labelEn: "Posts", href: "/posts", visible: true },
  { label: "카테고리", labelEn: "Categories", href: "/categories", visible: true },
  { label: "풀이", labelEn: "Solutions", href: "/solutions", visible: true },
  { label: "알고리즘", labelEn: "Algorithms", href: "/algorithms", visible: true },
  { label: "태그", labelEn: "Tags", href: "/tags", visible: true },
  { label: "아카이브", labelEn: "Archive", href: "/archive", visible: true },
  { label: "기록", labelEn: "Log", href: "/log", visible: true },
  { label: "소개", labelEn: "About", href: "/about", visible: true },
];

const defaults: SiteSettings = {
  siteName: "asterunee",
  tagline: "개발과 배움을 기록하는 블로그",
  description: "개발과 알고리즘, 기술과 일상에서 발견한 이야기를 나누는 블로그",
  intro: "개발과 알고리즘, 배움과 일상에서 발견한 이야기를 나눕니다.",
  sidebarIntro: "개발과 알고리즘, 배움과 일상의 이야기를 함께 나눕니다.",
  motto: "배운 것을 정리하고, 생각을 나눕니다.",
  supportingLine: "개발, 알고리즘과 일상의 기록을 차분히 이어갑니다.",
  role: "개발자 · 경쟁 프로그래머 · 글쓴이",
  profileImage: "/images/profile-asterunee.webp",
  nowTitle: "",
  nowDescription: "",
  backgroundImage: "/images/observatory-hero.webp",
  backgroundPosition: "center",
  backgroundStrength: 16,
  backgroundPattern: "stars",
  accentColor: "#5ee7f7",
  defaultTheme: "dark",
  showJudgeSignals: true,
  navigation: defaultNavigation,
};

const stored = rawSettings as Partial<SiteSettings>;
const selectedTheme = siteThemes.includes(stored.defaultTheme as SiteTheme) ? stored.defaultTheme as SiteTheme : defaults.defaultTheme;

export const siteSettings: SiteSettings = {
  ...defaults,
  ...stored,
  backgroundImage: stored.backgroundImage || "",
  profileImage: stored.profileImage || defaults.profileImage,
  backgroundStrength: Number.isFinite(stored.backgroundStrength) ? stored.backgroundStrength as number : defaults.backgroundStrength,
  defaultTheme: selectedTheme,
  navigation: Array.isArray(stored.navigation) && stored.navigation.length
    ? stored.navigation.filter((item): item is NavigationItem => Boolean(item && typeof item.label === "string" && typeof item.href === "string")).map((item) => ({ label: item.label, labelEn: item.labelEn || item.label, href: item.href, visible: item.visible !== false }))
    : defaultNavigation,
};
