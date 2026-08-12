import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
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
