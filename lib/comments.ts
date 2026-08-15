export const commentLimits = { name: 24, body: 1000 } as const;

export type PublicComment = {
  id: string;
  name: string;
  body: string;
  createdAt: string;
  page?: string;
};

export type AdminComment = PublicComment & {
  page: string;
  pageTitle: string;
};

export type CommentInput = {
  page: string;
  name: string;
  body: string;
};

export function parseCommentInput(input: unknown): { ok: true; value: CommentInput } | { ok: false; error: string } {
  if (!input || typeof input !== "object") return { ok: false, error: "잘못된 요청입니다." };
  const data = input as Record<string, unknown>;
  const page = typeof data.page === "string" ? data.page.trim() : "";
  const name = typeof data.name === "string" ? data.name.trim().replace(/\s+/g, " ") : "";
  const body = typeof data.body === "string" ? data.body.trim().replace(/\r\n/g, "\n") : "";

  if (!page.startsWith("/") || page.length > 300) return { ok: false, error: "올바른 글 주소가 아닙니다." };
  if (name.length > commentLimits.name) return { ok: false, error: `이름은 ${commentLimits.name}자까지 입력할 수 있습니다.` };
  if (!body) return { ok: false, error: "댓글 내용을 입력해 주세요." };
  if (body.length > commentLimits.body) return { ok: false, error: `댓글은 ${commentLimits.body}자까지 입력할 수 있습니다.` };

  return { ok: true, value: { page, name: name || "익명", body } };
}

export function parseCommentEdit(input: unknown): { ok: true; value: Pick<PublicComment, "name" | "body"> } | { ok: false; error: string } {
  if (!input || typeof input !== "object") return { ok: false, error: "잘못된 요청입니다." };
  const data = input as Record<string, unknown>;
  const name = typeof data.name === "string" ? data.name.trim().replace(/\s+/g, " ") : "";
  const body = typeof data.body === "string" ? data.body.trim().replace(/\r\n/g, "\n") : "";

  if (name.length > commentLimits.name) return { ok: false, error: `이름은 ${commentLimits.name}자까지 입력할 수 있습니다.` };
  if (!body) return { ok: false, error: "댓글 내용을 입력해 주세요." };
  if (body.length > commentLimits.body) return { ok: false, error: `댓글은 ${commentLimits.body}자까지 입력할 수 있습니다.` };
  return { ok: true, value: { name: name || "익명", body } };
}
