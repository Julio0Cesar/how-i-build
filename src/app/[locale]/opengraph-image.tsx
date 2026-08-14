import { ImageResponse } from "next/og";
import { site } from "@/config/site";
import { locales } from "@/i18n/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.name;

/**
 * Without this the image would be rendered on demand, which would make the one
 * route in the app that is not statically generated the one nobody visits
 * directly. Both locales get a file at build time instead.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Drawn rather than stored, so a fork gets its own name on it by editing the
 * config and nothing else. No web font is loaded: fetching one at build time
 * would tie image generation to a network that may not answer.
 *
 * The colours restate the dark palette as hex. Satori does not read the
 * stylesheet, and it does not parse `oklch`, so the tokens cannot be reused
 * here — these are the same four values converted. Change one in `globals.css`
 * and this file has to follow.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#0d0e10",
          color: "#e5e6e8",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", fontSize: 88, letterSpacing: -2 }}>
          {site.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 34,
            color: "#909295",
          }}
        >
          {site.tagline}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            height: 6,
            width: 160,
            background: "#e3956c",
          }}
        />
      </div>
    ),
    size,
  );
}
