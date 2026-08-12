"use client";

import { useEffect, useState } from "react";

export type TocItem = { id: string; label: string };

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
    const nodes = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (nodes.length === 0) return;

    /**
     * The margins ignore the top fifth and bottom half of the viewport, so the
     * active entry follows what is being read rather than whatever has just
     * touched the edge of the screen.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const id = visible[0]?.target.id;
        if (id) setActive(id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
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
