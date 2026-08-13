import { monochromeIcons, stackIcons } from "@/config/icons";

/**
 * Icons when the config provides a path, text otherwise. The template ships no
 * paths, so it renders text and carries no third-party marks; a fork fills the
 * map and gets icons without touching a component.
 *
 * The tooltip is CSS only. A `title` attribute would work and would arrive
 * after the browser's own delay, in the browser's own styling.
 */
export function StackList({ stack }: { stack: string[] }) {
  if (stack.length === 0) return null;

  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {stack.map((name, index) => {
        const src = stackIcons[name];

        if (!src) {
          return (
            <span key={name}>
              {name}
              {index < stack.length - 1 ? " ·" : null}
            </span>
          );
        }

        return (
          <span key={name} className="group/icon relative inline-flex">
            {/* eslint-disable-next-line @next/next/no-img-element -- a local SVG needs no optimisation pipeline */}
            <img
              src={src}
              alt={name}
              className={`size-4 object-contain opacity-60 transition-[opacity,transform] duration-200 group-hover/icon:scale-125 group-hover/icon:opacity-100 ${
                monochromeIcons.has(name) ? "dark:invert" : ""
              }`}
            />
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap border border-rule bg-background px-2 py-1 font-mono text-[0.65rem] normal-case tracking-wide text-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover/icon:translate-y-0 group-hover/icon:opacity-100"
            >
              {name}
            </span>
          </span>
        );
      })}
    </span>
  );
}
