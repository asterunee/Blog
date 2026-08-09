import type { Metadata, Viewport } from "next";
import Link from "next/link";
import KeystaticApp from "./keystatic";
import { keystaticGithubMode } from "@/keystatic.config";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "asterunee studio",
  description: "asterunee 블로그 콘텐츠 관리",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#ffffff", colorScheme: "light dark" };

export default function KeystaticLayout() {
  if (process.env.NODE_ENV === "production" && !keystaticGithubMode) return <html lang="ko"><body style={{ margin: 0, background: "#050814", color: "#eaf2ff", fontFamily: "system-ui, sans-serif" }}><main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}><div style={{ width: "min(620px, 100%)", padding: 40, border: "1px solid #25314a", background: "#0d1528" }}><span style={{ color: "#5ee7f7", fontSize: 11 }}>GITHUB CONNECTION REQUIRED</span><h1>작성기 연결이 필요합니다.</h1><p style={{ color: "#91a4be" }}>GitHub 저장소와 Keystatic GitHub App 설정을 확인해 주세요.</p><Link href="/" style={{ color: "#5ee7f7" }}>블로그로 돌아가기</Link></div></main></body></html>;
  return <html lang="ko" suppressHydrationWarning><body style={{ margin: 0 }}><KeystaticApp /></body></html>;
}
