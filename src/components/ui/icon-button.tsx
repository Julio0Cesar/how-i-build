import type { ComponentProps, ReactNode } from "react";

const sizes = {
  sm: "size-8",
  md: "size-10",
};

type IconButtonProps = Omit<
  ComponentProps<"button">,
  "children" | "aria-label"
> & {
  /**
   * The accessible name. Required, and `aria-label` is removed from the props
   * it accepts, so a nameless icon button cannot be written — an icon alone
   * reads as "button" and nothing else to a screen reader.
   */
  label: string;
  children: ReactNode;
  /**
   * A prop rather than something to pass through `className`. Tailwind orders
   * utilities of the same kind by value, so `size-10` from here would always
   * beat a `size-8` sent by a caller — silently, with no warning and no visible
   * error.
   */
  size?: keyof typeof sizes;
  /**
   * `data-*` passes through. React's prop types allow these only on intrinsic
   * elements, and a primitive needs them for state a stylesheet decides.
   */
  [key: `data-${string}`]: string | undefined;
};

export function IconButton({
  label,
  size = "md",
  className = "",
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      {...props}
      className={`inline-flex ${sizes[size]} items-center justify-center border border-rule transition-colors hover:border-accent hover:text-accent ${className}`.trim()}
    >
      {children}
    </button>
  );
}
