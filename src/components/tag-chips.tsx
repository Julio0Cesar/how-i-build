import { slug } from "github-slugger";
import Link from "next/link";
import { localeHref, type Locale } from "@/i18n/config";

/** Nothing at all when a post has no tags — not an empty row. */
export function TagChips({ tags, locale }: { tags: string[]; locale: Locale }) {
  if (tags.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
      {tags.map((label) => (
        <li key={label}>
          <Link
            href={localeHref(locale, `/blog/tags/${slug(label)}`)}
            className="data text-xs text-muted-foreground transition-colors hover:text-accent"
          >
            #{label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
