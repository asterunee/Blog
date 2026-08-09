export const siteConfig = {
  name: "asterunee",
  title: "asterunee — 별과 달 사이의 알고리즘 기록",
  description: "Algorithmic records beneath distant stars",
  koreanSubtitle: "별과 달 사이의 알고리즘 기록",
  englishSubtitle: "Algorithmic records beneath distant stars",
  motto: "Observe deeply. Prove precisely.",
  supportingLine: "Algorithms traced across an endless night.",
  role: "Competitive Programmer & Full-Stack Developer",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  navigation: [
    { href: "/solutions", ko: "풀이", en: "Solutions" },
    { href: "/algorithms", ko: "알고리즘", en: "Algorithms" },
    { href: "/tags", ko: "태그", en: "Tags" },
    { href: "/archive", ko: "아카이브", en: "Archive" },
    { href: "/library", ko: "라이브러리", en: "Library" },
    { href: "/log", ko: "기록", en: "Log" },
    { href: "/about", ko: "소개", en: "About" },
  ],
} as const;

export type Profile = { name: string; handle: string; url?: string };

export const profiles: Profile[] = [
  { name: "Codeforces", handle: "asterunee", url: process.env.NEXT_PUBLIC_CODEFORCES_URL || "https://codeforces.com/profile/asterunee" },
  { name: "AtCoder", handle: "asterunee", url: process.env.NEXT_PUBLIC_ATCODER_URL || "https://atcoder.jp/users/asterunee" },
  { name: "CodeChef", handle: "asterunee", url: process.env.NEXT_PUBLIC_CODECHEF_URL },
  { name: "Repovive", handle: "asterunee", url: process.env.NEXT_PUBLIC_REPOVIVE_URL },
  { name: "Yukicoder", handle: "asterunee", url: process.env.NEXT_PUBLIC_YUKICODER_URL },
  { name: "CList", handle: "asterunee", url: process.env.NEXT_PUBLIC_CLIST_URL },
  { name: "GitHub", handle: "asterunee", url: process.env.NEXT_PUBLIC_GITHUB_URL },
];

export const algorithms = [
  ["자료구조", "data-structures", 12], ["그래프", "graph", 18], ["트리", "tree", 9],
  ["문자열", "string", 7], ["수론", "number-theory", 10], ["조합론", "combinatorics", 5],
  ["동적 계획법", "dynamic-programming", 16], ["기하", "geometry", 4],
  ["Convolution", "convolution", 3], ["Formal Power Series", "fps", 2],
  ["휴리스틱 및 챌린지", "heuristic", 6],
] as const;

export const libraryItems = [
  { name: "Disjoint Set Union", category: "자료구조", include: "library/datastructure/union_find/union_find.hpp", description: "경로 압축과 union by size를 사용하는 서로소 집합 자료구조", condition: "정점 집합이 고정되고 합치기만 발생할 때", complexity: "amortized O(α(N))", related: "constellation-bridges" },
  { name: "Dijkstra", category: "그래프", include: "library/graph/dijkstra.hpp", description: "음이 아닌 가중치 그래프의 단일 시작점 최단 경로", condition: "모든 간선 가중치가 0 이상일 때", complexity: "O((V + E) log V)", related: "orbital-route" },
  { name: "Formal Power Series", category: "FPS", include: "library/polynomial/formal_power_series.hpp", description: "형식적 멱급수의 곱셈·역원·로그·지수 연산", condition: "NTT-friendly mod 또는 convolution 구현이 있을 때", complexity: "O(N log N)", related: "" },
] as const;
