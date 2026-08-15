"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { LogIn, MessageCircle, Reply, Send, Trash2, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { commentLimits, type PublicComment } from "@/lib/comments";
import { authEvents, type SessionUser } from "@/lib/user-types";

type CommentsResponse = { comments?: PublicComment[]; canModerate?: boolean; currentUser?: SessionUser | null; error?: string };

export function Comments({ title = "댓글", description = "글에 대한 생각과 질문을 나눠 주세요." }: { title?: string; description?: string }) {
  const pathname = usePathname();
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [canModerate, setCanModerate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [body, setBody] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
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
          setCurrentUser(data.currentUser || null);
        }
      } catch (error) {
        if (!cancelled) setMessage(error instanceof Error ? error.message : "댓글을 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    async function refreshUser() {
      try {
        const response = await fetch("/api/auth", { cache: "no-store" });
        const data = await response.json() as { user?: SessionUser | null };
        if (!cancelled) setCurrentUser(data.user || null);
      } catch { if (!cancelled) setCurrentUser(null); }
    }
    void loadComments();
    const onAuthChange = () => void refreshUser();
    addEventListener(authEvents.changed, onAuthChange);
    return () => { cancelled = true; removeEventListener(authEvents.changed, onAuthChange); };
  }, [pathname]);

  const threads = useMemo(() => {
    const ids = new Set(comments.map((comment) => comment.id));
    const roots = comments.filter((comment) => !comment.parentId || !ids.has(comment.parentId));
    const replies = new Map<string, PublicComment[]>();
    comments.forEach((comment) => {
      if (!comment.parentId || !ids.has(comment.parentId)) return;
      replies.set(comment.parentId, [...(replies.get(comment.parentId) || []), comment]);
    });
    replies.forEach((items) => items.sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
    return { roots, replies };
  }, [comments]);

  function openAuth() { dispatchEvent(new Event(authEvents.open)); }

  async function submitComment(text: string, parentId?: string) {
    if (!text.trim() || submitting) return;
    if (!currentUser) { openAuth(); return; }
    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/comments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ page: pathname, body: text, parentId }) });
      const data = await response.json() as { comment?: PublicComment; error?: string };
      if (!response.ok || !data.comment) throw new Error(data.error || "댓글을 저장하지 못했습니다.");
      setComments((current) => [data.comment!, ...current]);
      if (parentId) { setReplyBody(""); setReplyingTo(null); } else setBody("");
      setMessage(parentId ? "답글이 등록되었습니다." : `${title}이 등록되었습니다.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "댓글을 저장하지 못했습니다.");
    } finally { setSubmitting(false); }
  }

  async function deleteComment(comment: PublicComment) {
    const hasReplies = (threads.replies.get(comment.id)?.length || 0) > 0;
    if (!window.confirm(`이 ${comment.parentId ? "답글" : "댓글"}을 삭제할까요?${hasReplies ? " 아래 답글도 함께 삭제됩니다." : ""}`)) return;
    const response = await fetch("/api/comments", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ page: pathname, id: comment.id }) });
    if (response.ok) setComments((current) => current.filter((item) => item.id !== comment.id && item.parentId !== comment.id));
    else setMessage("댓글을 삭제하지 못했습니다.");
  }

  function canDelete(comment: PublicComment) { return canModerate || Boolean(currentUser && comment.authorId === currentUser.username); }
  function date(comment: PublicComment) { return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(comment.createdAt)); }

  function renderComment(comment: PublicComment, reply = false, rootId = comment.id) {
    return <article key={comment.id} className={`comment-item${reply ? " comment-reply" : ""}`}>
      <div className="comment-avatar" aria-hidden="true">{comment.name.slice(0, 1).toUpperCase()}</div>
      <div><header><b>{comment.name}</b>{comment.authorId && <span className="comment-account">@{comment.authorId}</span>}<time dateTime={comment.createdAt}>{date(comment)}</time><div className="comment-actions">{!reply && <button type="button" onClick={() => { if (!currentUser) openAuth(); else { setReplyingTo(rootId); setReplyBody(""); } }} aria-label="답글 작성"><Reply size={12} /><span>답글</span></button>}{canDelete(comment) && <button type="button" onClick={() => void deleteComment(comment)} aria-label="댓글 삭제"><Trash2 size={12} /></button>}</div></header><p>{comment.body}</p></div>
    </article>;
  }

  return <section className="article-comments" aria-labelledby="comments-title">
    <header><div><MessageCircle size={17} /><h2 id="comments-title">{title}</h2><span>{comments.length}</span></div><p>{description}</p></header>
    {currentUser ? <form className="comment-form" onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); void submitComment(body); }}>
      <div className="comment-form-row"><p><span className="comment-signed-avatar">{currentUser.displayName.slice(0, 1).toUpperCase()}</span><b>{currentUser.displayName}</b><small>@{currentUser.username}</small></p><span>{body.length}/{commentLimits.body}</span></div>
      <label className="comment-body-field"><span className="sr-only">{title} 내용</span><textarea value={body} onChange={(event) => setBody(event.target.value)} maxLength={commentLimits.body} rows={4} placeholder={title === "방명록" ? "asterunee에게 인사를 남겨 주세요." : "댓글을 입력해 주세요."} required /></label>
      <div className="comment-form-footer"><p aria-live="polite">{message}</p><button type="submit" disabled={submitting || !body.trim()}>{submitting ? "등록 중…" : `${title} 등록`}<Send size={13} /></button></div>
    </form> : <div className="comment-login-prompt"><div><LogIn size={18} /><p><b>로그인하고 참여해 주세요.</b><span>내 계정으로 댓글과 답글을 남길 수 있습니다.</span></p></div><button type="button" onClick={openAuth}>로그인 / 가입</button></div>}
    <div className="comment-list" aria-live="polite">
      {loading && <p className="comments-state">댓글을 불러오는 중…</p>}
      {!loading && comments.length === 0 && <p className="comments-state">첫 {title}을 남겨보세요.</p>}
      {threads.roots.map((comment) => <section className="comment-thread" key={comment.id}>
        {renderComment(comment)}
        {(threads.replies.get(comment.id) || []).map((reply) => renderComment(reply, true, comment.id))}
        {replyingTo === comment.id && <form className="comment-reply-form" onSubmit={(event) => { event.preventDefault(); void submitComment(replyBody, comment.id); }}><div><Reply size={14} /><span><b>{comment.name}</b>님에게 답글</span><button type="button" onClick={() => setReplyingTo(null)} aria-label="답글 닫기"><X size={14} /></button></div><textarea value={replyBody} onChange={(event) => setReplyBody(event.target.value)} maxLength={commentLimits.body} rows={3} placeholder="답글을 입력해 주세요." autoFocus required /><footer><span>{replyBody.length}/{commentLimits.body}</span><button type="submit" disabled={submitting || !replyBody.trim()}>답글 등록 <Send size={12} /></button></footer></form>}
      </section>)}
    </div>
  </section>;
}
