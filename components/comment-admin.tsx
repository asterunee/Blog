"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, MessageSquareText, Pencil, RefreshCw, Save, Search, Trash2, X } from "lucide-react";
import { commentLimits, type AdminComment } from "@/lib/comments";
import styles from "@/app/admin/comments/comment-admin.module.css";

type ResponseData = { comments?: AdminComment[]; comment?: AdminComment; error?: string };

export function CommentAdmin() {
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("댓글을 불러오는 중…");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const response = await fetch("/api/comments?admin=1", { cache: "no-store" });
      const data = await response.json() as ResponseData;
      if (!response.ok) throw new Error(data.error || "댓글을 불러오지 못했습니다.");
      setComments(data.comments || []);
      setMessage(data.comments?.length ? "" : "아직 등록된 댓글이 없습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "댓글을 불러오지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => void load());
    return () => cancelAnimationFrame(frame);
  }, [load]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ko");
    if (!normalized) return comments;
    return comments.filter((comment) => [comment.name, comment.body, comment.page, comment.pageTitle].some((value) => value.toLocaleLowerCase("ko").includes(normalized)));
  }, [comments, query]);
  const pageCount = new Set(comments.map((comment) => comment.page).filter(Boolean)).size;

  function startEditing(comment: AdminComment) {
    setEditingId(comment.id);
    setName(comment.name);
    setBody(comment.body);
    setMessage("");
  }

  async function saveComment(comment: AdminComment) {
    setBusy(true);
    try {
      const response = await fetch("/api/comments", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: comment.id, name, body }) });
      const data = await response.json() as ResponseData;
      if (!response.ok || !data.comment) throw new Error(data.error || "댓글을 수정하지 못했습니다.");
      setComments((current) => current.map((item) => item.id === comment.id ? { ...item, ...data.comment } : item));
      setEditingId(null);
      setMessage("댓글을 수정했습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "댓글을 수정하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteComment(comment: AdminComment) {
    if (!window.confirm(`“${comment.name}” 댓글을 삭제할까요? 삭제 후 복구할 수 없습니다.`)) return;
    setBusy(true);
    try {
      const response = await fetch("/api/comments", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: comment.id }) });
      const data = await response.json() as ResponseData;
      if (!response.ok) throw new Error(data.error || "댓글을 삭제하지 못했습니다.");
      setComments((current) => current.filter((item) => item.id !== comment.id));
      if (editingId === comment.id) setEditingId(null);
      setMessage("댓글을 삭제했습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "댓글을 삭제하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }

  return <main className={styles.page}>
    <header className={styles.header}>
      <div><Link href="/keystatic"><ArrowLeft size={15} /> 작성기로 돌아가기</Link><span>ASTERUNEE STUDIO</span><h1>댓글 관리</h1><p>블로그 전체 댓글을 한곳에서 확인하고 필요한 내용을 수정하거나 삭제합니다.</p></div>
      <button type="button" onClick={() => void load()} disabled={busy}><RefreshCw size={15} className={busy ? styles.spinning : ""} /> 새로고침</button>
    </header>

    <section className={styles.summary} aria-label="댓글 요약">
      <article><MessageSquareText size={17} /><span>전체 댓글</span><strong>{comments.length}</strong></article>
      <article><ExternalLink size={17} /><span>댓글이 있는 글</span><strong>{pageCount}</strong></article>
      <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="작성자, 내용, 글 제목 검색" /><span>{filtered.length}개 표시</span></label>
    </section>

    {message && <p className={styles.message} aria-live="polite">{message}</p>}
    <section className={styles.list} aria-label="전체 댓글 목록">
      {filtered.map((comment) => <article key={comment.id} className={styles.comment}>
        <header>
          <div className={styles.avatar}>{comment.name.slice(0, 1).toUpperCase()}</div>
          <div><b>{comment.name}</b><time dateTime={comment.createdAt}>{new Intl.DateTimeFormat("ko-KR", { dateStyle: "long", timeStyle: "short" }).format(new Date(comment.createdAt))}</time></div>
          <div className={styles.actions}>
            <button type="button" onClick={() => startEditing(comment)} disabled={busy} aria-label="댓글 수정"><Pencil size={14} /> 수정</button>
            <button type="button" onClick={() => void deleteComment(comment)} disabled={busy} aria-label="댓글 삭제"><Trash2 size={14} /> 삭제</button>
          </div>
        </header>
        <div className={styles.source}>{comment.page ? <Link href={comment.page} target="_blank"><span>{comment.pageTitle}</span><small>{comment.page}</small><ExternalLink size={12} /></Link> : <span>{comment.pageTitle}</span>}</div>
        {editingId === comment.id ? <div className={styles.editor}>
          <label>작성자<input value={name} onChange={(event) => setName(event.target.value)} maxLength={commentLimits.name} /></label>
          <label>댓글<textarea value={body} onChange={(event) => setBody(event.target.value)} maxLength={commentLimits.body} rows={6} /></label>
          <div><span>{body.length}/{commentLimits.body}</span><button type="button" onClick={() => setEditingId(null)}><X size={14} /> 취소</button><button type="button" onClick={() => void saveComment(comment)} disabled={busy || !body.trim()}><Save size={14} /> 저장</button></div>
        </div> : <p>{comment.body}</p>}
      </article>)}
    </section>
  </main>;
}
