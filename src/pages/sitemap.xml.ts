import { allStaticSeoPaths, canonicalUrl, localizePath } from "../lib/site/routes";
import { getSiteContent } from "../lib/sanity/site-content";
import { buildNoteDiscoveryEntries, serializeSitemap } from "../lib/discovery/serialize";
import { getAllPublishedNotes } from "../lib/sanity/notes";

export async function GET() {
  const [{ projects, site }, notes] = await Promise.all([getSiteContent(), getAllPublishedNotes()]);
  const noteEntries = buildNoteDiscoveryEntries(notes);
  const paths = [
    ...allStaticSeoPaths(site.languages),
    ...site.languages.map((language) => localizePath(language, "notes")),
    ...projects.flatMap((project) => site.languages.map((language) => localizePath(language, `projects/${project[language].slug}`))),
    ...noteEntries.map((entry) => entry.path),
  ];
  const body = serializeSitemap(paths.map((path) => canonicalUrl(site.url, path)));

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
