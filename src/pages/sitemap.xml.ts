import { allStaticSeoPaths, canonicalUrl, localizePath, site } from "../data/site";
import { buildNoteDiscoveryEntries, serializeSitemap } from "../lib/discovery/serialize";
import { getAllPublishedNotes } from "../lib/sanity/notes";

export async function GET() {
  const notes = await getAllPublishedNotes();
  const noteEntries = buildNoteDiscoveryEntries(notes);
  const paths = [
    ...allStaticSeoPaths(),
    ...site.languages.map((language) => localizePath(language, "notes")),
    ...noteEntries.map((entry) => entry.path),
  ];
  const body = serializeSitemap(paths.map(canonicalUrl));

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
