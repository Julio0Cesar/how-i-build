import Link from "next/link";
import type { ReactNode } from "react";
import { profile } from "@/content/profile";
import { localeHref, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { series } from "@/lib/log";
import { allTags } from "@/lib/tags";
import { ProjectMark } from "./project-mark";

/** The pad: the sidebar is the cover page, the log runs beside it. */
export function LogLayout({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-24 pt-8 sm:px-6 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-16 lg:px-8 lg:pt-12">
      {sidebar}
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/**
 * Who keeps the log, what it is a log of, and the ways into it. `intro` is the
 * home page only; elsewhere the cover stays short so the list starts higher.
 */
export function LogSidebar({
  locale,
  dict,
  intro = false,
  heading,
}: {
  locale: Locale;
  dict: Dictionary;
  intro?: boolean;
  heading?: string;
}) {
  const Intro = profile.intro[locale];
  const list = series(locale);
  const tags = allTags(locale);

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div>
        {intro ? (
          <>
            <h1 className="text-[2.4rem] font-bold leading-[1.05] tracking-[-0.03em] text-balance">{profile.role[locale]}</h1>
            <div className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground [&_p]:mt-0">
              <Intro />
            </div>
          </>
        ) : (
          <h1 className="text-[2.4rem] font-bold leading-[1.05] tracking-[-0.03em] text-balance">{heading}</h1>
        )}
      </div>

      {list.length > 0 ? (
        <section aria-label={dict.log.series} className="mt-10">
          <ul className="space-y-1">
            {list.map((entry) => {
              const row = (
                <>
                  <ProjectMark name={entry.name} src={entry.mark} className="size-7" />
                  <span className="font-semibold">{entry.name}</span>
                </>
              );
              const className = "-mx-2 flex items-center gap-3 px-2 py-1.5";
              return (
                <li key={entry.slug}>
                  {/* A project with nothing written yet is listed, dimmed, and
                      leads nowhere. */}
                  {entry.stub ? (
                    <div className={`${className} opacity-45`} title={dict.project.pending}>
                      {row}
                    </div>
                  ) : (
                    <Link
                      href={localeHref(locale, `/projects/${entry.slug}`)}
                      className={`${className} transition-colors hover:bg-muted`}
                    >
                      {row}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {tags.length > 0 ? (
        <section aria-label={dict.blog.tags} className="mt-8 border-t border-rule pt-6">
          <ul className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag.slug}>
                <Link
                  href={localeHref(locale, `/blog/tags/${tag.slug}`)}
                  className="block bg-muted px-2.5 py-1 text-sm text-muted-foreground transition-colors hover:bg-foreground hover:text-background"
                >
                  #{tag.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </aside>
  );
}
