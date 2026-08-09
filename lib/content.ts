import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";

const contentDate = z.preprocess(
  (value) => value instanceof Date ? value.toISOString().slice(0, 10) : value,
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 형식의 날짜가 필요합니다."),
);

const solutionSchema = z.object({
  title: z.string().min(1), slug: z.string().min(1), description: z.string().min(1),
  date: contentDate, updated: contentDate, author: z.string().min(1),
  judge: z.string(), problemId: z.string(), problemUrl: z.string().url(),
  difficulty: z.number().int().nonnegative(), tier: z.string(), tags: z.array(z.string()).min(1),
  language: z.string().default("C++17"), solveTime: z.number().positive(), featured: z.boolean(), draft: z.boolean(),
  status: z.string().default("Solved"), timeLimit: z.string().default("2 seconds"), memoryLimit: z.string().default("256 MB"),
  contest: z.string().default(""), solutionType: z.string().default(""), runtime: z.string().default(""), memoryUsed: z.string().default(""),
  coverImage: z.string().nullable().default(null), coverAlt: z.string().default(""),
});

export type Solution = z.infer<typeof solutionSchema> & { body: string; readingMinutes: number };

const postSchema = z.object({
  title: z.string().min(1), slug: z.string().min(1), description: z.string().min(1),
  date: contentDate, updated: contentDate, author: z.string().min(1),
  category: z.string(), tags: z.array(z.string()).default([]), series: z.string().default(""),
  coverImage: z.string().nullable().default(null), coverAlt: z.string().default(""), accentColor: z.string().default(""),
  seoTitle: z.string().default(""), seoDescription: z.string().default(""), canonicalUrl: z.string().default(""),
  showToc: z.boolean().default(true), featured: z.boolean().default(false), pinned: z.boolean().default(false), draft: z.boolean(),
});

export type BlogPost = z.infer<typeof postSchema> & { body: string; readingMinutes: number };

const logSchema = z.object({
  title: z.string().min(1), slug: z.string().min(1), description: z.string().min(1),
  date: contentDate, updated: contentDate, author: z.string().min(1),
  type: z.string(), tags: z.array(z.string()).default([]), mood: z.string().default(""), location: z.string().default(""),
  coverImage: z.string().nullable().default(null), coverAlt: z.string().default(""), featured: z.boolean().default(false), draft: z.boolean(),
});

export type LogPost = z.infer<typeof logSchema> & { body: string; readingMinutes: number };

export function getSolutions(includeDrafts = process.env.NODE_ENV !== "production"): Solution[] {
  const dir = path.join(process.cwd(), "content/solutions");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => file.endsWith(".mdx")).map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);
    const parsed = solutionSchema.safeParse({ ...data, slug: data.slug || file.replace(/\.mdx$/, "") });
    if (!parsed.success) throw new Error(`Invalid frontmatter in ${file}: ${parsed.error.message}`);
    return { ...parsed.data, body: content, readingMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)) };
  }).filter((post) => includeDrafts || !post.draft).sort((a, b) => b.date.localeCompare(a.date));
}

export function getSolution(slug: string) { return getSolutions().find((post) => post.slug === slug); }

export function getPosts(includeDrafts = process.env.NODE_ENV !== "production"): BlogPost[] {
  const dir = path.join(process.cwd(), "content/posts");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => file.endsWith(".mdx")).map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);
    const parsed = postSchema.safeParse({ ...data, slug: data.slug || file.replace(/\.mdx$/, "") });
    if (!parsed.success) throw new Error(`Invalid frontmatter in ${file}: ${parsed.error.message}`);
    return { ...parsed.data, body: content, readingMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)) };
  }).filter((post) => includeDrafts || !post.draft).sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.date.localeCompare(a.date));
}

export function getPost(slug: string) { return getPosts().find((post) => post.slug === slug); }

export function getLogs(includeDrafts = process.env.NODE_ENV !== "production"): LogPost[] {
  const dir = path.join(process.cwd(), "content/log");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => file.endsWith(".mdx")).map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);
    const parsed = logSchema.safeParse({ ...data, slug: data.slug || file.replace(/\.mdx$/, "") });
    if (!parsed.success) throw new Error(`Invalid frontmatter in ${file}: ${parsed.error.message}`);
    return { ...parsed.data, body: content, readingMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)) };
  }).filter((post) => includeDrafts || !post.draft).sort((a, b) => b.date.localeCompare(a.date));
}

export function getLog(slug: string) { return getLogs().find((post) => post.slug === slug); }

export function extractHeadings(source: string) {
  return [...source.matchAll(/^##\s+(.+)$/gm)].map((match) => ({
    title: match[1], id: match[1].toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s+/g, "-"),
  }));
}

export function searchSolutions(posts: Solution[], query: string) {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return posts;
  return posts.filter((post) => [post.title, post.description, post.problemId, post.judge, ...post.tags, post.body].join(" ").toLocaleLowerCase().includes(needle));
}
