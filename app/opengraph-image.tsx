import { ImageResponse } from "next/og";

export const alt = "asterunee — 별과 달 사이의 기록";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 90, color: "#EAF2FF", background: "radial-gradient(circle at 78% 20%, #163a64 0, #080D1C 35%, #050814 72%)", fontFamily: "sans-serif" }}>
      <div style={{ fontSize: 24, letterSpacing: 8, color: "#5EE7F7" }}>PERSONAL LOGBOOK</div>
      <div style={{ fontSize: 104, letterSpacing: -5, marginTop: 25 }}>asterunee</div>
      <div style={{ fontSize: 32, color: "#91A4BE", marginTop: 10 }}>별과 달 사이의 기록</div>
      <div style={{ position: "absolute", right: 110, bottom: 90, width: 200, height: 200, border: "1px solid rgba(94,231,247,.35)", borderRadius: "50%" }} />
    </div>,
    size,
  );
}
