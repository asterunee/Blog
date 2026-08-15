"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { LogIn, LogOut, UserRound, X } from "lucide-react";
import { accountLimits, authEvents, type SessionUser } from "@/lib/user-types";

type AuthResponse = { user?: SessionUser | null; error?: string };

export function UserAccount() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const loadUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth", { cache: "no-store" });
      const data = await response.json() as AuthResponse;
      setUser(data.user || null);
    } catch { setUser(null); }
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => void loadUser());
    const show = () => setOpen(true);
    const changed = () => void loadUser();
    addEventListener(authEvents.open, show);
    addEventListener(authEvents.changed, changed);
    return () => { cancelAnimationFrame(frame); removeEventListener(authEvents.open, show); removeEventListener(authEvents.changed, changed); };
  }, [loadUser]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: mode, username, displayName, password }) });
      const data = await response.json() as AuthResponse;
      if (!response.ok || !data.user) throw new Error(data.error || "로그인하지 못했습니다.");
      setUser(data.user);
      setPassword("");
      setOpen(false);
      dispatchEvent(new Event(authEvents.changed));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "로그인하지 못했습니다.");
    } finally { setBusy(false); }
  }

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/auth", { method: "DELETE" });
      setUser(null);
      setOpen(false);
      dispatchEvent(new Event(authEvents.changed));
    } finally { setBusy(false); }
  }

  function changeMode(next: "login" | "register") {
    setMode(next);
    setMessage("");
    setPassword("");
  }

  return <>
    <button className="icon-button account-trigger" onClick={() => setOpen(true)} aria-label={user ? `${user.displayName} 계정` : "로그인"} title={user ? `${user.displayName} · @${user.username}` : "로그인"}><UserRound size={17} /><span>{user?.displayName || "로그인"}</span></button>
    {open && <div className="auth-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section className="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="auth-close" onClick={() => setOpen(false)} aria-label="닫기"><X size={18} /></button>
        {user ? <div className="auth-profile">
          <div className="auth-avatar">{user.displayName.slice(0, 1).toUpperCase()}</div><span>로그인된 계정</span><h2 id="auth-title">{user.displayName}</h2><p>@{user.username}</p>
          <button onClick={() => void logout()} disabled={busy}><LogOut size={15} /> 로그아웃</button>
        </div> : <>
          <span className="auth-eyebrow">ASTERUNEE ACCOUNT</span><h2 id="auth-title">{mode === "login" ? "다시 만나서 반가워요." : "블로그 계정 만들기"}</h2><p>{mode === "login" ? "내 계정으로 댓글과 방명록을 남길 수 있습니다." : "표시 이름은 댓글과 방명록에 공개됩니다."}</p>
          <div className="auth-tabs" role="tablist"><button className={mode === "login" ? "active" : ""} onClick={() => changeMode("login")}>로그인</button><button className={mode === "register" ? "active" : ""} onClick={() => changeMode("register")}>가입</button></div>
          <form className="auth-form" onSubmit={submit}>
            <label>아이디<input value={username} onChange={(event) => setUsername(event.target.value)} maxLength={accountLimits.username} autoComplete="username" placeholder="영문 소문자 3자 이상" required /></label>
            {mode === "register" && <label>표시 이름<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={accountLimits.displayName} autoComplete="nickname" placeholder="댓글에 표시할 이름" required /></label>}
            <label>비밀번호<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} maxLength={accountLimits.password} autoComplete={mode === "register" ? "new-password" : "current-password"} placeholder="8자 이상" required /></label>
            <p className="auth-message" aria-live="polite">{message}</p>
            <button type="submit" disabled={busy}><LogIn size={15} />{busy ? "처리 중…" : mode === "login" ? "로그인" : "계정 만들기"}</button>
          </form>
          <small>비밀번호는 복구할 수 없으니 안전하게 보관해 주세요.</small>
        </>}
      </section>
    </div>}
  </>;
}
