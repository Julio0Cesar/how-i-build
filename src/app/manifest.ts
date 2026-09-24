import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/**
 * Served at `/manifest.webmanifest`. It is what lets the site be installed as
 * an app, and what gives that window its name and icon.
 *
 * The maskable icon is a separate file on purpose: the system crops up to 20%
 * of each side, and the rounded-corner icon would lose its frame.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.tagline,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#121214",
    theme_color: "#121214",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
