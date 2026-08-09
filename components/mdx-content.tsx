import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { CodeBlock } from "./code-block";
import { isValidElement, type ReactElement, type ReactNode } from "react";

async function MdxPre({ children }: { children?: ReactNode }) {
  if (!isValidElement(children)) return <pre>{children}</pre>;
  const element = children as ReactElement<{ children?: ReactNode; className?: string }>;
  const raw = String(element.props.children || "").replace(/\n$/, "");
  const firstLine = raw.split("\n")[0];
  const meta = firstLine.match(/^\/\/ file: ([^;]+); highlight:\s*(.*)$/);
  const code = meta ? raw.split("\n").slice(1).join("\n") : raw;
  const language = element.props.className?.replace("language-", "") || "text";
  return <CodeBlock code={code} filename={meta?.[1] || "main.cpp"} language={language} highlights={meta?.[2] || ""} />;
}

export function MdxContent({ source }: { source: string }) {
  return <MDXRemote source={source} components={{ pre: MdxPre }} options={{ mdxOptions: { remarkPlugins: [remarkGfm, remarkMath], rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }], rehypeKatex] } }} />;
}
