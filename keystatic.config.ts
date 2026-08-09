import { collection, config, fields, singleton } from "@keystatic/core";
import { block, inline, repeating, wrapper } from "@keystatic/core/content-components";
import editorSettings from "./content/settings/editor.json";

const githubStorage = { kind: "github" as const, repo: "asterunee/Blog" as const, branchPrefix: "content/" };
const localStorage = { kind: "local" as const };
export const keystaticGithubMode = process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === "github";
type EditorSection = { key?: string; label?: string; description?: string; order?: number; visible?: boolean; showInNavigation?: boolean; showOnHome?: boolean };
const editorMenu = editorSettings as { groupLabel?: string; sections?: EditorSection[] };
const builtInEditorKeys = new Set(["posts", "solutions", "logs"]);
const editorSections = (Array.isArray(editorMenu.sections) ? editorMenu.sections : []).flatMap((section) => {
  const key = (section.key || "").trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  if (!key || !section.label?.trim()) return [];
  return [{ ...section, key, label: section.label.trim(), collectionKey: builtInEditorKeys.has(key) ? key : `custom_${key.replaceAll("-", "_")}` }];
}).filter((section, index, all) => all.findIndex((entry) => entry.key === section.key) === index).sort((a, b) => (a.order || 0) - (b.order || 0));
const customSections = editorSections.filter((section) => !builtInEditorKeys.has(section.key));
const visibleEditorCollections = editorSections.filter((section) => section.visible !== false).map((section) => section.collectionKey);
const editorLabels = {
  posts: editorSections.find((section) => section.key === "posts")?.label || "글",
  solutions: editorSections.find((section) => section.key === "solutions")?.label || "PS 풀이",
  logs: editorSections.find((section) => section.key === "logs")?.label || "짧은 기록",
};

const required = { validation: { isRequired: true } } as const;
const today = { kind: "today" as const };
const richEditorOptions = {
  bold: true,
  italic: true,
  strikethrough: true,
  code: true,
  heading: [2, 3, 4, 5, 6] as const,
  blockquote: true,
  orderedList: true,
  unorderedList: true,
  table: true,
  link: true,
  divider: true,
  codeBlock: true,
};

const contentComponents = (directory: string, publicPath: string) => ({
  Callout: wrapper({
    label: "콜아웃",
    description: "정보, 팁, 주의, 성공 메시지를 강조합니다.",
    schema: {
      variant: fields.select({
        label: "종류",
        options: [
          { label: "정보", value: "info" },
          { label: "팁", value: "tip" },
          { label: "주의", value: "warning" },
          { label: "성공", value: "success" },
        ],
        defaultValue: "info",
      }),
      title: fields.text({ label: "제목" }),
    },
  }),
  Details: wrapper({
    label: "접이식 내용",
    description: "정답, 부연 설명처럼 필요할 때 펼쳐 보는 내용을 만듭니다.",
    schema: {
      title: fields.text({ label: "펼치기 제목", defaultValue: "자세히 보기", ...required }),
      open: fields.checkbox({ label: "처음부터 펼치기", defaultValue: false }),
    },
  }),
  PullQuote: wrapper({
    label: "강조 인용",
    description: "본문에서 중요한 문장이나 인용을 크게 보여 줍니다.",
    schema: {
      attribution: fields.text({ label: "출처/이름" }),
      sourceUrl: fields.url({ label: "출처 링크" }),
    },
  }),
  ActionButton: block({
    label: "버튼",
    description: "독자가 이동할 수 있는 강조 링크를 넣습니다.",
    schema: {
      label: fields.text({ label: "버튼 문구", defaultValue: "자세히 보기", ...required }),
      url: fields.url({ label: "이동 URL", ...required }),
      variant: fields.select({
        label: "모양",
        options: [
          { label: "강조", value: "primary" },
          { label: "테두리", value: "outline" },
          { label: "텍스트", value: "text" },
        ],
        defaultValue: "primary",
      }),
      newTab: fields.checkbox({ label: "새 탭에서 열기", defaultValue: false }),
    },
  }),
  LinkCard: block({
    label: "링크 카드",
    description: "참고 자료, 프로젝트, 관련 글을 카드로 소개합니다.",
    schema: {
      title: fields.text({ label: "제목", ...required }),
      description: fields.text({ label: "설명", multiline: true }),
      url: fields.url({ label: "URL", ...required }),
      eyebrow: fields.text({ label: "작은 분류", defaultValue: "RELATED" }),
    },
  }),
  YouTube: block({
    label: "YouTube 영상",
    description: "영상 주소의 ID를 입력해 반응형 플레이어를 삽입합니다.",
    schema: {
      videoId: fields.text({ label: "YouTube 영상 ID", description: "예: dQw4w9WgXcQ", ...required }),
      title: fields.text({ label: "영상 제목", defaultValue: "YouTube 영상", ...required }),
      caption: fields.text({ label: "설명" }),
    },
  }),
  Figure: block({
    label: "캡션 이미지",
    description: "설명과 출처가 있는 이미지를 넣습니다.",
    schema: {
      image: fields.image({ label: "이미지", directory, publicPath }),
      alt: fields.text({ label: "대체 텍스트", description: "이미지 내용을 설명하세요.", ...required }),
      caption: fields.text({ label: "캡션", multiline: true }),
      credit: fields.text({ label: "출처/크레딧" }),
    },
  }),
  FileDownload: block({
    label: "다운로드",
    description: "문서, 소스 코드 등 외부 파일 다운로드 링크를 넣습니다.",
    schema: {
      label: fields.text({ label: "파일 이름", ...required }),
      url: fields.url({ label: "파일 URL", ...required }),
      detail: fields.text({ label: "형식·용량 등 설명" }),
    },
  }),
  Badge: inline({
    label: "인라인 배지",
    description: "문장 안에 상태나 짧은 키워드를 표시합니다.",
    schema: {
      label: fields.text({ label: "문구", defaultValue: "NEW", ...required }),
      tone: fields.select({
        label: "색상",
        options: [
          { label: "강조", value: "accent" },
          { label: "정보", value: "info" },
          { label: "성공", value: "success" },
          { label: "주의", value: "warning" },
        ],
        defaultValue: "accent",
      }),
    },
  }),
  Gallery: repeating({
    label: "이미지 갤러리",
    description: "여러 이미지를 2~3열 갤러리로 배치합니다.",
    children: ["GalleryImage"],
    validation: { children: { min: 1, max: 12 } },
    schema: {
      columns: fields.integer({ label: "열 수", defaultValue: 2, validation: { min: 2, max: 3 } }),
    },
  }),
  GalleryImage: block({
    label: "갤러리 이미지",
    schema: {
      image: fields.image({ label: "이미지", directory, publicPath }),
      alt: fields.text({ label: "대체 텍스트", ...required }),
      caption: fields.text({ label: "짧은 캡션" }),
    },
    forSpecificLocations: true,
  }),
  CodeSnippet: block({
    label: "코드 스니펫",
    description: "파일명, 언어와 하이라이트 줄을 지정한 코드 블록을 넣습니다.",
    schema: {
      filename: fields.text({ label: "파일 이름", defaultValue: "snippet.ts", ...required }),
      language: fields.text({ label: "언어", defaultValue: "typescript", ...required }),
      highlights: fields.text({ label: "강조할 줄", description: "예: 1,3-5" }),
      code: fields.text({ label: "코드", multiline: true, ...required }),
    },
  }),
  Checklist: block({
    label: "체크리스트",
    description: "한 줄에 하나씩 항목을 입력해 체크리스트를 만듭니다.",
    schema: {
      title: fields.text({ label: "제목" }),
      items: fields.text({ label: "항목", multiline: true, description: "완료 항목은 [x], 미완료 항목은 [ ]로 시작하세요.", ...required }),
    },
  }),
  Comparison: block({
    label: "두 항목 비교",
    description: "선택지, 접근법 또는 장단점을 두 열로 비교합니다.",
    schema: {
      leftTitle: fields.text({ label: "왼쪽 제목", ...required }),
      leftBody: fields.text({ label: "왼쪽 내용", multiline: true, ...required }),
      rightTitle: fields.text({ label: "오른쪽 제목", ...required }),
      rightBody: fields.text({ label: "오른쪽 내용", multiline: true, ...required }),
    },
  }),
  StatGrid: block({
    label: "수치 요약",
    description: "핵심 수치나 정보를 2~4개 항목으로 정리합니다.",
    schema: {
      items: fields.array(fields.object({
        label: fields.text({ label: "이름", ...required }),
        value: fields.text({ label: "값", ...required }),
        note: fields.text({ label: "설명" }),
      }), { label: "항목", validation: { length: { min: 2, max: 4 } }, itemLabel: (props) => props.fields.label.value || "새 항목" }),
    },
  }),
  AudioPlayer: block({
    label: "오디오",
    description: "오디오 파일이나 팟캐스트 주소를 삽입합니다.",
    schema: {
      title: fields.text({ label: "제목", ...required }),
      url: fields.url({ label: "오디오 URL", ...required }),
      caption: fields.text({ label: "설명" }),
    },
  }),
  SectionBreak: block({
    label: "구분선과 소제목",
    description: "긴 글의 흐름을 나누는 짧은 구분 문구를 넣습니다.",
    schema: {
      label: fields.text({ label: "구분 문구", ...required }),
    },
  }),
});

const bodyField = (directory: string, publicPath: string, description: string) => fields.mdx({
  label: "본문",
  description,
  components: contentComponents(directory, publicPath),
  options: {
    ...richEditorOptions,
    image: {
      directory,
      publicPath,
      schema: {
        alt: fields.text({ label: "대체 텍스트", description: "접근성을 위해 이미지 내용을 설명하세요." }),
        title: fields.text({ label: "이미지 제목" }),
      },
    },
  },
});

const algorithmTopicsField = () => fields.array(
  fields.relationship({ label: "알고리즘 주제", collection: "algorithms" }),
  { label: "알고리즘 주제", description: "알고리즘 관리에서 만든 주제를 여러 개 연결할 수 있습니다.", itemLabel: (props) => props.value || "주제 선택" },
);

const customCollections = Object.fromEntries(customSections.map((section) => {
  const imageDirectory = `public/images/content/${section.key}`;
  const imagePublicPath = `/images/content/${section.key}/`;
  return [section.collectionKey, collection({
    label: section.label,
    slugField: "title",
    path: `content/custom/${section.key}/*`,
    entryLayout: "content",
    previewUrl: `/content/${section.key}/{slug}`,
    columns: ["title", "category", "date", "featured", "draft"],
    format: { contentField: "body" },
    schema: {
      title: fields.slug({ name: { label: "제목", validation: { isRequired: true } }, slug: { label: "URL slug", description: "영문 소문자와 하이픈을 권장합니다." } }),
      description: fields.text({ label: "요약", multiline: true, description: "목록과 공유 카드에 표시됩니다.", ...required }),
      category: fields.relationship({ label: "카테고리", collection: "categories", description: "분류 관리에서 만든 카테고리를 선택하세요." }),
      algorithmTopics: algorithmTopicsField(),
      tags: fields.array(fields.text({ label: "태그" }), { label: "태그", itemLabel: (props) => props.value }),
      date: fields.date({ label: "작성일", defaultValue: today, ...required }),
      updated: fields.date({ label: "수정일", defaultValue: today, ...required }),
      author: fields.text({ label: "작성자", defaultValue: "asterunee", ...required }),
      coverImage: fields.image({ label: "표지 이미지", directory: imageDirectory, publicPath: imagePublicPath }),
      coverAlt: fields.text({ label: "표지 이미지 설명" }),
      showToc: fields.checkbox({ label: "목차 표시", defaultValue: true }),
      featured: fields.checkbox({ label: "대표 콘텐츠", defaultValue: false }),
      draft: fields.checkbox({ label: "초안", description: "해제한 콘텐츠만 운영 사이트에 공개됩니다.", defaultValue: true }),
      body: bodyField(imageDirectory, imagePublicPath, `${section.label} 콘텐츠를 작성합니다. 모든 서식과 콘텐츠 블록을 사용할 수 있습니다.`),
    },
  })];
}));

export default config({
  storage: keystaticGithubMode ? githubStorage : localStorage,
  ui: {
    brand: { name: "asterunee studio" },
    navigation: ({
      [editorMenu.groupLabel?.trim() || "콘텐츠 작성"]: ["editor", ...visibleEditorCollections],
      "분류 관리": ["categories", "contentTypes", "algorithms"],
      "블로그 관리": ["site"],
    } as never),
  },
  collections: {
    categories: collection({
      label: "카테고리",
      slugField: "name",
      path: "content/categories/*",
      entryLayout: "form",
      format: "json",
      columns: ["name", "order", "visible"],
      schema: {
        name: fields.slug({ name: { label: "카테고리 이름", validation: { isRequired: true } }, slug: { label: "카테고리 URL", description: "영문 소문자와 하이픈을 권장합니다." } }),
        description: fields.text({ label: "카테고리 설명", multiline: true, description: "카테고리 페이지와 목록에 표시됩니다." }),
        appliesTo: fields.multiselect({
          label: "사용할 콘텐츠",
          description: "이 카테고리를 주로 사용할 콘텐츠를 모두 표시하세요. 실제 작성기에서는 세 종류 모두 선택할 수 있습니다.",
          options: [
            { label: editorLabels.posts, value: "posts" },
            { label: editorLabels.solutions, value: "solutions" },
            { label: editorLabels.logs, value: "logs" },
            ...customSections.map((section) => ({ label: section.label, value: `custom:${section.key}` })),
          ],
          defaultValue: ["posts", "solutions", "logs"],
        }),
        order: fields.integer({ label: "정렬 순서", defaultValue: 0, validation: { isRequired: true, min: 0 } }),
        visible: fields.checkbox({ label: "목록에 표시", defaultValue: true }),
      },
    }),
    contentTypes: collection({
      label: "글 형식",
      slugField: "name",
      path: "content/content-types/*",
      entryLayout: "form",
      format: "json",
      columns: ["name", "order", "visible"],
      schema: {
        name: fields.slug({ name: { label: "형식 이름", validation: { isRequired: true } }, slug: { label: "형식 URL", description: "예: review, essay, dev-note" } }),
        description: fields.text({ label: "형식 설명", multiline: true, description: "기술 글, 리뷰, 회고, 에세이처럼 원하는 형식을 자유롭게 만드세요." }),
        order: fields.integer({ label: "정렬 순서", defaultValue: 0, validation: { isRequired: true, min: 0 } }),
        visible: fields.checkbox({ label: "목록에 표시", defaultValue: true }),
      },
    }),
    algorithms: collection({
      label: "알고리즘 주제",
      slugField: "name",
      path: "content/algorithms/*",
      entryLayout: "form",
      format: "json",
      columns: ["name", "order", "visible"],
      schema: {
        name: fields.slug({ name: { label: "주제 이름", validation: { isRequired: true } }, slug: { label: "주제 URL", description: "예: graph, dynamic-programming" } }),
        description: fields.text({ label: "주제 설명", multiline: true, description: "알고리즘 목록과 주제 상세 화면에 표시됩니다." }),
        order: fields.integer({ label: "정렬 순서", defaultValue: 0, validation: { isRequired: true, min: 0 } }),
        visible: fields.checkbox({ label: "알고리즘 목록에 표시", defaultValue: true }),
      },
    }),
    posts: collection({
      label: editorLabels.posts,
      slugField: "title",
      path: "content/posts/*",
      entryLayout: "content",
      previewUrl: "/posts/{slug}",
      columns: ["title", "contentType", "category", "date", "pinned", "draft"],
      format: { contentField: "body" },
      schema: {
        title: fields.slug({ name: { label: "글 제목", validation: { isRequired: true } }, slug: { label: "URL slug", description: "영문 소문자와 하이픈을 권장합니다." } }),
        description: fields.text({ label: "글 요약", multiline: true, description: "목록과 공유 카드에 표시됩니다.", ...required }),
        contentType: fields.relationship({ label: "글 형식", collection: "contentTypes", description: "분류 관리에서 형식을 자유롭게 만들 수 있습니다." }),
        category: fields.relationship({ label: "카테고리", collection: "categories", description: "분류 관리에서 카테고리를 먼저 만들 수 있습니다." }),
        algorithmTopics: algorithmTopicsField(),
        series: fields.text({ label: "시리즈", description: "연재가 아니라면 비워 두세요." }),
        tags: fields.array(fields.text({ label: "태그" }), { label: "태그", itemLabel: (props) => props.value }),
        date: fields.date({ label: "작성일", defaultValue: today, ...required }),
        updated: fields.date({ label: "수정일", defaultValue: today, ...required }),
        author: fields.text({ label: "작성자", defaultValue: "asterunee", ...required }),
        coverImage: fields.image({ label: "표지 이미지", description: "목록과 글 상단에 사용됩니다.", directory: "public/images/posts", publicPath: "/images/posts/" }),
        coverAlt: fields.text({ label: "표지 이미지 설명", description: "이미지가 있을 때 작성하세요." }),
        accentColor: fields.text({ label: "글 강조 색", description: "비우면 사이트 기본 색을 사용합니다. 예: #7dd3fc", validation: { pattern: { regex: /^$|^#[0-9a-fA-F]{6}$/, message: "#RRGGBB 형식으로 입력하세요." } } }),
        seoTitle: fields.text({ label: "검색용 제목", description: "비우면 글 제목을 사용합니다." }),
        seoDescription: fields.text({ label: "검색용 설명", multiline: true, description: "비우면 글 요약을 사용합니다." }),
        canonicalUrl: fields.text({ label: "원문 URL", description: "다른 곳에서 먼저 발행한 글만 입력하세요." }),
        showToc: fields.checkbox({ label: "목차 표시", defaultValue: true }),
        featured: fields.checkbox({ label: "대표 글", defaultValue: false }),
        pinned: fields.checkbox({ label: "목록 상단 고정", defaultValue: false }),
        draft: fields.checkbox({ label: "초안", description: "해제한 글만 운영 사이트에 공개됩니다.", defaultValue: true }),
        body: bodyField("public/images/posts", "/images/posts/", "기본 서식과 이미지뿐 아니라 콜아웃, 갤러리, 영상, 링크 카드 등 삽입 메뉴의 콘텐츠 블록을 사용할 수 있습니다."),
      },
    }),
    solutions: collection({
      label: editorLabels.solutions,
      slugField: "title",
      path: "content/solutions/*",
      entryLayout: "content",
      previewUrl: "/solutions/{slug}",
      columns: ["title", "category", "judge", "problemId", "date", "draft"],
      format: { contentField: "body" },
      schema: {
        title: fields.slug({ name: { label: "풀이 제목", validation: { isRequired: true } }, slug: { label: "URL slug", description: "영문 소문자와 하이픈을 권장합니다." } }),
        description: fields.text({ label: "풀이 요약", multiline: true, ...required }),
        category: fields.relationship({ label: "카테고리", collection: "categories", description: "대회, 알고리즘 학습 등 원하는 공용 카테고리를 선택하세요." }),
        algorithmTopics: algorithmTopicsField(),
        date: fields.date({ label: "작성일", defaultValue: today, ...required }),
        updated: fields.date({ label: "수정일", defaultValue: today, ...required }),
        author: fields.text({ label: "작성자", defaultValue: "asterunee", ...required }),
        judge: fields.text({ label: "온라인 저지", defaultValue: "Codeforces", ...required }),
        contest: fields.text({ label: "대회/라운드" }),
        problemId: fields.text({ label: "문제 번호", ...required }),
        problemUrl: fields.url({ label: "문제 원문 URL", ...required }),
        difficulty: fields.integer({ label: "레이팅/예상 난이도", defaultValue: 0, validation: { isRequired: true, min: 0, max: 10000 } }),
        tier: fields.text({ label: "티어 표기", defaultValue: "Unrated", ...required }),
        solutionType: fields.text({ label: "풀이 유형", description: "예: 정규 풀이, 업솔빙, 다른 풀이" }),
        status: fields.text({ label: "상태", defaultValue: "Solved", ...required }),
        language: fields.text({ label: "언어", defaultValue: "C++17", ...required }),
        tags: fields.array(fields.text({ label: "태그" }), { label: "알고리즘 태그", itemLabel: (props) => props.value }),
        solveTime: fields.integer({ label: "풀이 시간(분)", defaultValue: 1, validation: { isRequired: true, min: 1 } }),
        timeLimit: fields.text({ label: "시간 제한", defaultValue: "2 seconds", ...required }),
        memoryLimit: fields.text({ label: "메모리 제한", defaultValue: "256 MB", ...required }),
        runtime: fields.text({ label: "실행 시간" }),
        memoryUsed: fields.text({ label: "사용 메모리" }),
        coverImage: fields.image({ label: "대표 이미지", directory: "public/images/solutions", publicPath: "/images/solutions/" }),
        coverAlt: fields.text({ label: "대표 이미지 설명" }),
        featured: fields.checkbox({ label: "대표 풀이", defaultValue: false }),
        draft: fields.checkbox({ label: "초안", description: "해제한 풀이만 운영 사이트에 공개됩니다.", defaultValue: true }),
        body: bodyField("public/images/solutions", "/images/solutions/", "접근 과정, 증명, 복잡도와 구현을 기록하고 콜아웃, 영상, 갤러리 같은 콘텐츠 블록을 활용하세요."),
      },
    }),
    logs: collection({
      label: editorLabels.logs,
      slugField: "title",
      path: "content/log/*",
      entryLayout: "content",
      previewUrl: "/log/{slug}",
      columns: ["title", "category", "type", "date", "featured", "draft"],
      format: { contentField: "body" },
      schema: {
        title: fields.slug({ name: { label: "기록 제목", validation: { isRequired: true } }, slug: { label: "URL slug" } }),
        description: fields.text({ label: "기록 요약", multiline: true, ...required }),
        category: fields.relationship({ label: "카테고리", collection: "categories", description: "일상, 배움, 프로젝트 등 원하는 공용 카테고리를 선택하세요." }),
        algorithmTopics: algorithmTopicsField(),
        type: fields.text({ label: "기록 종류", description: "원하는 분류를 직접 입력하세요.", defaultValue: "메모", ...required }),
        mood: fields.text({ label: "기분/상태" }),
        location: fields.text({ label: "장소" }),
        tags: fields.array(fields.text({ label: "태그" }), { label: "태그", itemLabel: (props) => props.value }),
        date: fields.date({ label: "작성일", defaultValue: today, ...required }),
        updated: fields.date({ label: "수정일", defaultValue: today, ...required }),
        author: fields.text({ label: "작성자", defaultValue: "asterunee", ...required }),
        coverImage: fields.image({ label: "기록 이미지", directory: "public/images/log", publicPath: "/images/log/" }),
        coverAlt: fields.text({ label: "이미지 설명" }),
        featured: fields.checkbox({ label: "대표 기록", defaultValue: false }),
        draft: fields.checkbox({ label: "초안", defaultValue: true }),
        body: bodyField("public/images/log", "/images/log/", "짧은 메모부터 긴 회고까지 쓰고 이미지, 링크 카드, 인용, 영상 같은 콘텐츠 블록을 활용하세요."),
      },
    }),
    ...customCollections,
  },
  singletons: {
    site: singleton({
      label: "사이트 설정",
      path: "content/settings/site",
      entryLayout: "form",
      format: "json",
      previewUrl: "/",
      schema: {
        siteName: fields.text({ label: "블로그 이름", ...required }),
        tagline: fields.text({ label: "메인 제목", ...required }),
        description: fields.text({ label: "사이트 설명", multiline: true, ...required }),
        intro: fields.text({ label: "홈 소개 문장", multiline: true, ...required }),
        sidebarIntro: fields.text({ label: "사이드바 소개", multiline: true, ...required }),
        motto: fields.text({ label: "짧은 문구", ...required }),
        supportingLine: fields.text({ label: "보조 문구", ...required }),
        role: fields.text({ label: "소개 역할", ...required }),
        profileImage: fields.image({ label: "프로필 이미지", description: "사이드바, 소개 화면과 글 작성자 영역에 표시됩니다.", directory: "public/images", publicPath: "/images/" }),
        nowTitle: fields.text({ label: "현재 관심사 제목", description: "비우면 홈의 현재 관심사 위젯을 숨깁니다." }),
        nowDescription: fields.text({ label: "현재 관심사 설명", multiline: true }),
        backgroundImage: fields.image({ label: "사이트 배경 이미지", description: "기존 이미지 또는 새 이미지를 업로드할 수 있습니다.", directory: "public/images", publicPath: "/images/" }),
        backgroundPosition: fields.select({ label: "배경 위치", options: [{ label: "가운데", value: "center" }, { label: "왼쪽", value: "left" }, { label: "오른쪽", value: "right" }, { label: "위", value: "top" }, { label: "아래", value: "bottom" }], defaultValue: "center" }),
        backgroundStrength: fields.integer({ label: "배경 이미지 강도(%)", defaultValue: 16, validation: { isRequired: true, min: 0, max: 60 } }),
        backgroundPattern: fields.select({ label: "배경 효과", options: [{ label: "별빛", value: "stars" }, { label: "오로라", value: "aurora" }, { label: "잔잔함", value: "quiet" }, { label: "효과 없음", value: "none" }], defaultValue: "stars" }),
        accentColor: fields.text({ label: "사이트 강조 색", description: "#RRGGBB 형식", defaultValue: "#5ee7f7", validation: { isRequired: true, pattern: { regex: /^#[0-9a-fA-F]{6}$/, message: "#RRGGBB 형식으로 입력하세요." } } }),
        defaultTheme: fields.select({ label: "기본 테마", options: [{ label: "다크", value: "dark" }, { label: "오로라", value: "aurora" }, { label: "포레스트", value: "forest" }, { label: "선셋", value: "sunset" }, { label: "페이퍼", value: "paper" }, { label: "라이트", value: "light" }], defaultValue: "dark" }),
        showJudgeSignals: fields.checkbox({ label: "홈에 PS 활동 표시", defaultValue: true }),
        navigation: fields.array(fields.object({
          label: fields.text({ label: "메뉴 이름", ...required }),
          labelEn: fields.text({ label: "영문 이름", ...required }),
          href: fields.text({ label: "이동 경로", description: "예: /posts", ...required }),
          visible: fields.checkbox({ label: "메뉴에 표시", defaultValue: true }),
        }), { label: "사이드바 메뉴", description: "끌어서 순서를 바꾸고 표시 여부를 설정할 수 있습니다.", itemLabel: (props) => props.fields.label.value || "새 메뉴" }),
      },
    }),
    editor: singleton({
      label: "작성 항목 관리",
      path: "content/settings/editor",
      entryLayout: "form",
      format: "json",
      schema: {
        groupLabel: fields.text({ label: "작성 메뉴 그룹 이름", defaultValue: "콘텐츠 작성", ...required }),
        sections: fields.array(fields.object({
          key: fields.text({ label: "항목 키", description: "기본 항목은 posts(글), solutions(PS 풀이), logs(짧은 기록)입니다. 다른 영문 키를 입력하면 새 형식이 만들어집니다.", validation: { isRequired: true, pattern: { regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, message: "영문 소문자, 숫자와 하이픈만 사용할 수 있습니다." } } }),
          label: fields.text({ label: "작성 카드 이름", description: "예: 리뷰, 프로젝트, 에세이", ...required }),
          description: fields.text({ label: "공개 목록 설명", multiline: true }),
          order: fields.integer({ label: "정렬 순서", defaultValue: 0, validation: { isRequired: true, min: 0 } }),
          visible: fields.checkbox({ label: "작성기에 표시하고 공개", defaultValue: true }),
          showInNavigation: fields.checkbox({ label: "사이드바 메뉴에도 표시", defaultValue: false }),
          showOnHome: fields.checkbox({ label: "홈에도 최신 콘텐츠 표시", defaultValue: false }),
        }), { label: "작성 하위 항목", description: "여기서 항목을 추가·삭제·정렬하세요. 저장하고 자동 배포가 끝나면 콘텐츠 작성 카드에 그대로 반영됩니다. 삭제해도 기존 글 파일은 안전하게 보존됩니다.", itemLabel: (props) => props.fields.label.value || "새 작성 항목" }),
      },
    }),
  },
});
