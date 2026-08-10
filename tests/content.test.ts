import { afterEach, describe, expect, it, vi } from "vitest";
import { extractHeadings, getCustomPosts, getLogs, getPosts, getSolutions, searchSolutions } from "@/lib/content";
import { customContentSections, writerSections } from "@/lib/editor-settings";
import { siteSettings, siteThemes } from "@/lib/settings";
import { getManagedAlgorithms } from "@/lib/taxonomy";
import { isKeystaticOwner, keystaticOwner } from "@/lib/keystatic-owner";
import { parseCommentInput } from "@/lib/comments";
import { getRatingTitle } from "@/lib/ratings";
import { getAllContentEntries } from "@/lib/content-index";

afterEach(() => vi.unstubAllGlobals());

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

  it("loads administrator-managed algorithms in a stable order", () => {
    const algorithms = getManagedAlgorithms();
    expect(algorithms.length).toBeGreaterThan(0);
    expect(algorithms.some((algorithm) => algorithm.slug === "graph" && algorithm.name === "그래프")).toBe(true);
    expect(algorithms.map((algorithm) => algorithm.order)).toEqual([...algorithms.map((algorithm) => algorithm.order)].sort((a, b) => a - b));
  });

  it("loads user-managed writer sections and public custom content safely", () => {
    expect(new Set(writerSections.map((section) => section.key)).size).toBe(writerSections.length);
    expect(customContentSections.every((section) => !section.builtIn)).toBe(true);
    expect(getCustomPosts(false).every((post) => !post.draft)).toBe(true);
  });

  it("only accepts the configured GitHub owner for the administrator", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(keystaticOwner), { status: 200 })));
    await expect(isKeystaticOwner("owner-token")).resolves.toBe(true);

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ login: keystaticOwner.login, id: 1 }), { status: 200 })));
    await expect(isKeystaticOwner("another-token")).resolves.toBe(false);
    await expect(isKeystaticOwner()).resolves.toBe(false);
  });

  it("maps online judge ratings to their public titles", () => {
    expect(getRatingTitle("Codeforces", 1501)).toBe("Specialist");
    expect(getRatingTitle("AtCoder", 1916)).toBe("Blue");
  });

  it("validates anonymous comments before storage", () => {
    expect(parseCommentInput({ page: "/posts/example", name: "", body: "좋은 글입니다." })).toEqual({ ok: true, value: { page: "/posts/example", name: "익명", body: "좋은 글입니다." } });
    expect(parseCommentInput({ page: "https://example.com", name: "test", body: "comment" }).ok).toBe(false);
    expect(parseCommentInput({ page: "/posts/example", name: "test", body: "" }).ok).toBe(false);
  });

  it("builds one chronological feed for the home and all-posts pages", () => {
    const entries = getAllContentEntries(false);
    expect(entries.length).toBeGreaterThan(0);
    expect(entries.map((entry) => entry.date)).toEqual([...entries.map((entry) => entry.date)].sort((a, b) => b.localeCompare(a)));
    expect(entries.every((entry) => entry.href.startsWith("/") && entry.readingMinutes > 0)).toBe(true);
  });
});
