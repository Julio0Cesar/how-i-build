import { slug } from "github-slugger";

const rowClass =
  "mt-14 flex scroll-mt-24 flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-rule pt-10 first:mt-0 first:border-t-0 first:pt-0";

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
      <span className="font-serif text-xl tracking-tight">{title}</span>
      {date ? (
        <time
          dateTime={date}
          className="font-mono text-[0.65rem] tracking-widest text-muted-foreground"
        >
          {date}
        </time>
      ) : null}
    </h2>
  );
}
