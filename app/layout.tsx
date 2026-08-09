import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR, Space_Grotesk } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { siteConfig } from "@/lib/site";

const sans = Noto_Sans_KR({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url), title: { default: siteConfig.title, template: "%s · asterunee" }, description: siteConfig.description,
  alternates: { canonical: "/" }, openGraph: { title: siteConfig.title, description: siteConfig.description, siteName: "asterunee", type: "website", locale: "ko_KR" },
  twitter: { card: "summary_large_image", title: siteConfig.title, description: siteConfig.description },
};
export const viewport: Viewport = { themeColor: "#050814", colorScheme: "dark light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const schema = { "@context": "https://schema.org", "@type": "Blog", name: "asterunee", description: siteConfig.description, url: siteConfig.url, author: { "@type": "Person", name: "asterunee" } };
  return <html lang="ko" data-theme="dark" data-lang="ko" suppressHydrationWarning><body className={`${sans.variable} ${display.variable}`}><a href="#main" className="skip-link">본문으로 건너뛰기</a><div className="cosmos" aria-hidden /><Header /><main id="main">{children}</main><Footer /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></body></html>;
}
