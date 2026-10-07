import { slug } from "github-slugger";

const rowClass =
  "mt-16 flex scroll-mt-28 flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-foreground pt-5 first:mt-0";

/**
 * An entry heading with its date on the opposite edge.
 *
 * The id comes from `slug()`, the same function the table of contents uses, so
 * both sides agree without a plugin — which Turbopack could not run anyway.
 * Two entries with the same title in one case would collide; `rehype-slug`
 * would disambiguate them, this does not.
 */
export function Entry({ title, date }: { title: string; date?: string }) {
  return (
    <h2 id={slug(title)} className={rowClass}>
      <span className="font-sans text-[1.75rem] font-bold leading-[1.15] tracking-[-0.022em]">{title}</span>
      {date ? (
        <time
          dateTime={date}
          className="stamp text-accent"
        >
          {date}
        </time>
      ) : null}
    </h2>
  );
}
