import Link from "next/link";
import type { Project } from "@/content/types";
import { localeHref, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { ProjectMark } from "./project-mark";

export function ProjectCard({
  project,
  locale,
  dict,
}: {
  project: Project;
  locale: Locale;
  dict: Dictionary;
}) {
  const { meta } = project.cases[locale];

  const body = (
    <>
      <ProjectMark name={meta.name} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="font-serif text-lg tracking-tight transition-colors group-hover:text-accent sm:text-xl">
            {meta.name}
          </h2>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {meta.period}
          </span>
        </div>
        <p className="mt-3 max-w-[68ch] text-[0.95rem] leading-relaxed text-muted-foreground">
          {meta.summary}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-widest">
          <span className="bg-accent-soft px-2 py-0.5 text-accent">
            {project.stub ? dict.project.pending : dict.status[project.status]}
          </span>
          <span className="border border-rule px-2 py-0.5 text-muted-foreground">
            {dict.visibility[project.visibility]}
          </span>
          {project.stack.length > 0 ? (
            <span className="text-muted-foreground">
              {project.stack.join(" · ")}
            </span>
          ) : null}
        </div>
      </div>
    </>
  );

  const layout =
    "group grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 py-7 transition-transform hover:translate-x-2 sm:gap-5 md:py-8";

  /**
   * A stub has no sections written, so it is not a link — that would lead to an
   * empty case page. It still reacts to hover, so the list behaves as one thing
   * rather than one live row and one dead one.
   */
  if (project.stub) {
    return <div className={layout}>{body}</div>;
  }

  return (
    <Link
      href={localeHref(locale, `/projects/${project.slug}`)}
      className={layout}
    >
      {body}
    </Link>
  );
}
