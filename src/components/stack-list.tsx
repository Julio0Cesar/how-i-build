import { monochromeIcons, stackIcons } from "@/config/icons";

/**
 * Icons when the config provides a path, text otherwise. The template ships no
 * paths, so it renders text and carries no third-party marks; a fork fills the
 * map and gets icons without touching a component.
 */
export function StackList({ stack }: { stack: string[] }) {
  if (stack.length === 0) return null;

  return (
    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
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
          // eslint-disable-next-line @next/next/no-img-element -- a local SVG needs no optimisation pipeline
          <img
            key={name}
            src={src}
            alt={name}
            title={name}
            className={`size-4 object-contain opacity-70 transition-opacity group-hover:opacity-100 ${
              monochromeIcons.has(name) ? "dark:invert" : ""
            }`}
          />
        );
      })}
    </span>
  );
}
