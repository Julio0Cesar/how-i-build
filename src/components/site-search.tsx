"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { SearchEntry } from "@/lib/search";
import { IconButton } from "./ui/icon-button";

const label = "font-mono text-xs uppercase tracking-widest text-muted-foreground";

function matches(entry: SearchEntry, query: string) {
  const haystack = `${entry.title} ${entry.summary}`.toLowerCase();
  // Every word must appear, in any order and anywhere — not a phrase match.
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

export function SiteSearch({
  index,
  labels,
  onOpen,
}: {
  index: SearchEntry[];
  labels: Dictionary["search"];
  /** Lets the mobile menu close itself when the search takes over the screen. */
  onOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      // The convention every editor and half the web already trained people on.
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onOpen?.();
        setOpen((value) => !value);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpen]);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  const results = useMemo(
    () => (query.trim() ? index.filter((entry) => matches(entry, query)) : []),
    [index, query],
  );

  const groups = [
    { key: "post" as const, title: labels.posts },
    { key: "project" as const, title: labels.projects },
  ];

  return (
    <>
      <IconButton
        label={labels.open}
        size="sm"
        onClick={() => {
          onOpen?.();
          setOpen(true);
        }}
      >
        <Search className="size-4" aria-hidden="true" />
      </IconButton>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 px-4 pt-24 backdrop-blur-sm">
          {/* Clicking away closes, which is what everyone expects of an overlay. */}
          <button
            type="button"
            aria-label={labels.close}
            className="absolute inset-0 cursor-default"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-full max-w-xl border border-rule bg-background">
            <div className="flex items-center gap-3 border-b border-rule px-4">
              <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                ref={input}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={labels.placeholder}
                aria-label={labels.placeholder}
                className="w-full bg-transparent py-4 outline-none placeholder:text-muted-foreground"
              />
              <IconButton label={labels.close} size="sm" onClick={() => setOpen(false)}>
                <X className="size-4" aria-hidden="true" />
              </IconButton>
            </div>

            {query.trim() ? (
              <div className="max-h-[60vh] overflow-y-auto">
                {results.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-muted-foreground">
                    {labels.empty}
                  </p>
                ) : (
                  groups.map((group) => {
                    const found = results.filter((entry) => entry.kind === group.key);
                    if (found.length === 0) return null;

                    return (
                      <div key={group.key} className="border-b border-rule last:border-b-0">
                        <p className={`px-4 pt-4 ${label}`}>{group.title}</p>
                        <ul className="py-2">
                          {found.map((entry) => (
                            <li key={entry.href}>
                              <Link
                                href={entry.href}
                                onClick={() => setOpen(false)}
                                className="block px-4 py-2 transition-colors hover:bg-muted"
                              >
                                <span className="block leading-snug">{entry.title}</span>
                                <span className="mt-1 block line-clamp-1 text-sm text-muted-foreground">
                                  {entry.summary}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })
                )}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
