"use client";

/**
 * The class on <html> is the source of truth, and the inline script in the
 * layout has already set it before first paint. There is no React state here
 * on purpose: state would start out wrong on the server and correct itself
 * during hydration, which is the flash this component exists to avoid.
 *
 * Both labels are rendered and CSS picks one. `display: none` also removes the
 * hidden one from the accessibility tree, so the button's accessible name
 * follows the theme without an aria-label that JavaScript would have to keep
 * in sync.
 */
export function ThemeToggle({
  labels,
}: {
  labels: { toDark: string; toLight: string };
}) {
  function toggle() {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      window.localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      // Storage can be blocked; the theme still applies for this page view.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="border border-rule px-2 py-1 text-sm transition-colors hover:border-accent hover:text-accent"
    >
      <span className="dark:hidden">{labels.toDark}</span>
      <span className="hidden dark:inline">{labels.toLight}</span>
    </button>
  );
}
