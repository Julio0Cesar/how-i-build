/**
 * A mark when the project provides one, initials otherwise. Initials need no
 * asset, so the template and any project added later have something to show
 * without anyone drawing anything.
 */
export function ProjectMark({ name, src }: { name: string; src?: string }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- a local SVG needs no optimisation pipeline
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="size-10 shrink-0 object-contain"
      />
    );
  }

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
