import { describe, expect, it } from "vitest";
import { extractHeadings, getLogs, getSolutions, searchSolutions } from "@/lib/content";

describe("content pipeline", () => {
  it("validates and loads sample solutions", () => { const posts = getSolutions(true); expect(posts.length).toBeGreaterThanOrEqual(2); expect(posts.every((p) => p.author === "asterunee")).toBe(true); });
  it("searches title, tags and body", () => { const posts = getSolutions(true); expect(searchSolutions(posts, "dsu").some((p) => p.slug === "constellation-bridges")).toBe(true); expect(searchSolutions(posts, "우선순위 큐").some((p) => p.slug === "orbital-route")).toBe(true); });
  it("extracts stable Korean heading ids", () => { expect(extractHeadings("## 핵심 아이디어\ntext\n## 시간·공간 복잡도")).toEqual([{ title:"핵심 아이디어", id:"핵심-아이디어" }, { title:"시간·공간 복잡도", id:"시간공간-복잡도" }]); });
  it("loads Git-managed observation logs", () => { const logs = getLogs(true); expect(logs[0].author).toBe("asterunee"); expect(logs[0].body).toContain("## 대회 전"); });
});
