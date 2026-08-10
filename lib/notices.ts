import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const optionalDate = z.preprocess((value) => value || null, z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable());

const noticeSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  label: z.string().default("공지사항"),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startsAt: optionalDate.default(null),
  endsAt: optionalDate.default(null),
  href: z.string().default(""),
  linkLabel: z.string().default("자세히 보기"),
  newTab: z.boolean().default(false),
  backgroundImage: z.string().nullable().default(null),
  backgroundPosition: z.enum(["center", "left", "right", "top", "bottom"]).default("center"),
  priority: z.number().int().min(0).max(100).default(0),
  visible: z.boolean().default(true),
});

export type Notice = z.infer<typeof noticeSchema> & { slug: string };

function todayInSeoul() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export function getNotices(): Notice[] {
  const directory = path.join(process.cwd(), "content/notices");
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).filter((file) => file.endsWith(".json")).map((file) => {
    const parsed = noticeSchema.safeParse(JSON.parse(fs.readFileSync(path.join(directory, file), "utf8")));
    if (!parsed.success) throw new Error(`Invalid notice in ${file}: ${parsed.error.message}`);
    return { ...parsed.data, slug: file.replace(/\.json$/, "") };
  }).sort((a, b) => b.priority - a.priority || b.publishedAt.localeCompare(a.publishedAt));
}

export function getActiveNotices(today = todayInSeoul()) {
  return getNotices().filter((notice) => notice.visible && (notice.startsAt || notice.publishedAt) <= today && (!notice.endsAt || notice.endsAt >= today));
}
