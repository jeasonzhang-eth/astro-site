import { readFile } from "node:fs/promises";
import { createClient } from "@sanity/client";
import { validateNotes, pairNotes } from "../src/lib/sanity/notes";
import { PUBLISHED_NOTES_QUERY } from "../src/lib/sanity/queries";
import type { SanityLanguage, SanityNote } from "../src/lib/sanity/types";

const manifestPaths = process.argv.slice(2);
if (manifestPaths.length !== 1) {
  console.error("Usage: npm run notes:validate -- <manifest.json>");
  process.exit(1);
}

const client = createClient({
  projectId: "7lstorz2",
  dataset: "production",
  apiVersion: "2026-07-13",
  useCdn: false,
  perspective: "published",
});

type ManifestNote = {
  _id: string;
  title: string;
  slug: { current: string };
  language: SanityLanguage;
  translationKey: string;
  summary: string;
  tags: string[];
  content: SanityNote["content"];
  faq: SanityNote["faq"];
  seo?: SanityNote["seo"];
  publishedAt: string;
  featured: boolean;
};

type Tuple = [string, SanityLanguage, string, string, number, number];

function normalizedManifest(manifest: ManifestNote[]): unknown[] {
  return manifest.map((note) => ({
    ...note,
    slug: note.slug.current,
  }));
}

function tuples(notes: SanityNote[]): Tuple[] {
  return notes
    .map((note): Tuple => [
      note._id,
      note.language,
      note.slug,
      note.translationKey,
      note.faq.length,
      note.content.length,
    ])
    .sort((left, right) => left[0].localeCompare(right[0]));
}

function counts(notes: SanityNote[]) {
  const en = notes.filter((note) => note.language === "en").length;
  const zh = notes.filter((note) => note.language === "zh").length;
  const pairs = pairNotes(notes);
  const completePairs = [...pairs.values()].filter((pair) => pair.en && pair.zh).length;
  return { total: notes.length, en, zh, pairCount: pairs.size, completePairs };
}

const rawManifest = JSON.parse(await readFile(manifestPaths[0], "utf8")) as unknown;
if (!Array.isArray(rawManifest)) throw new Error("Notes manifest must be an array");

const expected = validateNotes(normalizedManifest(rawManifest as ManifestNote[]));
const actual = validateNotes(await client.fetch<unknown>(PUBLISHED_NOTES_QUERY));
const expectedCounts = counts(expected);
const actualCounts = counts(actual);

if (
  expectedCounts.total !== 8
  || expectedCounts.en !== 4
  || expectedCounts.zh !== 4
  || expectedCounts.pairCount !== 4
  || expectedCounts.completePairs !== 4
) {
  throw new Error(`Manifest counts are invalid: ${JSON.stringify(expectedCounts)}`);
}

if (JSON.stringify(actualCounts) !== JSON.stringify(expectedCounts)) {
  throw new Error(`Remote counts do not match manifest: expected ${JSON.stringify(expectedCounts)}, got ${JSON.stringify(actualCounts)}`);
}

const expectedTuples = tuples(expected);
const actualTuples = tuples(actual);
if (JSON.stringify(actualTuples) !== JSON.stringify(expectedTuples)) {
  throw new Error(`Remote Note tuples do not match manifest:\nexpected ${JSON.stringify(expectedTuples, null, 2)}\nactual ${JSON.stringify(actualTuples, null, 2)}`);
}

console.log(`Validated ${actualCounts.total} Sanity Notes: ${actualCounts.en} en, ${actualCounts.zh} zh, ${actualCounts.completePairs} complete translation pairs.`);
