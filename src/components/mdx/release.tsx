import Link from "next/link";
import { localeHref } from "@/i18n/config";
import { parseReleaseBody } from "@/lib/changelog";
import {
  getRelease,
  parseRepo,
  repoKey,
  siteRepo,
} from "@/lib/integrations";
import { currentDictionary, currentLocale } from "./locale";

const label = "font-mono text-xs uppercase tracking-widest text-muted-foreground";

/**
 * The release that shipped a decision, rendered where the decision is argued.
 *
 * The tag links into this site's own changelog rather than out to GitHub, so a
 * decision that says "this shipped in 0.20.2" reaches the entry it names.
 *
 * `repo` takes `owner/name` rather than a project slug on purpose: resolving a
 * slug would mean importing the project index here, and the project index
 * imports the MDX files that use this component.
 */
export async function Release({
  version,
  repo,
}: {
  version: string;
  repo?: string;
}) {
  const source = repo ? parseRepo(repo) : siteRepo;
  const dict = await currentDictionary();
  const locale = await currentLocale();
  const release = source ? await getRelease(source, version) : null;

  // Nothing to say beyond the tag when the API cannot be reached or the
  // repository is private — which must not fail a build.
  if (!source || !release) {
    return (
      <p className={`mt-6 ${label}`}>
        {dict.changelog.release}: {version}
      </p>
    );
  }

  const sections = parseReleaseBody(release.body);
  const date = release.publishedAt
    ? new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
        new Date(release.publishedAt),
      )
    : null;

  return (
    <aside className="mt-6 border border-rule bg-surface p-4">
      <p className={label}>
        <Link
          href={localeHref(
            locale,
            `/changelog/${repoKey(source)}#${release.tag}`,
          )}
          className="cursor-pointer transition-colors hover:text-accent"
        >
          {release.tag}
        </Link>
        {date ? <span className="ml-2 normal-case">{date}</span> : null}
      </p>

      {sections.map((section) => (
        <div key={section.title} className="mt-3">
          {section.title ? (
            <p className={`${label} text-[0.6rem]`}>{section.title}</p>
          ) : null}
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed">
            {section.items.map((item, index) => (
              <li key={index}>{item.text}</li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
