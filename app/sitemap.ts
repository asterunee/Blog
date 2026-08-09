import type { MetadataRoute } from "next";
import { getLogs, getPosts, getSolutions } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getPosts(false);
  const solutions = getSolutions(false);
  const logs = getLogs(false);

  const pages = [
    "",
    "/posts",
    "/categories",
    "/solutions",
    "/algorithms",
    "/tags",
    "/archive",
    "/library",
    "/log",
    "/about",
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const entries = [
    ...articles.map((post) => ({
      url: `${siteConfig.url}/posts/${post.slug}`,
      lastModified: new Date(post.updated),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...solutions.map((post) => ({
      url: `${siteConfig.url}/solutions/${post.slug}`,
      lastModified: new Date(post.updated),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...logs.map((post) => ({
      url: `${siteConfig.url}/log/${post.slug}`,
      lastModified: new Date(post.updated),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  const tags = [
    ...new Set([
      ...articles.flatMap((post) => post.tags),
      ...solutions.flatMap((post) => post.tags),
      ...logs.flatMap((post) => post.tags),
    ]),
  ].map((tag) => ({
    url: `${siteConfig.url}/tags/${encodeURIComponent(tag)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const categories = [...new Set(articles.map((post) => post.category))].map((category) => ({
    url: `${siteConfig.url}/categories/${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const judges = [...new Set(solutions.map((post) => post.judge))].map((judge) => ({
    url: `${siteConfig.url}/judge/${encodeURIComponent(judge)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...pages, ...entries, ...categories, ...tags, ...judges];
}
