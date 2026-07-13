export type DiscoveryLanguage = "en" | "zh";

export type NoteDiscoverySource = {
  translationKey: string;
  language: DiscoveryLanguage;
  slug: string;
  title: string;
};

export type NoteDiscoveryEntry = {
  language: DiscoveryLanguage;
  path: string;
  title: string;
};

const discoveryLanguages = ["en", "zh"] as const;
const controlCharacters = /[\u0000-\u001f\u007f]/;

export function escapeXmlText(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function toSingleLineText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function encodeRouteSegment(value: string): string {
  if (controlCharacters.test(value)) {
    throw new Error("Route segment must not contain control characters");
  }

  const trimmed = value.trim();
  if (!trimmed) throw new Error("Route segment must be non-empty");
  if (trimmed !== value) throw new Error("Route segment must not have surrounding whitespace");
  if (value.includes("/") || value.includes("\\")) {
    throw new Error("Route segment must be a single route segment");
  }
  if (value === "." || value === "..") {
    throw new Error("Route segment must not navigate between paths");
  }

  return encodeURIComponent(value);
}

export function buildNoteDiscoveryEntries(notes: NoteDiscoverySource[]): NoteDiscoveryEntry[] {
  const groups = new Map<string, Partial<Record<DiscoveryLanguage, NoteDiscoverySource>>>();

  for (const note of notes) {
    if (!discoveryLanguages.includes(note.language)) {
      throw new Error(`Unsupported Note discovery language: ${String(note.language)}`);
    }
    if (!note.translationKey || toSingleLineText(note.translationKey) !== note.translationKey) {
      throw new Error("Note translationKey must be a non-empty single line");
    }

    const group = groups.get(note.translationKey) || {};
    if (group[note.language]) {
      throw new Error(`Duplicate ${note.language} Note translation for ${note.translationKey}`);
    }
    group[note.language] = note;
    groups.set(note.translationKey, group);
  }

  const entries: NoteDiscoveryEntry[] = [];
  const seenPaths = new Set<string>();

  for (const group of groups.values()) {
    for (const language of discoveryLanguages) {
      const note = group[language];
      if (!note) continue;
      if (!toSingleLineText(note.title)) throw new Error("Note discovery title must be non-empty");

      const path = `/${language}/notes/${encodeRouteSegment(note.slug)}/`;
      if (seenPaths.has(path)) continue;
      seenPaths.add(path);
      entries.push({ language, path, title: note.title });
    }
  }

  return entries;
}

export function serializeSitemap(urls: Iterable<string>): string {
  const uniqueUrls = [...new Set(urls)];
  const entries = uniqueUrls.map((url) => {
    if (!url || controlCharacters.test(url)) {
      throw new Error("Sitemap URL must be a non-empty single line");
    }
    return `  <url><loc>${escapeXmlText(url)}</loc></url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
}

export function serializeLlmsNoteLines(entries: NoteDiscoveryEntry[], siteUrl: string): string {
  if (!siteUrl || /\s/.test(siteUrl)) throw new Error("llms.txt site URL must be a non-empty single line");
  const baseUrl = siteUrl.replace(/\/+$/, "");
  const seenUrls = new Set<string>();
  const lines: string[] = [];

  for (const entry of entries) {
    const expectedPath = new RegExp(`^/${entry.language}/notes/[^/]+/$`);
    if (!expectedPath.test(entry.path) || controlCharacters.test(entry.path)) {
      throw new Error(`Invalid Note discovery path: ${entry.path}`);
    }

    const title = toSingleLineText(entry.title);
    if (!title) throw new Error("llms.txt Note label must be non-empty");

    const url = `${baseUrl}${entry.path}`;
    if (seenUrls.has(url)) continue;
    seenUrls.add(url);
    lines.push(`- ${title} (${entry.language.toUpperCase()}): ${url}`);
  }

  return lines.join("\n");
}
