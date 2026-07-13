import { writeFile } from "node:fs/promises";
import { notes } from "../src/data/site";
import { convertFaqAnswer, convertLocalNoteContent } from "./sanity/portable-text";
import type { SanityLanguage } from "../src/lib/sanity/types";

const outputPaths = process.argv.slice(2);
if (outputPaths.length !== 2) {
  console.error("Usage: npm run notes:export -- <manifest.json> <documents.ndjson>");
  process.exit(1);
}

const [manifestPath, ndjsonPath] = outputPaths;
const languages: SanityLanguage[] = ["en", "zh"];
const baseTimestamp = Date.parse("2026-07-13T00:00:00.000Z");

const documents = notes.flatMap((source, sourceIndex) => {
  const publishedAt = new Date(baseTimestamp - sourceIndex * 60_000).toISOString();

  return languages.map((language) => {
    const content = source[language];
    const document = {
      _id: `note.${source.slug}.${language}`,
      _type: "note",
      title: content.title,
      slug: { _type: "slug", current: source.slug },
      language,
      translationKey: source.slug,
      summary: content.summary,
      tags: [content.tag],
      content: convertLocalNoteContent(content, language),
      faq: content.faq.map((entry, faqIndex) => ({
        _key: `${source.slug}-${language}-faq-${faqIndex}`,
        _type: "faqItem",
        question: entry.question,
        answer: convertFaqAnswer(entry.answer),
      })),
      publishedAt,
      featured: false,
      seo: { _type: "seo", title: content.title, description: content.summary, noIndex: false },
    };

    return document;
  });
});

const englishCount = documents.filter((document) => document.language === "en").length;
const chineseCount = documents.filter((document) => document.language === "zh").length;
if (documents.length !== 8 || englishCount !== 4 || chineseCount !== 4) {
  console.error(`Refusing export: expected 8 documents (4 en, 4 zh), got ${documents.length} (${englishCount} en, ${chineseCount} zh).`);
  process.exit(1);
}

await writeFile(manifestPath, `${JSON.stringify(documents, null, 2)}\n`, "utf8");
await writeFile(ndjsonPath, `${documents.map((document) => JSON.stringify(document)).join("\n")}\n`, "utf8");

console.log(`Exported ${documents.length} local Notes: ${englishCount} en, ${chineseCount} zh.`);
console.log(`Manifest: ${manifestPath}`);
console.log(`NDJSON: ${ndjsonPath}`);
