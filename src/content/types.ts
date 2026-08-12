import type { Locale } from "@/i18n/config";

/**
 * A run of text, optionally a link or inline code.
 *
 * `href` is written locale-agnostic — `/projects/foo`, never `/pt/projects/foo`.
 * The renderer adds the current locale, so content never has to know which
 * languages exist.
 */
export type TextSegment = {
  text: string;
  href?: string;
  code?: boolean;
};

/** A block says what it is, so the renderer picks the element. */
export type RichBlock =
  | { kind: "paragraph"; segments: TextSegment[] }
  | { kind: "list"; items: TextSegment[][] };

export interface Decision {
  title: string;
  /** ISO date `YYYY-MM-DD`, shown on the row. */
  updatedAt: string;
  context: RichBlock[];
  decision: RichBlock[];
  /** Always rendered as a list — the shape of the field is its meaning. */
  tradeoffs: TextSegment[][];
}

export interface Challenge {
  title: string;
  body: RichBlock[];
  updatedAt?: string;
}

export type ProjectStatus = "in-dev" | "prod" | "archived";
export type ProjectVisibility = "public" | "private";

export interface LocalizedProject {
  name: string;
  summary: string;
  role: string;
  period: string;
  /** Section-level last updates (`YYYY-MM-DD`). */
  updated: {
    problem?: string;
    decisions?: string;
    challenges?: string;
    outcome?: string;
    references?: string;
  };
  problem: RichBlock[];
  decisions: Decision[];
  challenges: Challenge[];
  outcome: RichBlock[];
  references?: { label: string; url: string }[];
}

export interface Project {
  slug: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  stack: string[];
  liveUrl?: string;
  repoUrl?: string;
  /** Listed, but with no write-up behind it yet. */
  stub?: boolean;
  locales: Record<Locale, LocalizedProject>;
}

export interface Profile {
  name: string;
  location: Record<Locale, string>;
  role: Record<Locale, string>;
  intro: Record<Locale, RichBlock[]>;
}

export function plain(text: string): TextSegment[] {
  return [{ text }];
}

export function paragraph(segments: TextSegment[]): RichBlock {
  return { kind: "paragraph", segments };
}

export function list(items: TextSegment[][]): RichBlock {
  return { kind: "list", items };
}
