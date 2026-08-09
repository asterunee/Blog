import { getCustomPosts, getLogs, getPosts, getSolutions } from "@/lib/content";
import { getContentTypeName } from "@/lib/taxonomy";

export type ContentIndexEntry = {
  title: string;
  description: string;
  date: string;
  updated: string;
  href: string;
  kind: string;
  category: string;
  tags: string[];
  algorithmTopics: string[];
};

export function getAllContentEntries(includeDrafts = process.env.NODE_ENV !== "production"): ContentIndexEntry[] {
  return [
    ...getPosts(includeDrafts).map((post) => ({ title: post.title, description: post.description, date: post.date, updated: post.updated, href: `/posts/${post.slug}`, kind: getContentTypeName(post.contentType), category: post.category, tags: post.tags, algorithmTopics: post.algorithmTopics })),
    ...getSolutions(includeDrafts).map((post) => ({ title: post.title, description: post.description, date: post.date, updated: post.updated, href: `/solutions/${post.slug}`, kind: `PS 풀이 · ${post.judge}`, category: post.category, tags: post.tags, algorithmTopics: post.algorithmTopics })),
    ...getLogs(includeDrafts).map((post) => ({ title: post.title, description: post.description, date: post.date, updated: post.updated, href: `/log/${post.slug}`, kind: post.type, category: post.category, tags: post.tags, algorithmTopics: post.algorithmTopics })),
    ...getCustomPosts(includeDrafts).map((post) => ({ title: post.title, description: post.description, date: post.date, updated: post.updated, href: `/content/${post.section}/${post.slug}`, kind: post.sectionLabel, category: post.category, tags: post.tags, algorithmTopics: post.algorithmTopics })),
  ].sort((a, b) => b.date.localeCompare(a.date));
}

export function entryMatchesAlgorithm(entry: ContentIndexEntry, algorithm: string) {
  return entry.algorithmTopics.includes(algorithm) || entry.tags.includes(algorithm);
}
