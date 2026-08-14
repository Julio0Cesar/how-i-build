import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCalendar } from "@/components/post-calendar";
import { PostCard } from "@/components/post-card";
import { posts } from "@/content/posts";
import { isLocale, locales, localeHref } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { postDays } from "@/lib/calendar";
import { byDate } from "@/lib/posts";

const path = "/blog";
const label = "font-mono text-xs uppercase tracking-widest text-muted-foreground";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/blog">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return {
    title: getDictionary(locale).blog.title,
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

export default async function BlogIndex({
  params,
}: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const ordered = byDate(posts, locale);
  const days = postDays(posts, locale);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <header className="grid gap-5 py-12 md:grid-cols-[8rem_1fr] md:gap-10 md:py-20">
        <p className={`${label} md:pt-3`}>{dict.blog.title}</p>
        <h1 className="font-serif text-[1.65rem] leading-tight tracking-tight sm:text-3xl md:text-[2.4rem]">
          {dict.blog.title}
        </h1>
      </header>

      {ordered.length === 0 ? (
        <p className="max-w-[68ch] border-t border-rule py-12 leading-relaxed text-muted-foreground">
          {dict.blog.empty}
        </p>
      ) : (
        <div className="grid gap-10 border-t border-rule pt-10 lg:grid-cols-[minmax(0,1fr)_14rem]">
          <ul className="grid gap-5 sm:grid-cols-2">
            {ordered.map((post) => (
              <li key={post.slug}>
                <PostCard post={post} locale={locale} />
              </li>
            ))}
          </ul>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <PostCalendar days={days} locale={locale} label={dict.blog.calendar} />
          </aside>
        </div>
      )}
    </div>
  );
}
