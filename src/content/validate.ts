import type { CaseMeta, PostMeta } from "./types";

/**
 * `tsc` does not read `.mdx`, so a metadata block is never type-checked where
 * it is written. These run when the content index is evaluated — during the
 * build — and fail it with the file that is wrong, instead of letting an
 * `undefined` reach a page.
 */

function text(raw: Record<string, unknown>, field: string, source: string): string {
  const value = raw[field];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${source}: meta.${field} must be a non-empty string`);
  }
  return value;
}

function optionalText(
  raw: Record<string, unknown>,
  field: string,
  source: string,
): string | undefined {
  const value = raw[field];
  if (value === undefined) return undefined;
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${source}: meta.${field} must be a non-empty string when present`);
  }
  return value;
}

function object(raw: unknown, source: string): Record<string, unknown> {
  if (typeof raw !== "object" || raw === null) {
    throw new Error(`${source}: expected an exported \`meta\` object`);
  }
  return raw as Record<string, unknown>;
}

export function caseMeta(raw: unknown, source: string): CaseMeta {
  const value = object(raw, source);
  return {
    name: text(value, "name", source),
    summary: text(value, "summary", source),
    role: text(value, "role", source),
    period: text(value, "period", source),
    updatedAt: optionalText(value, "updatedAt", source),
    references: value.references as CaseMeta["references"],
  };
}

export function postMeta(raw: unknown, source: string): PostMeta {
  const value = object(raw, source);
  const coverUrl = optionalText(value, "coverUrl", source);
  const coverAlt = optionalText(value, "coverAlt", source);

  if (coverUrl && !coverAlt) {
    throw new Error(
      `${source}: meta.coverAlt is required when meta.coverUrl is set — an image with no description is invisible to a screen reader`,
    );
  }

  const tags = value.tags;
  if (tags !== undefined) {
    if (
      !Array.isArray(tags) ||
      tags.some((tag) => typeof tag !== "string" || tag.trim() === "")
    ) {
      throw new Error(`${source}: meta.tags must be an array of non-empty strings`);
    }
  }

  return {
    title: text(value, "title", source),
    summary: text(value, "summary", source),
    publishedAt: text(value, "publishedAt", source),
    coverUrl,
    coverAlt,
    tags: tags as string[] | undefined,
  };
}
