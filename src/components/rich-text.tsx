import Link from "next/link";
import { locale as rootLocale } from "next/root-params";
import type { RichBlock, TextSegment } from "@/content/types";
import {
  defaultLocale,
  isLocale,
  localeHref,
  type Locale,
} from "@/i18n/config";

/** Prose links keep the pointer; the base layer removes it from every other anchor. */
const linkClass =
  "cursor-pointer border-b border-rule transition-colors hover:border-accent hover:text-accent";

const codeClass = "bg-muted px-1 py-0.5 font-mono text-[0.9em]";

async function currentLocale(): Promise<Locale> {
  const value = await rootLocale();
  return value && isLocale(value) ? value : defaultLocale;
}

function Segment({
  segment,
  locale,
}: {
  segment: TextSegment;
  locale: Locale;
}) {
  const content = segment.code ? (
    <code className={codeClass}>{segment.text}</code>
  ) : (
    segment.text
  );

  if (!segment.href) return <>{content}</>;

  /**
   * Content writes `/projects/foo`, never `/pt/projects/foo`. Localising here
   * is what keeps a single piece of content correct in both languages — and
   * keeps whoever writes it from having to know which locales exist.
   */
  if (segment.href.startsWith("/")) {
    return (
      <Link href={localeHref(locale, segment.href)} className={linkClass}>
        {content}
      </Link>
    );
  }

  const web = /^https?:\/\//.test(segment.href);
  return (
    <a
      href={segment.href}
      target={web ? "_blank" : undefined}
      rel={web ? "noreferrer noopener" : undefined}
      className={linkClass}
    >
      {content}
    </a>
  );
}

export async function RichText({
  segments,
  as: Tag = "span",
  className,
}: {
  segments: TextSegment[];
  as?: "span" | "p" | "li";
  className?: string;
}) {
  const locale = await currentLocale();

  return (
    <Tag className={className}>
      {segments.map((segment, index) => (
        <Segment key={index} segment={segment} locale={locale} />
      ))}
    </Tag>
  );
}

export async function RichBlocks({
  blocks,
  className = "",
}: {
  blocks: RichBlock[];
  className?: string;
}) {
  const locale = await currentLocale();

  return (
    <div className={`max-w-[68ch] leading-relaxed ${className}`.trim()}>
      {blocks.map((block, index) =>
        block.kind === "paragraph" ? (
          <p key={index} className="mt-5 first:mt-0">
            {block.segments.map((segment, i) => (
              <Segment key={i} segment={segment} locale={locale} />
            ))}
          </p>
        ) : (
          <ul key={index} className="mt-5 list-disc pl-5 first:mt-0">
            {block.items.map((item, i) => (
              <li key={i} className="mt-2 first:mt-0">
                {item.map((segment, j) => (
                  <Segment key={j} segment={segment} locale={locale} />
                ))}
              </li>
            ))}
          </ul>
        ),
      )}
    </div>
  );
}
