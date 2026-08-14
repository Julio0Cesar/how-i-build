import type { ComponentType } from "react";
import type { Locale } from "@/i18n/config";

export type ProjectStatus = "in-dev" | "prod" | "archived";
export type ProjectVisibility = "public" | "private";

/** Exported by each MDX file as `meta`, so TypeScript checks it. */
export interface CaseMeta {
  name: string;
  summary: string;
  role: string;
  period: string;
  /** ISO date `YYYY-MM-DD` — drives ordering on the home page. */
  updatedAt?: string;
  references?: { label: string; url: string }[];
}

export interface Case {
  meta: CaseMeta;
  Body: ComponentType;
}

export interface Project {
  slug: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  stack: string[];
  /** Path to a mark under `public/`. Without it the card falls back to initials. */
  markUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
  /** Listed, with no write-up behind it — the body of its case is empty. */
  stub?: boolean;
  /**
   * A record rather than a lookup: a missing locale is a type error, and the
   * static import behind each entry means a missing file is a build error.
   */
  cases: Record<Locale, Case>;
}

export interface PostMeta {
  title: string;
  summary: string;
  /** ISO date `YYYY-MM-DD`. Orders the index and drives previous/next. */
  publishedAt: string;
  /** Optional. When set, `coverAlt` is required — enforced when the post loads. */
  coverUrl?: string;
  coverAlt?: string;
  /** Localized: a post can carry different words in each language. */
  tags?: string[];
}

export interface PostContent {
  meta: PostMeta;
  Body: ComponentType;
}

export interface Post {
  slug: string;
  locales: Record<Locale, PostContent>;
}

export interface Profile {
  name: string;
  location: Record<Locale, string>;
  role: Record<Locale, string>;
  intro: Record<Locale, ComponentType>;
}
