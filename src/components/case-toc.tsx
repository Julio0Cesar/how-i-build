"use client";

import { useEffect, useState } from "react";

import type { TocItem } from "@/lib/toc";

export function CaseToc({
  items,
  label,
  className = "",
}: {
  items: TocItem[];
  label: string;
  className?: string;
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const ids = items.map((item) => item.id);
    if (ids.length === 0) return;

    /**
     * Scroll position rather than IntersectionObserver. The observer callback
     * only receives sections whose intersection changed, so "most visible" was
     * being decided from a partial set; and `intersectionRatio` is relative to
     * each element's own height, so a long section and a short one were never
     * comparable. The last section also never reached the detection band —
     * the page ran out of scroll first, which is why it never activated.
     */
    function update() {
      const doc = document.documentElement;
      const atBottom =
        window.innerHeight + window.scrollY >= doc.scrollHeight - 2;
      if (atBottom) {
        setActive(ids[ids.length - 1]!);
        return;
      }

      const line = window.innerHeight * 0.3;
      let current = ids[0]!;
      for (const id of ids) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= line) {
          current = id;
        }
      }
      setActive(current);
    }

    // Deferred so the first read is not a setState inside the effect body.
    const frame = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  return (
    <nav aria-label={label} className={className}>
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <ul className="mt-4 space-y-2 border-l border-rule">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`-ml-px block border-l py-0.5 pl-4 text-sm transition-colors ${
                  isActive
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-accent"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
