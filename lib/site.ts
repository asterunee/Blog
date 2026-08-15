import { siteSettings as settings } from "@/lib/settings";
import { customContentSections } from "@/lib/editor-settings";

export const siteConfig = {
  name: settings.siteName,
  title: `${settings.siteName} — ${settings.tagline}`,
  description: settings.description,
  koreanSubtitle: settings.tagline,
  englishSubtitle: "A personal blog about code, learning and everyday life",
  intro: settings.intro,
  sidebarIntro: settings.sidebarIntro,
  motto: settings.motto,
  supportingLine: settings.supportingLine,
  role: settings.role,
  profileImage: settings.profileImage,
  nowTitle: settings.nowTitle,
  nowDescription: settings.nowDescription,
  backgroundImage: settings.backgroundImage,
  backgroundPosition: settings.backgroundPosition,
  backgroundStrength: settings.backgroundStrength,
  backgroundPattern: settings.backgroundPattern,
  accentColor: settings.accentColor,
  defaultTheme: settings.defaultTheme,
  showJudgeSignals: settings.showJudgeSignals,
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  navigation: [
    ...settings.navigation.filter((item) => item.visible).map((item) => ({ href: item.href, ko: item.label, en: item.labelEn })),
    ...customContentSections.filter((item) => item.visible && item.showInNavigation).map((item) => ({ href: `/content/${item.key}`, ko: item.label, en: item.label })),
  ].filter((item, index, all) => all.findIndex((entry) => entry.href === item.href) === index),
} as const;

export type Profile = { name: string; handle: string; url?: string };

export const profiles: Profile[] = [
  { name: "Codeforces", handle: "asterunee", url: process.env.NEXT_PUBLIC_CODEFORCES_URL || "https://codeforces.com/profile/asterunee" },
  { name: "AtCoder", handle: "asterunee", url: process.env.NEXT_PUBLIC_ATCODER_URL || "https://atcoder.jp/users/asterunee" },
  { name: "LeetCode", handle: "asterunee", url: process.env.NEXT_PUBLIC_LEETCODE_URL || "https://leetcode.com/u/asterunee/" },
  { name: "CodeChef", handle: "asterunee", url: process.env.NEXT_PUBLIC_CODECHEF_URL },
  { name: "Repovive", handle: "asterunee", url: process.env.NEXT_PUBLIC_REPOVIVE_URL },
  { name: "Yukicoder", handle: "asterunee", url: process.env.NEXT_PUBLIC_YUKICODER_URL },
  { name: "CList", handle: "asterunee", url: process.env.NEXT_PUBLIC_CLIST_URL },
  { name: "GitHub", handle: "asterunee", url: process.env.NEXT_PUBLIC_GITHUB_URL },
];

export const libraryItems = [
  { name: "Disjoint Set Union", category: "자료구조", include: "library/datastructure/union_find/union_find.hpp", description: "경로 압축과 union by size를 사용하는 서로소 집합 자료구조", condition: "정점 집합이 고정되고 합치기만 발생할 때", complexity: "amortized O(α(N))", related: "" },
  { name: "Dijkstra", category: "그래프", include: "library/graph/dijkstra.hpp", description: "음이 아닌 가중치 그래프의 단일 시작점 최단 경로", condition: "모든 간선 가중치가 0 이상일 때", complexity: "O((V + E) log V)", related: "" },
  { name: "Formal Power Series", category: "FPS", include: "library/polynomial/formal_power_series.hpp", description: "형식적 멱급수의 곱셈·역원·로그·지수 연산", condition: "NTT-friendly mod 또는 convolution 구현이 있을 때", complexity: "O(N log N)", related: "" },
] as const;
