import { describe, expect, it } from "vitest";
import { extractHeadings, getLogs, getPosts, getSolutions, searchSolutions } from "@/lib/content";
import { siteSettings, siteThemes } from "@/lib/settings";

describe("content pipeline", () => {
  it("parses Keystatic content and keeps drafts out of the public feed", () => {
    const draftsIncluded = getPosts(true);
    expect(draftsIncluded.every((post) => /^\d{4}-\d{2}-\d{2}$/.test(post.date))).toBe(true);
    expect(getPosts(false).every((post) => !post.draft)).toBe(true);
    expect(getSolutions(false).every((post) => !post.draft)).toBe(true);
    expect(getLogs(false).every((post) => !post.draft)).toBe(true);
  });

  it("keeps empty solution search stable", () => {
    expect(searchSolutions([], "dsu")).toEqual([]);
  });

  it("extracts stable Korean heading ids", () => {
    expect(extractHeadings("## 핵심 아이디어\ntext\n## 시간·공간 복잡도")).toEqual([
      { title: "핵심 아이디어", id: "핵심-아이디어" },
      { title: "시간·공간 복잡도", id: "시간공간-복잡도" },
    ]);
  });

  it("loads editable site settings with a valid theme", () => {
    expect(siteSettings.siteName).toBe("asterunee");
    expect(siteThemes).toContain(siteSettings.defaultTheme);
    expect(siteSettings.backgroundStrength).toBeGreaterThanOrEqual(0);
  });
});
