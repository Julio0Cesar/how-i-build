"use client";

import { useEffect, useState } from "react";

/**
 * Measured from scroll position rather than an observer. #12 taught the reason:
 * an `IntersectionObserver` callback only reports what changed, which leaves
 * gaps exactly where a continuous reading is needed.
 *
 * `null` means the page fits the viewport. A bar that can never move is worse
 * than none — it reads as broken.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    function update() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;

      if (scrollable <= 0) {
        setProgress(null);
        return;
      }

      setProgress(Math.min(1, Math.max(0, window.scrollY / scrollable)));
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
  }, []);

  if (progress === null) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-14 z-40 h-0.5 sm:top-16"
    >
      {/* A transform rather than a width: it never touches layout. */}
      <div
        className="h-full origin-left bg-accent"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
