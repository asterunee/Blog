"use client";

import { useEffect, useState, type FormEvent } from "react";
import { MessageCircle, Send, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { commentLimits, type PublicComment } from "@/lib/comments";

type CommentsResponse = { comments?: PublicComment[]; canModerate?: boolean; error?: string };

export function Comments() {
  const pathname = usePathname();
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [canModerate, setCanModerate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadComments() {
      try {
        const response = await fetch(`/api/comments?page=${encodeURIComponent(pathname)}`, { cache: "no-store" });
        const data = await response.json() as CommentsResponse;
        if (!response.ok) throw new Error(data.error || "댓글을 불러오지 못했습니다.");
        if (!cancelled) {
          setComments(data.comments || []);
          setCanModerate(data.canModerate === true);
        }
      } catch (error) {
        if (!cancelled) setMessage(error instanceof Error ? error.message : "댓글을 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadComments();
    return () => { cancelled = true; };
  }, [pathname]);

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!body.trim() || submitting) return;
    setSubmitting(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: pathname, name, body, website: form.get("website") }),
      });
      const data = await response.json() as { comment?: PublicComment; error?: string };
      if (!response.ok || !data.comment) throw new Error(data.error || "댓글을 저장하지 못했습니다.");
      setComments((current) => [data.comment!, ...current]);
      setBody("");
      setMessage("댓글이 등록되었습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "댓글을 저장하지 못했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteComment(comment: PublicComment) {
    if (!window.confirm("이 댓글을 삭제할까요?")) return;
    const response = await fetch("/api/comments", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ page: pathname, id: comment.id }) });
    if (response.ok) setComments((current) => current.filter((item) => item.id !== comment.id));
    else setMessage("댓글을 삭제하지 못했습니다.");
  }

  return <section className="article-comments" aria-labelledby="comments-title">
    <header><div><MessageCircle size={17} /><h2 id="comments-title">댓글</h2><span>{comments.length}</span></div><p>로그인 없이 바로 의견을 남길 수 있습니다.</p></header>
    <form className="comment-form" onSubmit={submitComment}>
      <div className="comment-form-row"><label><span>이름</span><input value={name} onChange={(event) => setName(event.target.value)} maxLength={commentLimits.name} placeholder="익명" autoComplete="name" /></label><span>{body.length}/{commentLimits.body}</span></div>
      <label className="comment-body-field"><span className="sr-only">댓글 내용</span><textarea value={body} onChange={(event) => setBody(event.target.value)} maxLength={commentLimits.body} rows={4} placeholder="댓글을 입력해 주세요." required /></label>
      <label className="comment-honeypot" aria-hidden="true">웹사이트<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <div className="comment-form-footer"><p aria-live="polite">{message}</p><button type="submit" disabled={submitting || !body.trim()}>{submitting ? "등록 중…" : "댓글 등록"}<Send size={13} /></button></div>
    </form>
    <div className="comment-list" aria-live="polite">
      {loading && <p className="comments-state">댓글을 불러오는 중…</p>}
      {!loading && comments.length === 0 && <p className="comments-state">첫 댓글을 남겨보세요.</p>}
      {comments.map((comment) => <article key={comment.id} className="comment-item"><div className="comment-avatar" aria-hidden="true">{comment.name.slice(0, 1).toUpperCase()}</div><div><header><b>{comment.name}</b><time dateTime={comment.createdAt}>{new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(comment.createdAt))}</time>{canModerate && <button type="button" onClick={() => void deleteComment(comment)} aria-label="댓글 삭제"><Trash2 size={12} /></button>}</header><p>{comment.body}</p></div></article>)}
    </div>
  </section>;
}
