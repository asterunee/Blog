import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import KeystaticApp from "./keystatic";
import { keystaticGithubMode } from "@/keystatic.config";
import { isKeystaticOwner } from "@/lib/keystatic-owner";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "asterunee studio",
  description: "asterunee 블로그 콘텐츠 관리",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#ffffff", colorScheme: "light dark" };

export default async function KeystaticLayout() {
  if (process.env.NODE_ENV === "production" && !keystaticGithubMode) return <html lang="ko"><body style={{ margin: 0, background: "#050814", color: "#eaf2ff", fontFamily: "system-ui, sans-serif" }}><main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}><div style={{ width: "min(620px, 100%)", padding: 40, border: "1px solid #25314a", background: "#0d1528" }}><span style={{ color: "#5ee7f7", fontSize: 11 }}>GITHUB CONNECTION REQUIRED</span><h1>작성기 연결이 필요합니다.</h1><p style={{ color: "#91a4be" }}>GitHub 저장소와 Keystatic GitHub App 설정을 확인해 주세요.</p><Link href="/" style={{ color: "#5ee7f7" }}>블로그로 돌아가기</Link></div></main></body></html>;
  if (process.env.NODE_ENV === "production" && keystaticGithubMode) {
    const accessToken = (await cookies()).get("keystatic-gh-access-token")?.value;
    if (!accessToken) redirect("/api/keystatic/github/login");
    if (!await isKeystaticOwner(accessToken)) return <html lang="ko"><body style={{ margin: 0, background: "#050814", color: "#eaf2ff", fontFamily: "system-ui, sans-serif" }}><main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}><div style={{ width: "min(560px, 100%)", padding: 40, border: "1px solid #25314a", background: "#0d1528" }}><span style={{ color: "#5ee7f7", fontSize: 11 }}>OWNER ONLY</span><h1>접근할 수 없습니다.</h1><p style={{ color: "#91a4be" }}>이 관리자는 asterunee GitHub 계정만 사용할 수 있습니다.</p><div style={{ display: "flex", gap: 18 }}><Link href="/api/keystatic/github/logout" style={{ color: "#5ee7f7" }}>다른 계정으로 로그인</Link><Link href="/" style={{ color: "#91a4be" }}>블로그로 돌아가기</Link></div></div></main></body></html>;
  }
  return <html lang="ko" suppressHydrationWarning><body style={{ margin: 0 }}><KeystaticApp /></body></html>;
}
