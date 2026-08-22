import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isKeystaticOwner } from "@/lib/keystatic-owner";

export const metadata: Metadata = {
  title: "블로그 관리 · asterunee studio",
  description: "asterunee 블로그 댓글과 방문 통계 관리",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#080b14", colorScheme: "dark" };

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (process.env.NODE_ENV === "production") {
    const accessToken = (await cookies()).get("keystatic-gh-access-token")?.value;
    if (!accessToken) redirect("/api/keystatic/github/login");
    if (!await isKeystaticOwner(accessToken)) redirect("/keystatic");
  }
  return <html lang="ko"><body style={{ margin: 0 }}>{children}</body></html>;
}
