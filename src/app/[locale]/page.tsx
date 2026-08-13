import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/project-card";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { isLocale, locales, localeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { byRecency } from "@/lib/projects";

const sectionLabel =
  "font-mono text-xs uppercase tracking-widest text-muted-foreground";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return {
    alternates: {
      canonical: localeHref(locale, "/"),
      languages: {
        ...Object.fromEntries(
          locales.map((entry) => [entry, localeHref(entry, "/")]),
        ),
        "x-default": "/",
      },
    },
  };
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const Intro = profile.intro[locale];
  const ordered = byRecency(projects, locale);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <section className="grid gap-6 py-12 md:grid-cols-[8rem_1fr] md:gap-10 md:py-24">
        <p className={`${sectionLabel} md:pt-3`}>{dict.home.profile}</p>
        <div>
          <h1 className="max-w-3xl font-serif text-[1.65rem] leading-tight tracking-tight sm:text-3xl md:text-[2.4rem]">
            {profile.role[locale]}
          </h1>
          <div className="mt-8">
            <Intro />
          </div>
        </div>
      </section>

      <section className="grid gap-6 border-t border-rule pt-10 md:grid-cols-[8rem_1fr] md:gap-10 md:pt-12">
        <p className={`${sectionLabel} md:pt-2`}>{dict.home.projects}</p>
        <ul>
          {ordered.map((project, index) => (
            <li
              key={project.slug}
              className={index > 0 ? "border-t border-rule" : undefined}
            >
              <ProjectCard project={project} locale={locale} dict={dict} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
