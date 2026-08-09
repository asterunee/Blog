import { getLogs, getPosts, getSolutions } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export function GET() {
  const entries = [...getPosts(false).map((post) => ({ ...post, href: `/posts/${post.slug}` })), ...getSolutions(false).map((post) => ({ ...post, href: `/solutions/${post.slug}` })), ...getLogs(false).map((post) => ({ ...post, href: `/log/${post.slug}` }))].sort((a,b) => b.date.localeCompare(a.date));
  const items = entries.map((post) => `<item><title><![CDATA[${post.title}]]></title><link>${siteConfig.url}${post.href}</link><guid>${siteConfig.url}${post.href}</guid><pubDate>${new Date(post.date).toUTCString()}</pubDate><description><![CDATA[${post.description}]]></description></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>asterunee</title><link>${siteConfig.url}</link><description>${siteConfig.description}</description><language>ko</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, s-maxage=3600" } });
}
