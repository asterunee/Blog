import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import Image from "next/image";
import { ArrowDownToLine, ArrowUpRight, Play } from "lucide-react";
import { CodeBlock } from "./code-block";
import { isValidElement, type CSSProperties, type ReactElement, type ReactNode } from "react";

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

function safeHref(value?: string) {
  if (!value) return "#";
  if (value.startsWith("/")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : "#";
  } catch {
    return "#";
  }
}

function Callout({ variant = "info", title, children }: { variant?: "info" | "tip" | "warning" | "success"; title?: string; children?: ReactNode }) {
  return <aside className={`mdx-callout ${variant}`}><div className="mdx-callout-label">{title || ({ info: "알아두기", tip: "팁", warning: "주의", success: "완료" }[variant])}</div><div>{children}</div></aside>;
}

function Details({ title = "자세히 보기", open = false, children }: { title?: string; open?: boolean; children?: ReactNode }) {
  return <details className="mdx-details" open={open}><summary>{title}</summary><div>{children}</div></details>;
}

function PullQuote({ attribution, sourceUrl, children }: { attribution?: string; sourceUrl?: string; children?: ReactNode }) {
  return <figure className="mdx-pull-quote"><blockquote>{children}</blockquote>{attribution && <figcaption>{sourceUrl ? <a href={safeHref(sourceUrl)} target="_blank" rel="noreferrer">— {attribution} <ArrowUpRight size={12} /></a> : <>— {attribution}</>}</figcaption>}</figure>;
}

function ActionButton({ label, url, variant = "primary", newTab = false }: { label: string; url: string; variant?: "primary" | "outline" | "text"; newTab?: boolean }) {
  return <p className="mdx-action-wrap"><a className={`mdx-action ${variant}`} href={safeHref(url)} target={newTab ? "_blank" : undefined} rel={newTab ? "noreferrer" : undefined}>{label}<ArrowUpRight size={14} /></a></p>;
}

function LinkCard({ title, description, url, eyebrow = "RELATED" }: { title: string; description?: string; url: string; eyebrow?: string }) {
  return <a className="mdx-link-card" href={safeHref(url)} target="_blank" rel="noreferrer"><span>{eyebrow}</span><div><strong>{title}</strong>{description && <p>{description}</p>}</div><ArrowUpRight size={18} /></a>;
}

function YouTube({ videoId, title = "YouTube 영상", caption }: { videoId: string; title?: string; caption?: string }) {
  const safeId = videoId.trim().match(/^[\w-]{6,20}$/)?.[0];
  if (!safeId) return <p className="mdx-embed-error">올바른 YouTube 영상 ID를 입력해 주세요.</p>;
  return <figure className="mdx-video"><div><iframe src={`https://www.youtube-nocookie.com/embed/${safeId}`} title={title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>{caption && <figcaption><Play size={12} /> {caption}</figcaption>}</figure>;
}

function Figure({ image, alt, caption, credit }: { image?: string | null; alt: string; caption?: string; credit?: string }) {
  if (!image) return null;
  return <figure className="mdx-figure"><div><Image src={image} alt={alt} fill sizes="(max-width: 800px) 100vw, 760px" /></div>{(caption || credit) && <figcaption><span>{caption}</span>{credit && <small>{credit}</small>}</figcaption>}</figure>;
}

function FileDownload({ label, url, detail }: { label: string; url: string; detail?: string }) {
  return <a className="mdx-download" href={safeHref(url)} target="_blank" rel="noreferrer"><ArrowDownToLine size={20} /><span><strong>{label}</strong>{detail && <small>{detail}</small>}</span><ArrowUpRight size={14} /></a>;
}

function Badge({ label, tone = "accent" }: { label: string; tone?: "accent" | "info" | "success" | "warning" }) {
  return <span className={`mdx-badge ${tone}`}>{label}</span>;
}

function Gallery({ columns = 2, children }: { columns?: number; children?: ReactNode }) {
  const safeColumns = Math.max(2, Math.min(3, columns));
  return <div className="mdx-gallery" style={{ "--gallery-columns": safeColumns } as CSSProperties}>{children}</div>;
}

function GalleryImage({ image, alt, caption }: { image?: string | null; alt: string; caption?: string }) {
  if (!image) return null;
  return <figure className="mdx-gallery-image"><div><Image src={image} alt={alt} fill sizes="(max-width: 600px) 100vw, 380px" /></div>{caption && <figcaption>{caption}</figcaption>}</figure>;
}

export function MdxContent({ source }: { source: string }) {
  return <MDXRemote source={source} components={{ pre: MdxPre, Callout, Details, PullQuote, ActionButton, LinkCard, YouTube, Figure, FileDownload, Badge, Gallery, GalleryImage }} options={{ mdxOptions: { remarkPlugins: [remarkGfm, remarkMath], rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }], rehypeKatex] } }} />;
}
