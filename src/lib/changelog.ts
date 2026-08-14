export type ChangeRef = { label: string; url: string };
export type ChangeItem = { text: string; refs: ChangeRef[] };
export type ChangeSection = { title: string; items: ChangeItem[] };

/** A trailing `([label](url))`, of which release-please writes one or two. */
const TRAILING_REF = /\s*\(\[([^\]]+)\]\(([^)]+)\)\)$/;

/**
 * Understands the format one of our own tools produces, rather than markdown in
 * general — which is why it is forty lines instead of a dependency. When a body
 * does not parse the result is empty and the page links the release instead, so
 * an unexpected shape degrades rather than breaking.
 *
 * Refs are stripped in a loop because squash merges make release-please write
 * both the pull request and the commit: `subject ([#53](…)) ([aaaaf0c](…))`.
 * Peeling only the last one leaves raw markdown on the page.
 */
export function parseReleaseBody(body: string | null): ChangeSection[] {
  if (!body) return [];

  const sections: ChangeSection[] = [];
  let current: ChangeSection | undefined;

  for (const raw of body.split("\n")) {
    const line = raw.trim();

    if (line.startsWith("### ")) {
      current = { title: line.slice(4).trim(), items: [] };
      sections.push(current);
      continue;
    }

    if (!line.startsWith("* ")) continue;

    let text = line.slice(2).trim();
    const refs: ChangeRef[] = [];
    for (let match = TRAILING_REF.exec(text); match; match = TRAILING_REF.exec(text)) {
      refs.unshift({ label: match[1]!, url: match[2]! });
      text = text.slice(0, match.index).trim();
    }

    // release-please emits the commit scope in bold: `**readme:** …`. Nothing
    // here renders markdown, so the asterisks would reach the page as
    // characters. Only repositories that use scopes ever hit this.
    text = text.replace(/\*\*(.+?)\*\*/g, "$1");

    if (!text) continue;
    if (!current) {
      current = { title: "", items: [] };
      sections.push(current);
    }
    current.items.push({ text, refs });
  }

  return sections.filter((section) => section.items.length > 0);
}
