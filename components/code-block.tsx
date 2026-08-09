import { codeToHtml } from "shiki";
import { CopyButton } from "./copy-button";

export async function CodeBlock({ code, filename = "main.cpp", language = "cpp", highlights = "" }: { code: string; filename?: string; language?: string; highlights?: string }) {
  const highlighted = new Set(highlights.split(",").map(Number));
  let index = 0;
  let html = await codeToHtml(code.trim(), { lang: language, themes: { dark: "github-dark-default", light: "github-light-default" }, defaultColor: false });
  html = html.replace(/<span class="line">/g, () => `<span class="line${highlighted.has(++index) ? " highlighted" : ""}">`);
  const isLong = code.split("\n").length > 24;
  return <figure className="code-figure"><figcaption><span>{filename}</span><span>C++17</span><CopyButton value={code} /></figcaption>
    {isLong ? <details><summary>전체 코드 펼치기 · {code.split("\n").length} lines</summary><div dangerouslySetInnerHTML={{ __html: html }} /></details> : <div dangerouslySetInnerHTML={{ __html: html }} />}
  </figure>;
}
