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

test("validation rejects unsupported top-level Portable Text object types", () => {
  assert.throws(
    () => validateNotes([{
      ...note("zh", "hello"),
      content: [block("Before"), { _key: "video-1", _type: "video", url: "https://example.com/video" }],
    }]),
    /unsupported.*video/i,
  );
});

test("validation accepts only schema-valid images and strips unknown image fields", () => {
  const image = {
    _key: "image-1",
    _type: "image",
    asset: { _type: "reference", _ref: "image-abc-1400x800-jpg" },
    alt: "Architecture diagram",
    caption: "System overview",
    crop: { _type: "sanity.imageCrop", top: 0, bottom: 0.1, left: 0, right: 0 },
    hotspot: { _type: "sanity.imageHotspot", x: 0.5, y: 0.5, height: 0.8, width: 0.9 },
    unsafeExtra: "drop me",
  };
  const [validated] = validateNotes([{
    ...note("zh", "hello"),
    content: [block("Before"), image],
  }]);

  assert.deepEqual(validated.content[1], {
    _key: image._key,
    _type: image._type,
    asset: image.asset,
    alt: image.alt,
    caption: image.caption,
    crop: image.crop,
    hotspot: image.hotspot,
  });

  const invalidImages = [
    { _key: "image", _type: "image", asset: { _type: "reference", _ref: "image-ref" } },
    { _key: "image", _type: "image", asset: { _ref: "image-ref" }, alt: "Alt" },
    { _key: "image", _type: "image", asset: { _type: "reference", _ref: "" }, alt: "Alt" },
    { _key: "image", _type: "image", asset: { _type: "reference", _ref: "image-ref" }, alt: " " },
    { _key: "image", _type: "image", asset: { _type: "reference", _ref: "image-ref" }, alt: "Alt", caption: 42 },
    { _key: "image", _type: "image", asset: { _type: "reference", _ref: "image-ref" }, alt: "Alt", crop: { top: "0" } },
    { _key: "image", _type: "image", asset: { _type: "reference", _ref: "image-ref" }, alt: "Alt", hotspot: { x: 2, y: 0.5, height: 1, width: 1 } },
  ];

  for (const invalidImage of invalidImages) {
    assert.throws(
      () => validateNotes([{ ...note("zh", "hello"), content: [invalidImage] }]),
      /content.*image/i,
    );
  }
});

test("validation accepts schema-valid code blocks and rejects missing or invalid code metadata", () => {
  const [validated] = validateNotes([{
    ...note("en", "code"),
    content: [{
      _key: "code-1",
      _type: "codeBlock",
      code: "console.log('safe')",
      language: "js",
      filename: "example.js",
      unsafeExtra: true,
    }],
  }]);

  assert.deepEqual(validated.content[0], {
    _key: "code-1",
    _type: "codeBlock",
    code: "console.log('safe')",
    language: "js",
    filename: "example.js",
  });

  for (const invalidCode of [
    { _key: "code", _type: "codeBlock" },
    { _key: "code", _type: "codeBlock", code: "" },
    { _key: "code", _type: "codeBlock", code: "   " },
    { _key: "code", _type: "codeBlock", code: "ok", language: 42 },
    { _key: "code", _type: "codeBlock", code: "ok", filename: false },
  ]) {
    assert.throws(
      () => validateNotes([{ ...note("en", "code"), content: [invalidCode] }]),
      /content.*codeBlock/i,
    );
  }
});

test("validation enforces link mark definitions and mark references", () => {
  const linkedBlock = {
    _key: "block",
    _type: "block",
    style: "normal",
    markDefs: [{
      _key: "link-1",
      _type: "link",
      href: "https://example.com/path?q=1",
      openInNewTab: true,
    }],
    children: [{ _key: "span", _type: "span", marks: ["strong", "link-1"], text: "Safe link" }],
  };
  const [validated] = validateNotes([{ ...note("en", "links"), content: [linkedBlock] }]);
  assert.deepEqual(validated.content[0], linkedBlock);

  const invalidBlocks = [
    { ...linkedBlock, markDefs: undefined },
    { ...linkedBlock, markDefs: [{ _key: "link-1", _type: "internalLink", href: "https://example.com" }] },
    { ...linkedBlock, markDefs: [{ _key: "", _type: "link", href: "https://example.com" }] },
    { ...linkedBlock, markDefs: [{ _key: "link-1", _type: "link", href: "javascript:alert(1)" }] },
    { ...linkedBlock, markDefs: [{ _key: "link-1", _type: "link", href: "data:text/html,pwned" }] },
    { ...linkedBlock, markDefs: [{ _key: "link-1", _type: "link", href: "/relative/path" }] },
    { ...linkedBlock, markDefs: [{ _key: "link-1", _type: "link", href: "https://example.com", openInNewTab: "yes" }] },
    { ...linkedBlock, children: [{ _key: "span", _type: "span", marks: ["missing-link"], text: "Broken" }] },
  ];

  for (const invalidBlock of invalidBlocks) {
    assert.throws(
      () => validateNotes([{ ...note("en", "links"), content: [invalidBlock] }]),
      /content.*mark/i,
    );
  }
});

test("validation reconstructs SEO fields and rejects invalid SEO types", () => {
  const [validated] = validateNotes([{
    ...note("en", "seo"),
    seo: {
      title: "SEO title",
      description: "SEO description",
      keywords: ["one", "two"],
      noIndex: true,
      shareImage: { _type: "image" },
      unsafeExtra: "drop me",
    },
  }]);

  assert.deepEqual(validated.seo, {
    title: "SEO title",
    description: "SEO description",
    keywords: ["one", "two"],
    noIndex: true,
  });

  const [missingOptionalSeo] = validateNotes([{
    ...note("zh", "seo-null"),
    seo: { title: null, description: null, keywords: null, noIndex: null },
  }]);
  assert.deepEqual(missingOptionalSeo.seo, {});

  for (const seo of [
    { title: 42 },
    { description: false },
    { keywords: "one,two" },
    { keywords: ["one", 2] },
    { noIndex: "true" },
  ]) {
    assert.throws(() => validateNotes([{ ...note("en", "seo"), seo }]), /seo/);
  }
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
    markDefs: [],
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
  assert.match(renderer, /SanityLink/);
  assert.match(renderer, /type:\s*\{[^}]*image:\s*SanityImage[^}]*codeBlock:\s*SanityCodeBlock/s);
  assert.match(renderer, /mark:\s*\{[^}]*link:\s*SanityLink/s);
  assert.match(renderer, /onMissingComponent/);
  assert.match(renderer, /throw new Error\(`Unsupported Portable Text component:/);
});

test("Sanity link rendering revalidates hrefs and scopes new-tab attributes", () => {
  const linkRenderer = source("../src/components/notes/SanityLink.astro");

  assert.match(linkRenderer, /assertSafePortableTextHref/);
  assert.match(linkRenderer, /openInNewTab === true/);
  assert.match(linkRenderer, /target=\{openInNewTab \? ["']_blank["'] : undefined\}/);
  assert.match(linkRenderer, /rel=\{openInNewTab \? ["']noopener noreferrer["'] : undefined\}/);
  assert.doesNotMatch(linkRenderer, /set:html/);
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
  assert.match(codeRenderer, /!node\.code\.trim\(\)/);
  assert.match(codeRenderer, /throw new Error/);
  assert.match(codeRenderer, /language-\$\{node\.language\}/);
  assert.match(codeRenderer, /<pre><code/);
  assert.match(codeRenderer, /\{node\.code\}/);
  assert.doesNotMatch(codeRenderer, /set:html/);
});

test("Base layout separates language-switch navigation from indexable SEO alternates", () => {
  const layout = source("../src/layouts/BaseLayout.astro");
  const notePage = source("../src/pages/[lang]/notes/[slug].astro");
  const seo = source("../src/components/Seo.astro");

  assert.match(layout, /alternatePath\?: string/);
  assert.match(layout, /noIndex\?: boolean/);
  assert.match(layout, /alternateSeoPath\?: string \| null/);
  assert.match(layout, /buildLanguageAlternates/);
  assert.match(notePage, /alternate\.seo\?\.noIndex !== true \? alternatePath : null/);
  assert.match(notePage, /alternateSeoPath=\{alternateSeoPath\}/);
  assert.match(layout, /<Seo[^>]*noIndex=\{noIndex\}/s);
  assert.match(seo, /noIndex\?: boolean/);
  assert.match(seo, /noIndex && <meta name=["']robots["'] content=["']noindex, nofollow["']/);
});
