import { allStaticSeoPaths, canonicalUrl, localizePath } from "../data/site";
import { getAllPublishedNotes } from "../lib/sanity/notes";

export async function GET() {
  const notes = await getAllPublishedNotes();
  const paths = new Set([
    ...allStaticSeoPaths(),
    ...notes.map((note) => localizePath(note.language, `notes/${note.slug}`)),
  ]);
  const urls = [...paths]
    .map((path) => `  <url><loc>${canonicalUrl(path)}</loc></url>`)
    .join("\n");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
