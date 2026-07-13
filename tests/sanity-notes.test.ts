import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { PUBLISHED_NOTES_QUERY } from "../src/lib/sanity/queries";
import { pairNotes, portableTextToPlainText, validateNotes } from "../src/lib/sanity/notes";
import type { PortableTextBlock } from "../src/lib/sanity/types";

const source = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

const sourceFiles = [
  "src/data/site.ts",
  "src/pages/[lang]/index.astro",
  "src/pages/[lang]/notes/index.astro",
  "src/pages/[lang]/notes/[slug].astro",
  "src/pages/sitemap.xml.ts",
  "src/pages/llms.txt.ts",
];

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

test("Astro has no local Notes source or fallback import", async () => {
  const source = (await Promise.all(sourceFiles.map((file) => readFile(file, "utf8")))).join("\n");
  assert.doesNotMatch(source, /export const notes\b/);
  assert.doesNotMatch(source, /\bnotes\s*,?\s*from ["'][^"']*data\/site/);
  assert.doesNotMatch(source, /fallbackNotes|localNotes/);
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

test("validation rejects malformed Portable Text in main content", () => {
  const malformedContent = [
    [{}],
    [{ _key: "", _type: "custom" }],
    [{ _key: "custom", _type: "" }],
    [{ _key: "block", _type: "block" }],
    [{
      _key: "block",
      _type: "block",
      children: [{ _key: "", _type: "span", marks: [], text: "Invalid key" }],
    }],
    [{
      _key: "block",
      _type: "block",
      children: [{ _key: "span", _type: "other", marks: [], text: "Invalid type" }],
    }],
    [{
      _key: "block",
      _type: "block",
      children: [{ _key: "span", _type: "span", marks: ["strong", 1], text: "Invalid marks" }],
    }],
    [{
      _key: "block",
      _type: "block",
      children: [{ _key: "span", _type: "span", marks: [], text: 42 }],
    }],
  ];

  for (const content of malformedContent) {
    assert.throws(() => validateNotes([{ ...note("zh", "hello"), content }]), /content/);
  }
});

test("validation rejects malformed Portable Text in FAQ answers", () => {
  const faq = [{
    question: "Question",
    answer: [{
      _key: "faq-block",
      _type: "block",
      children: [{ _key: "faq-span", _type: "span", marks: ["strong", 1], text: "Answer" }],
    }],
  }];

  assert.throws(() => validateNotes([{ ...note("zh", "hello"), faq }]), /faq\[0\]\.answer/);
});

test("validation preserves custom Portable Text objects with valid identity fields", () => {
  const customObject = { _key: "image-1", _type: "image", asset: { _ref: "image-ref" } };
  const [validated] = validateNotes([{
    ...note("zh", "hello"),
    content: [block("Before"), customObject],
  }]);

  assert.deepEqual(validated.content[1], customObject);
});

test("pairing keeps translated slugs independent", () => {
  const pairs = pairNotes(validateNotes([note("zh", "zh-slug"), note("en", "en-slug")]));
  assert.equal(pairs.get("paired-note")?.zh?.slug, "zh-slug");
  assert.equal(pairs.get("paired-note")?.en?.slug, "en-slug");
});

test("Portable Text joins spans within blocks and separates blocks", () => {
  const markedWord: PortableTextBlock = {
    _key: "marked-word",
    _type: "block",
    children: [
      { _key: "open", _type: "span", marks: [], text: "Open" },
      { _key: "ai", _type: "span", marks: ["strong"], text: "AI" },
    ],
  };

  assert.equal(portableTextToPlainText([markedWord, block("Second block")]), "OpenAI Second block");
});

test("Portable Note body maps Sanity custom types and fails on unsupported components", () => {
  const renderer = source("../src/components/notes/PortableNoteBody.astro");

  assert.match(renderer, /from ["']astro-portabletext["']/);
  assert.match(renderer, /SanityImage/);
  assert.match(renderer, /SanityCodeBlock/);
  assert.match(renderer, /type:\s*\{[^}]*image:\s*SanityImage[^}]*codeBlock:\s*SanityCodeBlock/s);
  assert.match(renderer, /onMissingComponent/);
  assert.match(renderer, /throw new Error\(`Unsupported Portable Text component:/);
});

test("Sanity image rendering requires alt text and uses the fixed image builder", () => {
  const imageBuilder = source("../src/lib/sanity/image.ts");
  const imageRenderer = source("../src/components/notes/SanityImage.astro");

  assert.match(imageBuilder, /createImageUrlBuilder\(getSanityConfig\(\)\)/);
  assert.match(imageBuilder, /builder\.image\(source\)/);
  assert.match(imageRenderer, /node\.alt/);
  assert.match(imageRenderer, /throw new Error/);
  assert.match(imageRenderer, /\.width\(1400\)/);
  assert.match(imageRenderer, /\.auto\(["']format["']\)/);
  assert.match(imageRenderer, /loading=["']lazy["']/);
  assert.match(imageRenderer, /figcaption/);
});

test("Sanity code blocks render optional metadata and escaped code", () => {
  const codeRenderer = source("../src/components/notes/SanityCodeBlock.astro");

  assert.match(codeRenderer, /node\.filename/);
  assert.match(codeRenderer, /node\.language/);
  assert.match(codeRenderer, /language-\$\{node\.language\}/);
  assert.match(codeRenderer, /<pre><code/);
  assert.match(codeRenderer, /\{node\.code\}/);
  assert.doesNotMatch(codeRenderer, /set:html/);
});

test("Base layout only advertises real alternates and propagates no-index metadata", () => {
  const layout = source("../src/layouts/BaseLayout.astro");
  const seo = source("../src/components/Seo.astro");

  assert.match(layout, /alternatePath\?: string/);
  assert.match(layout, /noIndex\?: boolean/);
  assert.match(layout, /Partial<Record<Language, string>>/);
  assert.match(layout, /\{ \[language\]: pathname \}/);
  assert.match(layout, /if \(alternatePath\) alternates\[otherLanguage\] = alternatePath/);
  assert.match(layout, /<Seo[^>]*noIndex=\{noIndex\}/s);
  assert.match(seo, /noIndex\?: boolean/);
  assert.match(seo, /noIndex && <meta name=["']robots["'] content=["']noindex, nofollow["']/);
});
