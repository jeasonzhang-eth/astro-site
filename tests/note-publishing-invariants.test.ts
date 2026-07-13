import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildLanguageAlternates } from "../src/lib/seo/alternates";
import {
  REQUIRED_MIGRATED_NOTE_TRANSLATION_KEYS,
  assertRequiredMigratedNoteTranslations,
  isSafePortableTextHref,
  validateNotes,
} from "../src/lib/sanity/notes";
import type { PortableTextBlock } from "../src/lib/sanity/types";

const block = (text: string): PortableTextBlock => ({
  _key: `block-${text}`,
  _type: "block",
  style: "normal",
  markDefs: [],
  children: [{ _key: `span-${text}`, _type: "span", marks: [], text }],
});

const note = (translationKey: string, language: "en" | "zh") => ({
  _id: `note-${translationKey}-${language}`,
  title: `${translationKey} ${language}`,
  slug: translationKey,
  language,
  translationKey,
  summary: "Summary",
  tags: [],
  content: [block("Content")],
  faq: [],
  publishedAt: "2026-07-13T00:00:00.000Z",
  featured: false,
});

test("the four migrated translation keys are required in both languages", () => {
  assert.deepEqual(REQUIRED_MIGRATED_NOTE_TRANSLATION_KEYS, [
    "ai-agent-workflow",
    "desktop-automation",
    "creator-tools",
    "market-research",
  ]);

  const complete = validateNotes(REQUIRED_MIGRATED_NOTE_TRANSLATION_KEYS.flatMap((key) => [
    note(key, "en"),
    note(key, "zh"),
  ]));
  assert.doesNotThrow(() => assertRequiredMigratedNoteTranslations(complete));

  const missing = complete.filter((entry) => !(entry.translationKey === "creator-tools" && entry.language === "zh"));
  assert.throws(
    () => assertRequiredMigratedNoteTranslations(missing),
    /creator-tools.*zh.*publish/i,
  );

  assert.doesNotThrow(() => assertRequiredMigratedNoteTranslations([
    ...complete,
    ...validateNotes([note("future-english-only", "en")]),
  ]));
});

test("Portable Text href validation allows only CMS-supported absolute schemes", () => {
  for (const href of [
    "https://example.com/path?q=1",
    "http://example.com",
    "mailto:hello@example.com",
    "tel:+8618593141894",
  ]) {
    assert.equal(isSafePortableTextHref(href), true, href);
  }

  for (const href of [
    "javascript:alert(1)",
    "data:text/html,pwned",
    "/relative/path",
    "example.com/no-scheme",
    "https://",
    "mailto:",
    "tel:",
  ]) {
    assert.equal(isSafePortableTextHref(href), false, href);
  }
});

test("language alternates disappear on noindexed pages and omit noindexed translations", () => {
  assert.deepEqual(
    buildLanguageAlternates({
      language: "en",
      pathname: "/en/notes/indexable/",
      alternatePath: "/zh/notes/indexable/",
      noIndex: false,
    }),
    { en: "/en/notes/indexable/", zh: "/zh/notes/indexable/" },
  );

  assert.deepEqual(
    buildLanguageAlternates({
      language: "en",
      pathname: "/en/notes/indexable/",
      alternatePath: undefined,
      noIndex: false,
    }),
    { en: "/en/notes/indexable/" },
  );

  assert.deepEqual(
    buildLanguageAlternates({
      language: "zh",
      pathname: "/zh/notes/hidden/",
      alternatePath: "/en/notes/indexable/",
      noIndex: true,
    }),
    {},
  );
});


test("the published Notes fetch enforces the migrated-pair assertion after validation", () => {
  const source = readFileSync(new URL("../src/lib/sanity/notes.ts", import.meta.url), "utf8");
  assert.match(
    source,
    /const notes = validateNotes\(value\);[\s\S]*assertRequiredMigratedNoteTranslations\(notes\);/,
  );
});
