import { slug } from "github-slugger";
import Link from "next/link";
import { localeHref, type Locale } from "@/i18n/config";

/** Nothing at all when a post has no tags — not an empty row. */
export function TagChips({ tags, locale }: { tags: string[]; locale: Locale }) {
  if (tags.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((label) => (
        <li key={label}>
          <Link
            href={localeHref(locale, `/blog/tags/${slug(label)}`)}
            className="inline-flex items-center gap-1.5 border border-rule px-2 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground transition-colors hover:border-accent hover:text-accent"
          >
            <span aria-hidden="true" className="size-1 rounded-full bg-accent" />
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
