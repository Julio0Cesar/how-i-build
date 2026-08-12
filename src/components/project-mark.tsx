/**
 * Initials rather than a logo. A per-project mark would mean an asset per
 * project — which is content, and would leave the template with an empty
 * square. This works for any project anyone adds, with nothing to draw.
 */
export function ProjectMark({ name }: { name: string }) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = (
    words.length > 1
      ? `${words[0]![0]}${words[1]![0]}`
      : (words[0]?.slice(0, 2) ?? "?")
  ).toUpperCase();

  return (
    <span
      aria-hidden="true"
      className="flex size-10 shrink-0 items-center justify-center border border-rule font-mono text-xs tracking-widest text-muted-foreground transition-colors group-hover:border-accent group-hover:text-accent"
    >
      {initials}
    </span>
  );
}
