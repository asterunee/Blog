import type { Metadata } from "next";
import { LogTimeline } from "@/components/log-timeline";
import { getLogs } from "@/lib/content";

export const metadata: Metadata = { title: "짧은 기록", description: "공부와 구현, 일상과 생각을 시간순으로 남긴 짧은 기록", alternates: { canonical: "/log" } };
export default function LogPage() { return <div className="page-shell"><header className="page-title"><h1>짧은 기록</h1><p>공부와 구현, 일상에서 발견한 작은 생각을 날짜순으로 남깁니다.</p></header><LogTimeline posts={getLogs()} /></div>; }
