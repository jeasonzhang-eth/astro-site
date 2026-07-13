import test from "node:test";
import assert from "node:assert/strict";
import { PUBLISHED_NOTES_QUERY } from "../src/lib/sanity/queries";
import { pairNotes, portableTextToPlainText, validateNotes } from "../src/lib/sanity/notes";
import type { PortableTextBlock } from "../src/lib/sanity/types";

const block = (text: string): PortableTextBlock => ({
  _key: `key-${text}`,
  _type: "block",
  style: "normal",
  markDefs: [],
  children: [{ _key: `span-${text}`, _type: "span", marks: [], text }],
});

const note = (language: "en" | "zh", slug: string, translationKey = "paired-note") => ({
  _id: `note.${translationKey}.${language}`,
  title: `${language} title`,
  slug,
  language,
  translationKey,
  summary: `${language} summary`,
  tags: ["Tag"],
  content: [block(`${language} content`)],
  faq: [{ question: `${language} question`, answer: [block(`${language} answer`)] }],
  publishedAt: "2026-07-13T00:00:00.000Z",
  featured: false,
});

test("GROQ query excludes drafts and requires a slug", () => {
  assert.match(PUBLISHED_NOTES_QUERY, /drafts\.\*\*/);
  assert.match(PUBLISHED_NOTES_QUERY, /defined\(slug\.current\)/);
});

test("validation rejects malformed Notes", () => {
  assert.throws(() => validateNotes([{ ...note("zh", "hello"), title: "" }]), /title/);
});

test("validation rejects duplicate language and slug routes", () => {
  assert.throws(() => validateNotes([note("zh", "same", "one"), note("zh", "same", "two")]), /duplicate route/);
});

test("pairing keeps translated slugs independent", () => {
  const pairs = pairNotes(validateNotes([note("zh", "zh-slug"), note("en", "en-slug")]));
  assert.equal(pairs.get("paired-note")?.zh?.slug, "zh-slug");
  assert.equal(pairs.get("paired-note")?.en?.slug, "en-slug");
});

test("Portable Text converts to plain text for JSON-LD", () => {
  assert.equal(portableTextToPlainText([block("First"), block("Second")]), "First Second");
});
