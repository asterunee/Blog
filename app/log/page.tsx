import type { Metadata } from "next";
import { LogTimeline } from "@/components/log-timeline";
import { getLogs } from "@/lib/content";

export const metadata: Metadata = { title: "관측 기록", description: "대회 후기, 공부, 구현과 디버깅을 시간순으로 남긴 항해 기록", alternates: { canonical: "/log" } };
export default function LogPage() { return <div className="page-shell"><header className="page-title"><span className="section-index">CELESTIAL LOGBOOK</span><h1>관측 기록</h1><p>대회와 공부, 구현 중 발견한 작은 오차까지 날짜 위에 남깁니다.</p></header><LogTimeline posts={getLogs()} /></div>; }
