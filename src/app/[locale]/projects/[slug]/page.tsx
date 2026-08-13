import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseSection } from "@/components/case-section";
import { CaseToc, type TocItem } from "@/components/case-toc";
import { RichBlocks, RichText } from "@/components/rich-text";
import { projects } from "@/content/projects";
import type { Project } from "@/content/types";
import { isLocale, locales, localeHref, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";

/** Stubs have nothing written, so they have no page — see #11. */
const published = projects.filter((project) => !project.stub);

function find(slug: string): Project | undefined {
  return published.find((project) => project.slug === slug);
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    published.map((project) => ({ locale, slug: project.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = find(slug);
  if (!isLocale(locale) || !project) return {};

  const local = project.locales[locale];
  const path = `/projects/${project.slug}`;

  return {
    title: local.name,
    description: local.summary,
    alternates: {
      canonical: localeHref(locale, path),
      languages: {
        ...Object.fromEntries(
          locales.map((entry) => [entry, localeHref(entry, path)]),
        ),
        "x-default": path,
      },
    },
  };
}

function tocItems(project: Project, locale: Locale, dict: Dictionary) {
  const local = project.locales[locale];
  const items: TocItem[] = [];

  if (local.problem.length > 0)
    items.push({ id: "problem", label: dict.case.problem });
  if (local.decisions.length > 0)
    items.push({ id: "decisions", label: dict.case.decisions });
  if (local.challenges.length > 0)
    items.push({ id: "challenges", label: dict.case.challenges });
  if (local.outcome.length > 0)
    items.push({ id: "outcome", label: dict.case.outcome });
  if (local.references?.length)
    items.push({ id: "references", label: dict.case.references });

  return items;
}

export default async function ProjectPage({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const project = find(slug);
  if (!project) notFound();

  const local = project.locales[locale];
  const dict = getDictionary(locale);
  const items = tocItems(project, locale, dict);

  const meta = "font-mono text-xs uppercase tracking-widest text-muted-foreground";

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <header className="grid gap-5 py-12 md:grid-cols-[8rem_1fr] md:gap-10 md:py-20">
        <p className={`${meta} md:pt-3`}>{local.period}</p>
        <div>
          <h1 className="font-serif text-[1.65rem] leading-tight tracking-tight sm:text-3xl md:text-[2.4rem]">
            {local.name}
          </h1>
          <p className="mt-4 max-w-[68ch] leading-relaxed text-muted-foreground">
            {local.summary}
          </p>
          <div className={`mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 ${meta}`}>
            <span className="bg-accent-soft px-2 py-0.5 text-accent">
              {dict.status[project.status]}
            </span>
            <span className="border border-rule px-2 py-0.5">
              {dict.visibility[project.visibility]}
            </span>
            <span>{local.role}</span>
            {project.stack.length > 0 ? (
              <span>{project.stack.join(" · ")}</span>
            ) : null}
          </div>
          {/* A private project links nowhere: there is nothing public to reach. */}
          {project.visibility === "public" ? (
            <div className={`mt-4 flex flex-wrap gap-4 ${meta}`}>
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="border-b border-rule transition-colors hover:border-accent hover:text-accent"
                >
                  {dict.case.live}
                </a>
              ) : null}
              {project.repoUrl ? (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="border-b border-rule transition-colors hover:border-accent hover:text-accent"
                >
                  {dict.case.repository}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_11rem] lg:gap-12">
        {/* Ordered second on wide screens, first on narrow ones, so a phone
            gets the table of contents instead of nothing. */}
        <div className="lg:order-2">
          <CaseToc
            items={items}
            label={dict.case.toc}
            className="mb-10 border-t border-rule pt-6 lg:sticky lg:top-24 lg:mb-0 lg:border-t-0 lg:pt-0"
          />
        </div>

        <div className="lg:order-1">
          {local.problem.length > 0 ? (
            <CaseSection
              id="problem"
              label={dict.case.problem}
              updatedAt={local.updated.problem}
              updatedLabel={dict.case.updated}
            >
              <RichBlocks blocks={local.problem} />
            </CaseSection>
          ) : null}

          {local.decisions.length > 0 ? (
            <CaseSection
              id="decisions"
              label={dict.case.decisions}
              updatedAt={local.updated.decisions}
              updatedLabel={dict.case.updated}
            >
              <div className="space-y-10">
                {local.decisions.map((decision) => (
                  <article key={decision.title}>
                    <h3 className="font-serif text-lg tracking-tight">
                      {decision.title}
                    </h3>
                    <time
                      dateTime={decision.updatedAt}
                      className="mt-1 block font-mono text-[0.65rem] text-muted-foreground"
                    >
                      {decision.updatedAt}
                    </time>

                    <p className={`mt-5 ${meta}`}>{dict.case.context}</p>
                    <RichBlocks blocks={decision.context} className="mt-2" />

                    <p className={`mt-5 ${meta}`}>{dict.case.decision}</p>
                    <RichBlocks blocks={decision.decision} className="mt-2" />

                    {decision.tradeoffs.length > 0 ? (
                      <>
                        <p className={`mt-5 ${meta}`}>{dict.case.tradeoffs}</p>
                        <ul className="mt-2 max-w-[68ch] list-disc space-y-2 pl-5 leading-relaxed">
                          {decision.tradeoffs.map((tradeoff, index) => (
                            <RichText key={index} as="li" segments={tradeoff} />
                          ))}
                        </ul>
                      </>
                    ) : null}
                  </article>
                ))}
              </div>
            </CaseSection>
          ) : null}

          {local.challenges.length > 0 ? (
            <CaseSection
              id="challenges"
              label={dict.case.challenges}
              updatedAt={local.updated.challenges}
              updatedLabel={dict.case.updated}
            >
              <div className="space-y-8">
                {local.challenges.map((challenge) => (
                  <article key={challenge.title}>
                    <h3 className="font-serif text-lg tracking-tight">
                      {challenge.title}
                    </h3>
                    <RichBlocks blocks={challenge.body} className="mt-3" />
                  </article>
                ))}
              </div>
            </CaseSection>
          ) : null}

          {local.outcome.length > 0 ? (
            <CaseSection
              id="outcome"
              label={dict.case.outcome}
              updatedAt={local.updated.outcome}
              updatedLabel={dict.case.updated}
            >
              <RichBlocks blocks={local.outcome} />
            </CaseSection>
          ) : null}

          {local.references?.length ? (
            <CaseSection
              id="references"
              label={dict.case.references}
              updatedAt={local.updated.references}
              updatedLabel={dict.case.updated}
            >
              <ul className="space-y-2">
                {local.references.map((reference) => (
                  <li key={reference.url}>
                    <a
                      href={reference.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="cursor-pointer border-b border-rule transition-colors hover:border-accent hover:text-accent"
                    >
                      {reference.label}
                    </a>
                  </li>
                ))}
              </ul>
            </CaseSection>
          ) : null}
        </div>
      </div>
    </div>
  );
}
