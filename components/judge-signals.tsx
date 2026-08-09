"use client";
import { useEffect, useState } from "react";

type Signal = { judge: string; handle: string; status: "online" | "fallback"; primary: string; secondary: string; updatedAt: string };

export function JudgeSignals() {
  const [signals, setSignals] = useState<Signal[]>([]);
  useEffect(() => { fetch("/api/judges").then((r) => r.json()).then((d) => setSignals(d.signals)).catch(() => setSignals([])); }, []);
  return <div className="judge-signals" aria-live="polite">{signals.length ? signals.map((signal) => <div key={signal.judge}><span><i className={signal.status} />{signal.judge}</span><b>{signal.primary}</b><small>{signal.secondary} · @{signal.handle}</small></div>) : <p>저지 신호 동기화 중…</p>}</div>;
}
