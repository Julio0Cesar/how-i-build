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
    { key: "github", label: dict.social.github, href: site.socials.github },
    { key: "linkedin", label: dict.social.linkedin, href: site.socials.linkedin },
    {
      key: "email",
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
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent"
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
