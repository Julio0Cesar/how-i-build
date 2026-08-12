"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { IconButton } from "./ui/icon-button";

type Choice = "light" | "dark" | "system";

declare global {
  interface Window {
    __theme?: { set: (choice: Choice) => void };
  }
}

const options = [
  { choice: "light" as const, Icon: Sun },
  { choice: "dark" as const, Icon: Moon },
  { choice: "system" as const, Icon: Monitor },
];

/** The DOM is the store: the inline script owns the value, this only reads it. */
function subscribe(onChange: () => void) {
  window.addEventListener("themechoice", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("themechoice", onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): Choice {
  const value = document.documentElement.dataset.themeChoice;
  return value === "light" || value === "dark" ? value : "system";
}

function getServerSnapshot(): Choice | null {
  return null;
}

export function ThemeSelect({ labels }: { labels: Dictionary["theme"] }) {
  /**
   * Which option is highlighted is decided by CSS, from the attribute the
   * inline script wrote before first paint — so the visual state is correct
   * with no JavaScript at all.
   *
   * `aria-pressed` cannot work that way: it is an attribute, and the server
   * does not know the choice, which is why the server snapshot is null.
   * Sighted readers get the right state immediately; screen readers get it once
   * this hydrates. Closing that gap would mean rendering per request, which is
   * what the theme mechanism exists to avoid.
   */
  const choice = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div role="group" aria-label={labels.group} className="flex items-center">
      {options.map(({ choice: value, Icon }) => (
        <IconButton
          key={value}
          label={labels[value]}
          data-choice={value}
          aria-pressed={choice === null ? undefined : choice === value}
          onClick={() => window.__theme?.set(value)}
          className="size-8 border-l-0 first:border-l"
        >
          <Icon className="size-3.5" aria-hidden="true" />
        </IconButton>
      ))}
    </div>
  );
}
