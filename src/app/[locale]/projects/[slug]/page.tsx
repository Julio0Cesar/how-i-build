import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { CaseToc } from "@/components/case-toc";
import { ProjectMark } from "@/components/project-mark";
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

  const external = "link cursor-pointer";

  return (
    <div className="pb-24">
      <header className="mx-auto max-w-[46rem] px-5 pt-14 text-center sm:pt-20">
        <ProjectMark
          name={meta.name}
          src={project.markUrl}
          className="mx-auto size-16 sm:size-20"
        />
        <h1 className="mt-6 text-[2.4rem] font-bold leading-[1.06] tracking-[-0.03em] text-balance sm:text-[3.4rem] md:text-[3.9rem]">
          {meta.name}
        </h1>
        <p className="mx-auto mt-6 max-w-[34em] text-lg leading-relaxed text-muted-foreground text-pretty sm:text-xl">
          {meta.summary}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
          <span>{meta.period}</span>
          <span aria-hidden="true">·</span>
          <span>{dict.status[project.status]}</span>
          <span aria-hidden="true">·</span>
          <span>{dict.visibility[project.visibility]}</span>
          <span aria-hidden="true">·</span>
          <span>{meta.role}</span>
        </div>
        <div className="mt-3 flex justify-center text-sm text-muted-foreground">
          <StackList stack={project.stack} />
        </div>
          {/* A private project hides its repository; a live address is still public. */}
          {project.liveUrl || (project.visibility === "public" && project.repoUrl) ? (
            <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-medium">
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
              {project.visibility === "public" && project.repoUrl ? (
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
      </header>

      <hr className="mx-auto mt-14 w-16 border-t border-foreground" />

      {/* On wide screens the index rides beside the text and marks the
          section being read; on narrow ones it is the bar under the header. */}
      <div className="mx-auto mt-12 grid max-w-[72rem] gap-x-12 px-5 text-[1.125rem] md:mt-14 lg:grid-cols-[14rem_minmax(0,48rem)] lg:justify-center">
        {items.length > 1 ? (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <CaseToc
              items={items}
              label={dict.case.toc}
              className="sticky top-14 z-30 mb-10 bg-background text-base sm:top-16 lg:static lg:mb-0"
            />
          </aside>
        ) : null}

        <article className="min-w-0 lg:col-start-2">
          <Body />

          {meta.references?.length ? (
            <section className="mt-14 border-t border-foreground pt-6">
              <h2 className="data text-xs text-muted-foreground">{dict.case.references}</h2>
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
