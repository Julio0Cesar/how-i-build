import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { ProjectCard } from "@/components/project-card";
import { profile } from "@/content/profile";
import { posts } from "@/content/posts";
import { projects } from "@/content/projects";
import { isLocale, locales, localeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { byRecency } from "@/lib/projects";
import { byDate } from "@/lib/posts";

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
  const ordered_posts = byDate(posts, locale);
  const latest = ordered_posts.slice(0, 3);
  /** The fade means "there is more". With nothing behind it, it would be a lie. */
  const hasMore = ordered_posts.length > latest.length;

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

      {latest.length > 0 ? (
        <section className="grid gap-6 border-t border-rule pt-10 md:grid-cols-[8rem_1fr] md:gap-10 md:pt-12">
          <p className={`${sectionLabel} md:pt-2`}>{dict.blog.latest}</p>
          <div>
            <div className="relative">
              <ul className="space-y-5">
                {latest.map((post) => (
                  <li key={post.slug}>
                    <PostCard post={post} locale={locale} />
                  </li>
                ))}
              </ul>
              {/* The fade only exists when something is behind it. */}
              {hasMore ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent"
                />
              ) : null}
            </div>

            {/* Pulled up into the fade so it reads as the list continuing. */}
            <div className={hasMore ? "-mt-6 flex justify-center" : "mt-8 flex justify-center"}>
              <Link
                href={localeHref(locale, "/blog")}
                className={`group inline-flex items-center gap-2 border border-rule bg-background px-4 py-2 transition-colors hover:border-accent hover:text-accent ${sectionLabel}`}
              >
                {dict.blog.all}
                <ChevronDown
                  className="size-3.5 transition-transform group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
