"use client";

import { List, NotebookPen, Package, Signpost, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { type CSSProperties, useMemo, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { LogEntry, LogKind } from "@/lib/log";
import { ProjectMark } from "./project-mark";

type Filter = "all" | LogKind;

const filters: Filter[] = ["all", "post", "decision", "release"];

/**
 * Each kind is a glyph, not a word: a pen for something written, a signpost
 * for a call that was made, a package for something shipped. The decision
 * carries the accent because it is the point of a case.
 */
const kinds: Record<Filter, { Icon: LucideIcon; tone: string }> = {
  all: { Icon: List, tone: "" },
  post: { Icon: NotebookPen, tone: "text-muted-foreground" },
  decision: { Icon: Signpost, tone: "text-accent" },
  release: { Icon: Package, tone: "text-muted-foreground" },
};

/**
 * The whole site as one dated stream, newest first. Filtering is state,
 * not a route: every entry is already on the page, and the index stays a
 * single static document.
 */
export function Log({
  entries,
  locale,
  labels,
  initial = "all",
}: {
  entries: LogEntry[];
  locale: string;
  labels: Dictionary["log"];
  initial?: Filter;
}) {
  const [filter, setFilter] = useState<Filter>(initial);

  const counts = useMemo(() => {
    const result: Record<Filter, number> = { all: entries.length, post: 0, decision: 0, release: 0 };
    for (const entry of entries) result[entry.kind] += 1;
    return result;
  }, [entries]);

  const shown = useMemo(
    () => (filter === "all" ? entries : entries.filter((entry) => entry.kind === filter)),
    [entries, filter],
  );

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

  let index = 0;

  return (
    <div>
      <div
        role="group"
        aria-label={labels.filter}
        className="sticky top-14 z-20 -mx-4 flex items-center border-b border-rule bg-background px-4 py-3 sm:top-16 sm:mx-0 sm:px-0"
      >
        <div className="inline-flex border border-rule">
          {filters.map((value) => {
            const active = value === filter;
            const { Icon } = kinds[value];
            const empty = value !== "all" && counts[value] === 0;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                aria-label={labels[value]}
                title={labels[value]}
                onClick={() => setFilter(value)}
                disabled={!active && empty}
                className={`flex h-9 items-center gap-2 border-l border-rule px-3 text-sm font-medium transition-colors first:border-l-0 disabled:opacity-35 ${
                  active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {/* The name shows only on the one that is on: the others are
                    read from their glyph, and named on hover. */}
                {active ? <span aria-hidden="true">{labels[value]}</span> : null}
              </button>
            );
          })}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="max-w-[48ch] py-16 text-muted-foreground">
          {filter === "release" ? labels.emptyReleases : labels.empty}
        </p>
      ) : (
        <ol className="divide-y divide-rule">
          {shown.map((entry) => (
            <li
              key={`${entry.kind}-${entry.href}`}
              className="log-row"
              style={{ "--i": index++ } as CSSProperties}
            >
              <Link
                href={entry.href}
                className="group grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-4 py-7"
              >
                {(() => {
                  const { Icon, tone } = kinds[entry.kind];
                  return (
                    <span className={`pt-1 ${tone}`} title={labels.kind[entry.kind]}>
                      <Icon className="size-5" aria-hidden="true" />
                      <span className="sr-only">{labels.kind[entry.kind]}</span>
                    </span>
                  );
                })()}
                <div className="min-w-0">
                  <h2 className="text-2xl font-bold leading-snug tracking-tight text-balance transition-colors group-hover:text-accent">
                    {entry.title}
                  </h2>
                  {entry.summary ? (
                    <p className="mt-2 max-w-[60ch] leading-relaxed text-muted-foreground">
                      {entry.summary}
                    </p>
                  ) : null}
                  <p className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-muted-foreground">
                    {entry.series ? (
                      <span className="inline-flex items-center gap-1.5 text-foreground">
                        <ProjectMark
                          name={entry.series}
                          src={entry.mark}
                          className="size-5 text-[0.55rem]"
                        />
                        {entry.series}
                      </span>
                    ) : null}
                    <time dateTime={entry.date}>
                      {format.format(new Date(`${entry.date}T00:00:00Z`))}
                    </time>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
