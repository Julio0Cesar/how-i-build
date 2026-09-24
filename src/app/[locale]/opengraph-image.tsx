import { ImageResponse } from "next/og";
import { site } from "@/config/site";

/**
 * The image that shows up when someone shares a link to the site.
 *
 * Generated rather than a file: a static PNG committed to the repository ages
 * alongside the name and the tagline, and every fork would have to redraw its
 * own. A page with its own cover, such as a post, overrides this one.
 */
export const alt = site.tagline;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#121214",
        color: "#F3F2EE",
        padding: 80,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 22, height: 22, background: "#7C6FF0", transform: "rotate(45deg)" }} />
        <div style={{ fontSize: 30, letterSpacing: 2, textTransform: "uppercase", opacity: 0.7 }}>
          {site.name}
        </div>
      </div>
      <div style={{ fontSize: 68, lineHeight: 1.15, maxWidth: 900 }}>{site.tagline}</div>
      <div style={{ fontSize: 26, opacity: 0.55 }}>{new URL(site.liveUrl).host}</div>
    </div>,
    size,
  );
}
