"use client";

import { useEffect, useState } from "react";
import { RatingChart } from "@/components/rating-chart";

type Summary = { solved: number; easy: number; medium: number; hard: number; streak: number; totalActiveDays: number; contestRating: number | null; attendedContests: number; badge: string | null };

export function LeetCodeActivity() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/leetcode").then((response) => response.json()).then((data: { summary?: Summary }) => setSummary(data.summary || null)).catch(() => setSummary(null)).finally(() => setLoaded(true));
  }, []);

  if (!loaded) return <div className="rating-chart-loading">LeetCode 활동을 불러오는 중…</div>;
  if (!summary) return <div className="rating-chart-loading">LeetCode 활동을 불러오지 못했습니다.</div>;
  if (summary.contestRating !== null) return <RatingChart judge="LeetCode" />;

  return <div className="leetcode-profile-summary">
    <header><span>해결한 문제</span><strong>{summary.solved}</strong><small>대회 레이팅은 첫 참가 후 표시됩니다.</small></header>
    <div><span><b>{summary.easy}</b>Easy</span><span><b>{summary.medium}</b>Medium</span><span><b>{summary.hard}</b>Hard</span></div>
    <footer><span>현재 스트릭 <b>{summary.streak}일</b></span><span>활동일 <b>{summary.totalActiveDays}일</b></span></footer>
  </div>;
}
