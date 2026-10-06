"use client";

import { NotebookPen, Package, Signpost, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { LogEntry, LogKind } from "@/lib/log";
import { ProjectMark } from "./project-mark";

/**
 * Each kind is a glyph, not a word: a pen for something written, a signpost
 * for a call that was made, a package for something shipped. The decision
 * carries the accent because it is the point of a case.
 */
const kinds: Record<LogKind, { Icon: LucideIcon; tone: string }> = {
  post: { Icon: NotebookPen, tone: "text-muted-foreground" },
  decision: { Icon: Signpost, tone: "text-accent" },
  release: { Icon: Package, tone: "text-muted-foreground" },
};

/** How many entries arrive at a time. */
const PAGE = 8;

/**
 * The site as dated streams, one kind at a time. Switching is state, not a
 * route: every entry is already on the page, so the index stays one static
 * document. Entries are drawn a page at a time; the next page is asked for
 * once the reader passes two thirds of what is drawn.
 */
export function Log({
  entries,
  locale,
  labels,
  show,
}: {
  entries: LogEntry[];
  locale: string;
  labels: Dictionary["log"] & { minutes: string };
  /** The kinds this view offers, the first one open. */
  show: LogKind[];
}) {
  const [filter, setFilter] = useState<LogKind>(show[0]!);
  const [visible, setVisible] = useState(PAGE);
  const trigger = useRef<HTMLLIElement>(null);

  const counts = useMemo(() => {
    const result: Record<LogKind, number> = { post: 0, decision: 0, release: 0 };
    for (const entry of entries) result[entry.kind] += 1;
    return result;
  }, [entries]);

  const shown = useMemo(
    () => entries.filter((entry) => entry.kind === filter),
    [entries, filter],
  );
  const drawn = shown.slice(0, visible);
  const triggerAt = Math.floor((drawn.length * 2) / 3);
  const more = visible < shown.length;

  useEffect(() => {
    const element = trigger.current;
    if (!element || !more) return;
    const observer = new IntersectionObserver((records) => {
      if (records.some((record) => record.isIntersecting)) {
        setVisible((count) => count + PAGE);
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [more, visible, filter]);

  const format = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }),
    [locale],
  );
  const date = (iso: string) => format.format(new Date(`${iso}T00:00:00Z`));

  return (
    <div>
      {show.length > 1 ? (
        <div
          role="group"
          aria-label={labels.filter}
          className="sticky top-14 z-20 -mx-4 flex items-center border-b border-rule bg-background px-4 py-3 sm:top-16 sm:mx-0 sm:px-0"
        >
          <div className="inline-flex border border-rule">
            {show.map((value) => {
              const active = value === filter;
              const { Icon } = kinds[value];
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={active}
                  aria-label={labels[value]}
                  title={labels[value]}
                  onClick={() => {
                    setFilter(value);
                    setVisible(PAGE);
                  }}
                  disabled={!active && counts[value] === 0}
                  className={`flex h-9 items-center gap-2 border-l border-rule px-3 text-sm font-medium transition-colors first:border-l-0 disabled:opacity-35 ${
                    active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {/* Only the open one is named; the others read from their
                      glyph and are named on hover. */}
                  {active ? <span aria-hidden="true">{labels[value]}</span> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {shown.length === 0 ? (
        <p className="max-w-[48ch] py-16 text-muted-foreground">
          {filter === "release" ? labels.emptyReleases : labels.empty}
        </p>
      ) : filter === "post" ? (
        <ul className="grid gap-x-8 gap-y-14 pt-8 sm:grid-cols-2">
          {drawn.map((entry, position) => (
            <li key={entry.href} ref={position === triggerAt ? trigger : undefined}>
              <Link href={entry.href} className="group block">
                {entry.cover ? (
                  <div className="mb-5 aspect-[3/2] overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element -- content image, sized by the layout rather than by a pipeline */}
                    <img
                      src={entry.cover}
                      alt={entry.coverAlt ?? ""}
                      loading={position < 2 ? "eager" : "lazy"}
                      className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    />
                  </div>
                ) : null}
                {entry.tags?.[0] ? (
                  <p className="text-sm font-semibold text-accent">{entry.tags[0]}</p>
                ) : null}
                <h2 className="mt-1.5 text-xl font-bold leading-snug tracking-tight text-balance transition-colors group-hover:text-accent">
                  {entry.title}
                </h2>
                {entry.summary ? (
                  <p className="mt-2 line-clamp-3 leading-relaxed text-muted-foreground">
                    {entry.summary}
                  </p>
                ) : null}
                <p className="mt-3 flex items-center gap-x-3 text-sm text-muted-foreground">
                  <time dateTime={entry.date}>{date(entry.date)}</time>
                  {entry.minutes ? (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>
                        {entry.minutes} {labels.minutes}
                      </span>
                    </>
                  ) : null}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <ol className="divide-y divide-rule">
          {drawn.map((entry, position) => {
            const { Icon, tone } = kinds[entry.kind];
            return (
              <li key={entry.href} ref={position === triggerAt ? trigger : undefined}>
                <Link
                  href={entry.href}
                  className="group grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-4 py-7"
                >
                  <span className={`pt-1 ${tone}`} title={labels.kind[entry.kind]}>
                    <Icon className="size-5" aria-hidden="true" />
                    <span className="sr-only">{labels.kind[entry.kind]}</span>
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-2xl font-bold leading-snug tracking-tight text-balance transition-colors group-hover:text-accent">
                      {entry.title}
                    </h2>
                    <p className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-muted-foreground">
                      {entry.series ? (
                        <span className="inline-flex items-center gap-1.5 text-foreground">
                          <ProjectMark name={entry.series} src={entry.mark} className="size-5" />
                          {entry.series}
                        </span>
                      ) : null}
                      <time dateTime={entry.date}>{date(entry.date)}</time>
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      )}

      {more ? (
        <p role="status" className="py-10 text-center">
          <span className="sr-only">{labels.more}</span>
          <span aria-hidden="true" className="inline-flex gap-1.5">
            <span className="size-1.5 animate-pulse bg-muted-foreground" />
            <span className="size-1.5 animate-pulse bg-muted-foreground [animation-delay:150ms]" />
            <span className="size-1.5 animate-pulse bg-muted-foreground [animation-delay:300ms]" />
          </span>
        </p>
      ) : null}
    </div>
  );
}
