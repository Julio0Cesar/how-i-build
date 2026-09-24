import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/**
 * Servido em `/manifest.webmanifest`. É o que permite instalar o site como app
 * e o que dá nome e ícone à janela quando alguém faz isso.
 *
 * O `maskable` é um arquivo separado de propósito: o sistema recorta até 20% de
 * cada lado, e o ícone normal, com cantos arredondados, perderia a moldura.
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
