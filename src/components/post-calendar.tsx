"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { PostDay } from "@/lib/calendar";

/**
 * Month navigation without routes: every date is already on the page, so
 * changing month is state rather than a request. It also keeps the blog index
 * a single static document.
 */
export function PostCalendar({
  days,
  locale,
  label,
}: {
  days: PostDay[];
  locale: string;
  label: string;
}) {
  const byDate = useMemo(() => {
    const map = new Map<string, PostDay>();
    for (const day of days) map.set(day.date, day);
    return map;
  }, [days]);

  const bounds = useMemo(() => {
    const first = days[0]?.date ?? "";
    const last = days[days.length - 1]?.date ?? "";
    return { first: first.slice(0, 7), last: last.slice(0, 7) };
  }, [days]);

  const [month, setMonth] = useState(bounds.last);

  if (days.length === 0) return null;

  const [year, monthNumber] = month.split("-").map(Number);
  const cursor = new Date(Date.UTC(year!, monthNumber! - 1, 1));

  const monthName = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(cursor);

  const daysInMonth = new Date(Date.UTC(year!, monthNumber!, 0)).getUTCDate();
  // Monday first, which is what the ISO week and the reference both use.
  const offset = (cursor.getUTCDay() + 6) % 7;

  const weekdays = Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { weekday: "narrow", timeZone: "UTC" }).format(
      new Date(Date.UTC(2024, 0, 1 + index)),
    ),
  );

  function shift(by: number) {
    const next = new Date(Date.UTC(year!, monthNumber! - 1 + by, 1));
    setMonth(
      `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}`,
    );
  }

  const meta = "font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground";

  return (
    <section aria-label={label}>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label={`${label}: -1`}
          disabled={month <= bounds.first}
          onClick={() => shift(-1)}
          className="text-muted-foreground transition-colors hover:text-accent disabled:opacity-30 disabled:hover:text-muted-foreground"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
        <p className={meta}>{monthName}</p>
        <button
          type="button"
          aria-label={`${label}: +1`}
          disabled={month >= bounds.last}
          onClick={() => shift(1)}
          className="text-muted-foreground transition-colors hover:text-accent disabled:opacity-30 disabled:hover:text-muted-foreground"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {weekdays.map((day, index) => (
          <span key={index} className={meta}>
            {day}
          </span>
        ))}

        {Array.from({ length: offset }, (_, index) => (
          <span key={`blank-${index}`} />
        ))}

        {Array.from({ length: daysInMonth }, (_, index) => {
          const number = index + 1;
          const iso = `${month}-${String(number).padStart(2, "0")}`;
          const post = byDate.get(iso);

          return post ? (
            <Link
              key={iso}
              href={post.href}
              title={post.title}
              className="bg-accent-soft py-1 font-mono text-xs text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {number}
            </Link>
          ) : (
            <span key={iso} className="py-1 font-mono text-xs text-muted-foreground/50">
              {number}
            </span>
          );
        })}
      </div>
    </section>
  );
}
