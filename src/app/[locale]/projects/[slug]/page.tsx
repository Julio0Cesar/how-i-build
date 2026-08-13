import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { CaseToc } from "@/components/case-toc";
import { StackList } from "@/components/stack-list";
import { socialIcons } from "@/config/icons";
import { projects } from "@/content/projects";
import type { Project } from "@/content/types";
import { isLocale, locales, localeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { caseToc } from "@/lib/toc";

/** Stubs have an empty body, so they have no page — see #11. */
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

  const { meta } = project.cases[locale];
  const path = `/projects/${project.slug}`;

  return {
    title: meta.name,
    description: meta.summary,
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

export default async function ProjectPage({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const project = find(slug);
  if (!project) notFound();

  const { meta, Body } = project.cases[locale];
  const dict = getDictionary(locale);
  const items = caseToc(project.slug, locale);

  const label = "font-mono text-xs uppercase tracking-widest text-muted-foreground";
  const external =
    "cursor-pointer border-b border-rule transition-colors hover:border-accent hover:text-accent";

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <header className="grid gap-5 py-12 md:grid-cols-[8rem_1fr] md:gap-10 md:py-20">
        <p className={`${label} md:pt-3`}>{meta.period}</p>
        <div>
          <h1 className="font-serif text-[1.65rem] leading-tight tracking-tight sm:text-3xl md:text-[2.4rem]">
            {meta.name}
          </h1>
          <p className="mt-4 max-w-[68ch] leading-relaxed text-muted-foreground">
            {meta.summary}
          </p>
          <div className={`mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 ${label}`}>
            <span className="bg-accent-soft px-2 py-0.5 text-accent">
              {dict.status[project.status]}
            </span>
            <span className="border border-rule px-2 py-0.5">
              {dict.visibility[project.visibility]}
            </span>
            <span>{meta.role}</span>
            <StackList stack={project.stack} />
          </div>
          {/* A private project links nowhere: there is nothing public to reach. */}
          {project.visibility === "public" ? (
            <div className={`mt-4 flex flex-wrap gap-4 ${label}`}>
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`inline-flex items-center gap-2 ${external}`}
                >
                  {/* Marks that a public address exists. It claims nothing about
                      availability, because nothing here checks it — see #13. */}
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-positive"
                  />
                  {dict.case.live}
                  <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              ) : null}
              {project.repoUrl ? (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`inline-flex items-center gap-2 ${external}`}
                >
                  {socialIcons.github ? (
                    // eslint-disable-next-line @next/next/no-img-element -- a local SVG needs no optimisation pipeline
                    <img
                      src={socialIcons.github}
                      alt=""
                      aria-hidden="true"
                      className="size-4 object-contain dark:invert"
                    />
                  ) : null}
                  {dict.case.repository}
                  <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </header>

      <div className="border-t border-rule pt-10 lg:grid lg:grid-cols-[minmax(0,1fr)_11rem] lg:gap-12">
        {/* Second on wide screens, first on narrow ones, so a phone gets the
            table of contents instead of nothing. */}
        {items.length > 0 ? (
          <div className="lg:order-2">
            <CaseToc
              items={items}
              label={dict.case.toc}
              className="mb-10 lg:sticky lg:top-24 lg:mb-0"
            />
          </div>
        ) : null}

        <article className="lg:order-1">
          <Body />

          {meta.references?.length ? (
            <section className="mt-14 border-t border-rule pt-10">
              <h2 className={label}>{dict.case.references}</h2>
              <ul className="mt-4 space-y-2">
                {meta.references.map((reference) => (
                  <li key={reference.url}>
                    <a
                      href={reference.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={external}
                    >
                      {reference.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>
      </div>
    </div>
  );
}
