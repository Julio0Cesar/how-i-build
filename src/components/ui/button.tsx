import type { ComponentProps } from "react";

/**
 * `className` is for layout only — margins, responsive visibility. Passing a
 * conflicting colour or border here is unreliable: without a class-merging
 * helper the winner is decided by stylesheet order, not by the order of the
 * attribute.
 */
export function Button({ className = "", ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      {...props}
      className={`border border-rule px-2 py-1 text-sm transition-colors hover:border-accent hover:text-accent ${className}`.trim()}
    />
  );
}
