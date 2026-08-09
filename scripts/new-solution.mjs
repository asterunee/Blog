import fs from "node:fs";
import path from "node:path";

const [slug, ...titleParts] = process.argv.slice(2); const title = titleParts.join(" ");
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !title) {
  console.error("사용법: npm run new:solution -- problem-slug \"문제 제목\""); process.exit(1);
}
const file = path.join(process.cwd(), "content/solutions", `${slug}.mdx`);
if (fs.existsSync(file)) { console.error(`이미 존재합니다: ${file}`); process.exit(1); }
const today = new Date().toISOString().slice(0,10);
const template = `---
title: "${title.replaceAll('"', '\\"')}"
slug: "${slug}"
description: "풀이 요약을 작성하세요"
date: "${today}"
updated: "${today}"
author: "asterunee"
judge: "Codeforces"
problemId: "0000A"
problemUrl: "https://codeforces.com/"
difficulty: 0
tier: "Unrated"
tags: ["algorithm"]
language: "cpp"
solveTime: 1
featured: false
draft: true
status: "Solved"
timeLimit: "2 seconds"
memoryLimit: "256 MB"
---

> 초안입니다. 실제 문제 정보와 풀이를 확인한 뒤 \`draft: false\`로 바꾸세요.

## 처음의 관찰

## 풀이를 도출한 과정

## 핵심 아이디어

## 정당성 증명

## 시간·공간 복잡도

## 구현 과정

\`\`\`cpp
// file: main.cpp; highlight:
#include "library/template.hpp"

using namespace std;
using namespace suisen;

int main() {
    return 0;
}
\`\`\`

## 틀렸던 접근과 반례

## 디버깅 기록
`;
fs.writeFileSync(file, template, { flag: "wx" });
console.log(`새 풀이 초안을 만들었습니다: ${file}`);
