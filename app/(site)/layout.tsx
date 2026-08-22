import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { Noto_Sans_KR, Space_Grotesk } from "next/font/google";
import "katex/dist/katex.min.css";
import "../globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { siteConfig } from "@/lib/site";
import { VisitorTracker } from "@/components/visitor-tracker";

const sans = Noto_Sans_KR({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url), title: { default: siteConfig.title, template: "%s · asterunee" }, description: siteConfig.description,
  alternates: { canonical: "/" }, openGraph: { title: siteConfig.title, description: siteConfig.description, siteName: "asterunee", type: "website", locale: "ko_KR" },
  twitter: { card: "summary_large_image", title: siteConfig.title, description: siteConfig.description },
};
export const viewport: Viewport = { themeColor: "#050814", colorScheme: "dark light" };

const themeBootstrap = `(()=>{try{const root=document.documentElement;const fallback=${JSON.stringify(siteConfig.defaultTheme)};const saved=localStorage.getItem("asterunee-theme");const allowed=["dark","aurora","forest","sunset","paper","light","system"];const preference=allowed.includes(saved)?saved:fallback;const resolved=preference==="system"?(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"):preference;root.dataset.theme=resolved;root.dataset.themePreference=preference;const language=localStorage.getItem("asterunee-language")==="en"?"en":"ko";root.lang=language;root.dataset.lang=language}catch{}})();`;

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const schema = { "@context": "https://schema.org", "@type": "Blog", name: "asterunee", description: siteConfig.description, url: siteConfig.url, author: { "@type": "Person", name: "asterunee", image: `${siteConfig.url}${siteConfig.profileImage}` } };
  const bodyStyle = { "--site-accent": siteConfig.accentColor } as CSSProperties;
  const backgroundStyle = { backgroundImage: siteConfig.backgroundImage ? `url(${siteConfig.backgroundImage})` : undefined, backgroundPosition: siteConfig.backgroundPosition, opacity: Math.max(0, Math.min(60, siteConfig.backgroundStrength)) / 100 } as CSSProperties;
  return <html lang="ko" data-theme={siteConfig.defaultTheme} data-theme-preference={siteConfig.defaultTheme} data-background={siteConfig.backgroundPattern} data-lang="ko" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeBootstrap }} /></head><body className={`${sans.variable} ${display.variable}`} style={bodyStyle}><a href="#main" className="skip-link">본문으로 건너뛰기</a><div className="site-background" style={backgroundStyle} aria-hidden /><div className="cosmos" aria-hidden /><Header /><main id="main">{children}</main><Footer /><VisitorTracker /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></body></html>;
}
