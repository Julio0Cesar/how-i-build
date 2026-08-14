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
 * sides agree without a custom plugin.
 */
const withMDX = createMDX({
  options: {
    rehypePlugins: [["rehype-slug"]],
  },
});

export default withMDX(nextConfig);
