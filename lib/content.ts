import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";

const solutionSchema = z.object({
  title: z.string().min(1), slug: z.string().min(1), description: z.string().min(1),
  date: z.string(), updated: z.string(), author: z.literal("asterunee"),
  judge: z.string(), problemId: z.string(), problemUrl: z.string().url(),
  difficulty: z.number().int().nonnegative(), tier: z.string(), tags: z.array(z.string()).min(1),
  language: z.literal("cpp"), solveTime: z.number().positive(), featured: z.boolean(), draft: z.boolean(),
  status: z.string().default("Solved"), timeLimit: z.string().default("2 seconds"), memoryLimit: z.string().default("256 MB"),
});

export type Solution = z.infer<typeof solutionSchema> & { body: string; readingMinutes: number };

export function getSolutions(includeDrafts = process.env.NODE_ENV !== "production"): Solution[] {
  const dir = path.join(process.cwd(), "content/solutions");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => file.endsWith(".mdx")).map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);
    const parsed = solutionSchema.safeParse(data);
    if (!parsed.success) throw new Error(`Invalid frontmatter in ${file}: ${parsed.error.message}`);
    return { ...parsed.data, body: content, readingMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)) };
  }).filter((post) => includeDrafts || !post.draft).sort((a, b) => b.date.localeCompare(a.date));
}

export function getSolution(slug: string) { return getSolutions().find((post) => post.slug === slug); }

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
