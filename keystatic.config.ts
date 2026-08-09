import { collection, config, fields } from "@keystatic/core";

const githubStorage = { kind: "github" as const, repo: "asterunee/Blog" as const, branchPrefix: "content/" };
const localStorage = { kind: "local" as const };
export const keystaticGithubMode = process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === "github";
const required = { validation: { isRequired: true } } as const;
const today = { kind: "today" as const };

export default config({
  storage: keystaticGithubMode ? githubStorage : localStorage,
  ui: { brand: { name: "asterunee logbook" } },
  collections: {
    posts: collection({
      label: "일반 글",
      slugField: "title",
      path: "content/posts/*",
      entryLayout: "content",
      columns: ["title", "category", "date", "draft"],
      format: { contentField: "body" },
      schema: {
        title: fields.slug({ name: { label: "글 제목", validation: { isRequired: true } }, slug: { label: "URL slug", description: "영문 소문자와 하이픈을 권장합니다." } }),
        description: fields.text({ label: "글 요약", multiline: true, ...required }),
        date: fields.date({ label: "작성일", defaultValue: today, ...required }),
        updated: fields.date({ label: "수정일", defaultValue: today, ...required }),
        author: fields.select({ label: "작성자", options: [{ label: "asterunee", value: "asterunee" }], defaultValue: "asterunee" }),
        category: fields.select({ label: "카테고리", options: [{ label: "개발", value: "개발" }, { label: "공부", value: "공부" }, { label: "생각", value: "생각" }, { label: "일상", value: "일상" }, { label: "독서와 콘텐츠", value: "독서와 콘텐츠" }, { label: "블로그", value: "블로그" }], defaultValue: "생각" }),
        tags: fields.array(fields.text({ label: "태그" }), { label: "태그", itemLabel: (props) => props.value }),
        featured: fields.checkbox({ label: "대표 글", defaultValue: false }),
        draft: fields.checkbox({ label: "초안", description: "해제하면 다음 배포부터 공개됩니다.", defaultValue: true }),
        body: fields.mdx({ label: "본문" }),
      },
    }),
    solutions: collection({
      label: "PS 풀이",
      slugField: "title",
      path: "content/solutions/*",
      entryLayout: "content",
      columns: ["title", "judge", "problemId", "date", "draft"],
      format: { contentField: "body" },
      schema: {
        title: fields.slug({ name: { label: "글 제목", validation: { isRequired: true } }, slug: { label: "URL slug", description: "영문 소문자와 하이픈을 권장합니다." } }),
        description: fields.text({ label: "목록에 표시할 요약", multiline: true, ...required }),
        date: fields.date({ label: "작성일", defaultValue: today, ...required }),
        updated: fields.date({ label: "수정일", defaultValue: today, ...required }),
        author: fields.select({ label: "작성자", options: [{ label: "asterunee", value: "asterunee" }], defaultValue: "asterunee" }),
        judge: fields.text({ label: "온라인 저지", defaultValue: "Codeforces", ...required }),
        problemId: fields.text({ label: "문제 번호", ...required }),
        problemUrl: fields.url({ label: "문제 원문 URL", ...required }),
        difficulty: fields.integer({ label: "레이팅/예상 난이도", defaultValue: 0, validation: { isRequired: true, min: 0, max: 10000 } }),
        tier: fields.text({ label: "티어 표기", defaultValue: "Unrated", ...required }),
        tags: fields.array(fields.text({ label: "태그" }), { label: "알고리즘 태그", itemLabel: (props) => props.value, validation: { length: { min: 1 } } }),
        language: fields.select({ label: "언어", options: [{ label: "C++17", value: "cpp" }], defaultValue: "cpp" }),
        solveTime: fields.integer({ label: "풀이 시간(분)", defaultValue: 1, validation: { isRequired: true, min: 1 } }),
        featured: fields.checkbox({ label: "대표 풀이", defaultValue: false }),
        draft: fields.checkbox({ label: "초안", description: "해제하면 다음 배포부터 공개됩니다.", defaultValue: true }),
        status: fields.select({ label: "풀이 상태", options: [{ label: "Solved", value: "Solved" }, { label: "Upsolved", value: "Upsolved" }], defaultValue: "Solved" }),
        timeLimit: fields.text({ label: "시간 제한", defaultValue: "2 seconds", ...required }),
        memoryLimit: fields.text({ label: "메모리 제한", defaultValue: "256 MB", ...required }),
        body: fields.mdx({ label: "풀이 본문", description: "관찰, 도출 과정, 증명, 복잡도, 구현과 디버깅을 기록하세요." }),
      },
    }),
    logs: collection({
      label: "관측 일지",
      slugField: "title",
      path: "content/log/*",
      entryLayout: "content",
      columns: ["title", "type", "date", "draft"],
      format: { contentField: "body" },
      schema: {
        title: fields.slug({ name: { label: "글 제목", validation: { isRequired: true } }, slug: { label: "URL slug" } }),
        description: fields.text({ label: "글 요약", multiline: true, ...required }),
        date: fields.date({ label: "작성일", defaultValue: today, ...required }),
        updated: fields.date({ label: "수정일", defaultValue: today, ...required }),
        author: fields.select({ label: "작성자", options: [{ label: "asterunee", value: "asterunee" }], defaultValue: "asterunee" }),
        type: fields.select({ label: "기록 종류", options: [{ label: "대회 후기", value: "대회 후기" }, { label: "공부 기록", value: "공부 기록" }, { label: "구현 기록", value: "구현 기록" }, { label: "디버깅 기록", value: "디버깅 기록" }, { label: "일상", value: "일상" }, { label: "생각", value: "생각" }, { label: "독서", value: "독서" }, { label: "짧은 메모", value: "짧은 메모" }], defaultValue: "짧은 메모" }),
        tags: fields.array(fields.text({ label: "태그" }), { label: "태그", itemLabel: (props) => props.value }),
        draft: fields.checkbox({ label: "초안", defaultValue: true }),
        body: fields.mdx({ label: "기록 본문" }),
      },
    }),
  },
});
