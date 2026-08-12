import type { ComponentProps, ReactNode } from "react";

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
   * `data-*` passes through. React's prop types allow these only on intrinsic
   * elements, and a primitive needs them for state a stylesheet decides.
   */
  [key: `data-${string}`]: string | undefined;
};

export function IconButton({
  label,
  className = "",
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      {...props}
      className={`inline-flex size-10 items-center justify-center border border-rule transition-colors hover:border-accent hover:text-accent ${className}`.trim()}
    >
      {children}
    </button>
  );
}
