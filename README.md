# asterunee

별과 달 사이의 알고리즘 기록. 경쟁 프로그래밍의 정답뿐 아니라 관찰, 증명, 반례, 구현과 디버깅의 궤적을 남기는 개인 PS 관측소입니다.

## 시작하기

Node.js 22와 npm을 권장합니다.

```bash
npm install
cp .env.example .env.local
npm run dev
```

`http://localhost:3000`에서 확인합니다. 전체 품질 검사는 `npm run validate`, production 실행은 `npm run build && npm start`입니다.

## 새 풀이 글 작성과 게시

### 웹 편집기

개발 서버 또는 배포 사이트의 `/keystatic`에서 PS 풀이와 관측 일지를 직접 작성할 수 있습니다. 로컬 개발에서는 저장 버튼이 `content/solutions`와 `content/log`의 MDX 파일을 바로 수정합니다.

production에서는 GitHub 모드를 사용합니다. GitHub 저장소를 만든 뒤 `/keystatic`의 안내에 따라 GitHub App을 생성하고 다음 값을 Vercel 환경변수에 등록하세요.

```env
KEYSTATIC_GITHUB_CLIENT_ID=
KEYSTATIC_GITHUB_CLIENT_SECRET=
KEYSTATIC_SECRET=
NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=
NEXT_PUBLIC_KEYSTATIC_STORAGE=github
```

GitHub 저장소의 write 권한이 있는 사용자만 로그인하고 글을 저장할 수 있습니다. 저장된 글은 Git 커밋으로 남으며 `draft`를 해제하면 RSS와 sitemap에도 포함됩니다.

### 명령줄

```bash
npm run new:solution -- problem-slug "문제 제목"
```

`content/solutions/problem-slug.mdx` 초안이 생깁니다. frontmatter와 모든 본문 절을 채우고 검토가 끝나면 `draft: false`로 바꾸세요. production build에서 초안은 풀이 목록, 정적 경로, RSS, sitemap에서 제외됩니다. 잘못된 frontmatter는 Zod 검증 단계에서 build를 실패시킵니다.

코드는 MDX 안에서 다음처럼 작성합니다.

```cpp
// file: main.cpp; highlight: 8,12
// C++17 code
```

Shiki 하이라이팅, 줄 번호, 강조 줄, 파일명, 복사, 긴 코드 접기와 모바일 가로 스크롤이 적용됩니다. 수식은 `$...$`, `$$...$$` KaTeX 문법을 사용합니다.

## 온라인 저지 연동

- Codeforces: 공식 `user.info`, `user.status` API를 서버에서 호출합니다. 프로필 rating/rank와 최근 98일 제출을 보여 줍니다.
- AtCoder: 공식 공개 API가 없어 비공식 오픈소스 [AtCoder Problems](https://github.com/kenkoooo/AtCoderProblems)의 submission count API를 사용합니다. UI와 API 응답에 출처를 명시했습니다.
- 모든 요청은 Next.js 서버에서 6시간 캐시되고, timeout·없는 사용자·빈 응답 시 정적 fallback으로 전환됩니다.
- CodeChef, Repovive, Yukicoder, CList는 안정적인 공개 API 계약을 가정하지 않고 프로필 링크 어댑터만 준비했습니다. API 제공 방식이 확정되면 `app/api/judges/route.ts`에 provider를 추가할 수 있습니다.

Codeforces는 공식 API 응답, AtCoder는 실제 프로필 응답으로 존재를 확인해 기본 링크를 연결했습니다. 나머지는 추측하지 않으며 `.env.local`에 확인한 URL만 넣으세요.

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.example
NEXT_PUBLIC_CODEFORCES_URL=https://확인한-프로필-주소
NEXT_PUBLIC_ATCODER_URL=https://확인한-프로필-주소
NEXT_PUBLIC_CODECHEF_URL=
NEXT_PUBLIC_REPOVIVE_URL=
NEXT_PUBLIC_YUKICODER_URL=
NEXT_PUBLIC_CLIST_URL=
NEXT_PUBLIC_GITHUB_URL=
```

핸들과 프로필 목록은 `lib/site.ts` 한 곳에서 관리합니다.

## 이미지 교체와 권리 확인

`public/images/observatory-hero.webp`와 `public/images/earth-orbit.webp`는 요청된 구도와 분위기를 바탕으로 이 프로젝트에서 새로 생성한 임시 비주얼입니다. 사용 권한이 불분명한 외부 이미지로 교체할 경우 공개 배포 전에 반드시 라이선스와 초상권을 확인하세요. 같은 파일명으로 교체하면 레이아웃을 유지할 수 있으며 16:9 비율, 좌측 텍스트 여백, 우측 피사체 구도를 권장합니다.

## 배포

Vercel에서 저장소를 Import하고 `NEXT_PUBLIC_SITE_URL` 및 확인된 프로필 URL을 환경변수로 등록한 뒤 배포합니다. `vercel.json`에는 Next.js framework와 보안 헤더가 준비되어 있습니다. GitHub Actions는 push와 pull request마다 lint, typecheck, test, build를 수행합니다.

Vercel CLI를 사용한다면:

```bash
npx vercel link
npx vercel env add NEXT_PUBLIC_SITE_URL production
npx vercel --prod
```

실제 production 배포는 Vercel 계정 인증과 대상 프로젝트 선택이 필요합니다. 배포 뒤 도메인으로 `NEXT_PUBLIC_SITE_URL`을 갱신해 canonical, Open Graph, RSS, sitemap URL을 정확히 맞추세요.

### GitHub 자동 배포

`.github/workflows/ci.yml`은 `main` push에서 품질 검사를 통과한 뒤 Vercel production을 배포합니다. GitHub 저장소의 Actions secrets에 `VERCEL_TOKEN`을 등록해야 합니다. Vercel 조직·프로젝트 ID는 workflow에 현재 `asterunee` 프로젝트 값으로 연결되어 있습니다.

## 구조

- `app`: App Router 페이지, metadata, API, RSS, sitemap
- `components`: 검색 palette, 필터, 테마·언어, 코드, 목차, 활동 그래프
- `content/solutions`: Git으로 관리하는 풀이 MDX
- `content/log`: 대회 후기와 공부 기록 MDX
- `lib/site.ts`: 브랜드, 탐색, 프로필, 라이브러리 중앙 설정
- `lib/content.ts`: frontmatter 검증, 읽기 시간, 검색, 목차 파서

브랜드명은 항상 소문자 `asterunee`로 표기합니다.
