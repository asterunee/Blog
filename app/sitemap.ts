import type { MetadataRoute } from "next";
import { getPosts, getSolutions } from "@/lib/content";
import { getAllContentEntries } from "@/lib/content-index";
import { customContentSections } from "@/lib/editor-settings";
import { siteConfig } from "@/lib/site";
import { getManagedAlgorithms, getManagedCategories } from "@/lib/taxonomy";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getPosts(false);
  const solutions = getSolutions(false);
  const allEntries = getAllContentEntries(false);

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
    ...customContentSections.filter((section) => section.visible).map((section) => `/content/${section.key}`),
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const entries = allEntries.map((post) => ({ url: `${siteConfig.url}${post.href}`, lastModified: new Date(post.updated), changeFrequency: "monthly" as const, priority: 0.8 }));

  const tags = [
    ...new Set([
      ...allEntries.flatMap((post) => post.tags),
    ]),
  ].map((tag) => ({
    url: `${siteConfig.url}/tags/${encodeURIComponent(tag)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const categories = [...new Set([...allEntries.map((post) => post.category), ...getManagedCategories().filter((category) => category.visible).map((category) => category.slug)])].map((category) => ({
    url: `${siteConfig.url}/categories/${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const contentTypes = [...new Set(articles.map((post) => post.contentType))].map((type) => ({
    url: `${siteConfig.url}/types/${encodeURIComponent(type)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const judges = [...new Set(solutions.map((post) => post.judge))].map((judge) => ({
    url: `${siteConfig.url}/judge/${encodeURIComponent(judge)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const algorithms = getManagedAlgorithms().filter((algorithm) => algorithm.visible).map((algorithm) => ({
    url: `${siteConfig.url}/algorithms/${algorithm.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...pages, ...entries, ...categories, ...contentTypes, ...tags, ...judges, ...algorithms];
}
