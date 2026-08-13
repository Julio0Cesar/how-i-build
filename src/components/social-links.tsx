import { monochromeIcons, socialIcons } from "@/config/icons";
import { site } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Text rather than icons: Lucide dropped its brand icons, and shipping GitHub
 * and LinkedIn marks in the template would put third-party trademarks in a
 * repository other people clone. The list is data so an `icon` field can be
 * added without touching the markup.
 */
export function SocialLinks({ dict }: { dict: Dictionary }) {
  const items = [
    {
      key: "github" as const,
      label: dict.social.github,
      href: site.socials.github,
    },
    {
      key: "linkedin" as const,
      label: dict.social.linkedin,
      href: site.socials.linkedin,
    },
    {
      key: "email" as const,
      label: dict.social.email,
      href: `mailto:${site.socials.email}`,
    },
  ];

  return (
    <ul className="flex flex-wrap items-center gap-4">
      {items.map((item) => {
        const external = !item.href.startsWith("mailto:");
        return (
          <li key={item.key}>
            <a
              href={item.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer noopener" : undefined}
              aria-label={socialIcons[item.key] ? item.label : undefined}
              title={socialIcons[item.key] ? item.label : undefined}
              className="group flex items-center font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent"
            >
              {socialIcons[item.key] ? (
                // eslint-disable-next-line @next/next/no-img-element -- a local SVG needs no optimisation pipeline
                <img
                  src={socialIcons[item.key]}
                  alt=""
                  aria-hidden="true"
                  className={`size-5 object-contain opacity-70 transition-opacity group-hover:opacity-100 ${
                    monochromeIcons.has(item.key) ? "dark:invert" : ""
                  }`}
                />
              ) : (
                item.label
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
