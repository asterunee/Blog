import { describe, expect, it } from "vitest";
import { extractHeadings, getLogs, getPosts, getSolutions, searchSolutions } from "@/lib/content";

describe("content pipeline", () => {
  it("validates and loads general posts", () => {
    const posts = getPosts(true);
    expect(posts.length).toBeGreaterThanOrEqual(2);
    expect(posts.every((post) => post.author === "asterunee")).toBe(true);
  });

  it("does not ship placeholder solutions", () => {
    const solutions = getSolutions(true);
    expect(solutions).toHaveLength(0);
    expect(searchSolutions(solutions, "dsu")).toEqual([]);
  });

  it("extracts stable Korean heading ids", () => {
    expect(extractHeadings("## 핵심 아이디어\ntext\n## 시간·공간 복잡도")).toEqual([
      { title: "핵심 아이디어", id: "핵심-아이디어" },
      { title: "시간·공간 복잡도", id: "시간공간-복잡도" },
    ]);
  });

  it("loads Git-managed logs", () => {
    const logs = getLogs(true);
    expect(logs[0].author).toBe("asterunee");
    expect(logs[0].body).toContain("## 바꾸고 싶었던 것");
  });
});
