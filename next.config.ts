import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  experimental: {
    /**
     * A URL that matches no route needs its own document here. The root layout
     * lives inside `[locale]`, so Next has no params to resolve an ordinary
     * not-found boundary against — the framework names that case as the reason
     * this flag exists. Experimental as of 16.3.
     */
    globalNotFound: true,
  },
};

/**
 * Plugins are named by string because Turbopack runs them in Rust and cannot
 * receive JavaScript functions. `rehype-slug` gives every heading a stable id;
 * the table of contents derives the same ids with `github-slugger`, so both
 * sides agree without a custom plugin. `rehype-highlight` marks code tokens
 * with classes at build time, so no highlighter ships to the browser; the
 * colours live in globals.css.
 */
const withMDX = createMDX({
  options: {
    /* Sem o gfm, uma tabela em markdown sai como texto com barras verticais. */
    remarkPlugins: [["remark-gfm"]],
    rehypePlugins: [["rehype-slug"], ["rehype-highlight", { detect: false }]],
  },
});

export default withMDX(nextConfig);
