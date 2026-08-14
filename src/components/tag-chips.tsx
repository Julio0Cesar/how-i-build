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
            className="inline-flex items-center gap-1.5 rounded-sm rounded-l-none bg-muted py-1 pl-3 pr-2.5 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground transition-colors before:absolute before:-left-2 before:top-1/2 before:size-0 before:-translate-y-1/2 before:border-y-[0.85rem] before:border-r-[0.5rem] before:border-y-transparent before:border-r-[var(--color-muted)] before:content-[''] hover:bg-accent-soft hover:text-accent hover:before:border-r-[var(--color-accent-soft)] relative ml-2"
          >
            <span aria-hidden="true" className="size-1 rounded-full bg-current opacity-60" />
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
