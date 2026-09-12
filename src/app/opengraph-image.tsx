import { ImageResponse } from "next/og";
import { fetchContent } from "@/lib/server/content";

export const runtime = "edge";
export const alt = "MessagesLab personal SMS gateway";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const content = await fetchContent();
  const badge = content.hero.hero_badge?.title || "Your Phone. Your SIM. Your Gateway.";
  const title = content.hero.hero_title?.title || "Turn Your Android Into a Personal SMS Gateway";

  return new ImageResponse(
    <div style={{ background: "linear-gradient(135deg, #eef0ff, #ffffff 55%, #dfe3ff)", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px", color: "#171d3d" }}>
      <div style={{ color: "#4148e8", fontSize: 28, fontWeight: 700, marginBottom: 28 }}>{badge}</div>
      <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, maxWidth: 950 }}>MessagesLab</div>
      <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.2, maxWidth: 950, marginTop: 20 }}>{title}</div>
    </div>,
    size,
  );
}