import { ImageResponse } from "next/og";

export const alt = "asterunee — 개발과 배움을 기록하는 블로그";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 90, color: "#EAF2FF", background: "radial-gradient(circle at 78% 20%, #163a64 0, #080D1C 35%, #050814 72%)", fontFamily: "sans-serif" }}>
      <div style={{ fontSize: 24, letterSpacing: 4, color: "#5EE7F7" }}>PERSONAL BLOG</div>
      <div style={{ fontSize: 96, letterSpacing: -5, marginTop: 25 }}>asterunee</div>
      <div style={{ fontSize: 32, color: "#91A4BE", marginTop: 10 }}>개발과 배움을 기록하는 블로그</div>
    </div>,
    size,
  );
}
