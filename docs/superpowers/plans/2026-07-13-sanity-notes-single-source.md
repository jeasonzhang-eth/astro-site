# Sanity Notes Single-Source Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate all eight bilingual Note documents to Sanity and make the Astro homepage, Note directories, Note detail routes, Sitemap, and `llms.txt` consume Sanity as their only Notes source.

**Architecture:** Astro performs one memoized GROQ query during each static build, validates and pairs the returned published Note documents, and passes them to every Notes consumer. A temporary exporter converts the four existing local Note pairs into deterministic Sanity NDJSON documents; after import validation, the local `notes` export and exporter are deleted so a broken Sanity query fails the build instead of falling back.

**Tech Stack:** Astro 7, TypeScript 6, Node test runner, `tsx@4.23.1`, `@types/node@26.1.1`, `@sanity/client@7.23.0`, `@sanity/image-url@2.1.1`, `astro-portabletext@0.13.0`, Sanity CLI 7, GROQ, Portable Text.

## Global Constraints

- Sanity project ID is `7lstorz2`; dataset is `production`; API version is fixed at `2026-07-13`.
- Sanity is the only Notes source after cutover; no local runtime or build-time fallback is allowed.
- Published website reads use no write token and never query drafts.
- Migration uses deterministic IDs and the authenticated Sanity CLI import command; no token is committed.
- Both `en` and `zh` variants must exist for every migrated `translationKey` before local Notes are removed.
- Existing public Note URLs must remain unchanged.
- Production deployment is excluded; only local build and browser verification are allowed.
- Every code commit updates `/Users/zhangjie/Documents/Jeason的创作/code/personal/astro-site/CHANGELOG.md`.
- Final submodule changes update the parent pointer and `04 - MANAGEMENT/子模块管理/submodules_export.*` without staging unrelated parent changes.

## File Responsibility Map

**Create in `/Users/zhangjie/Documents/Jeason的创作/code/personal/astro-site`:**

- `.env.example` — public Sanity build identifiers.
- `src/lib/sanity/config.ts` — validated build-time Sanity configuration.
- `src/lib/sanity/client.ts` — one configured read client.
- `src/lib/sanity/types.ts` — canonical Note and Portable Text types.
- `src/lib/sanity/queries.ts` — the published Notes GROQ query.
- `src/lib/sanity/notes.ts` — response validation, memoized fetch, pairing, sorting, and plain-text conversion.
- `src/lib/sanity/image.ts` — Sanity image URL builder.
- `src/components/notes/PortableNoteBody.astro` — Portable Text renderer mapping.
- `src/components/notes/SanityImage.astro` — accessible Sanity image rendering.
- `src/components/notes/SanityCodeBlock.astro` — code-block rendering.
- `scripts/sanity/portable-text.ts` — deterministic local-section-to-Portable-Text conversion.
- `scripts/export-local-notes.ts` — temporary local Note NDJSON exporter; delete at cutover.
- `scripts/validate-sanity-notes.ts` — compares the imported Sanity dataset to the temporary manifest.
- `tests/sanity-config.test.ts` — configuration contracts.
- `tests/sanity-notes.test.ts` — query, validation, duplicate, pairing, and plain-text contracts.
- `tests/sanity-migration.test.ts` — deterministic migration conversion contracts.

**Modify:**

- `package.json`, `package-lock.json` — dependencies and unit-test/migration scripts.
- `src/pages/[lang]/index.astro` — Sanity homepage Note cards.
- `src/pages/[lang]/notes/index.astro` — Sanity Note directory.
- `src/pages/[lang]/notes/[slug].astro` — Sanity routes, Portable Text, pair-aware alternates, JSON-LD.
- `src/pages/sitemap.xml.ts` — asynchronous Sanity Note routes.
- `src/pages/llms.txt.ts` — asynchronous Sanity Note inventory.
- `src/data/site.ts` — rename static SEO helper and finally delete local Note content/types.
- `src/layouts/BaseLayout.astro` — actual alternate-language path and `noIndex` propagation.
- `src/components/Seo.astro` — conditional robots metadata and partial alternates.
- `src/styles/global.css` — Portable Text image, code, list, and caption styles.
- `tests/integrated-site.test.mjs` — built Sanity Note route and SEO discovery contracts.
- `CHANGELOG.md` — task-level release notes.

---

### Task 1: Install the real dependencies and validate Sanity configuration

**Files:**
- Create: `.env.example`
- Create: `src/lib/sanity/config.ts`
- Create: `src/lib/sanity/client.ts`
- Create: `tests/sanity-config.test.ts`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Produces: `getSanityConfig(env?: Record<string, string | undefined>): {projectId: string; dataset: string; apiVersion: string}`
- Produces: `getSanityClient()` returning one lazily configured published-read client.

- [ ] **Step 1: Install exact dependency ranges**

Run:

```bash
cd "/Users/zhangjie/Documents/Jeason的创作/code/personal/astro-site"
npm install @sanity/client@^7.23.0 @sanity/image-url@^2.1.1 astro-portabletext@^0.13.0
npm install --save-dev tsx@^4.23.1 @types/node@^26.1.1
```

Expected: `package-lock.json` updates and npm exits 0.

- [ ] **Step 2: Add unit-test and migration script entries**

Modify `package.json` scripts to exactly include:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "test:unit": "tsx --test tests/*.test.ts",
    "test:site": "npm run build && node --test tests/*.test.mjs",
    "test": "npm run test:unit && npm run test:site",
    "notes:export": "tsx scripts/export-local-notes.ts",
    "notes:validate": "tsx scripts/validate-sanity-notes.ts",
    "verify": "npm run astro -- check && npm test"
  }
}
```

- [ ] **Step 3: Write the failing configuration test**

Create `tests/sanity-config.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { getSanityConfig } from "../src/lib/sanity/config";

test("Sanity configuration requires a project ID", () => {
  assert.throws(
    () => getSanityConfig({ SANITY_DATASET: "production", SANITY_API_VERSION: "2026-07-13" }),
    /SANITY_PROJECT_ID/,
  );
});

test("Sanity configuration returns the fixed production settings", () => {
  assert.deepEqual(
    getSanityConfig({
      SANITY_PROJECT_ID: "7lstorz2",
      SANITY_DATASET: "production",
      SANITY_API_VERSION: "2026-07-13",
    }),
    { projectId: "7lstorz2", dataset: "production", apiVersion: "2026-07-13" },
  );
});
```

- [ ] **Step 4: Run the test and observe the missing-module failure**

Run:

```bash
npm run test:unit -- --test-name-pattern="Sanity configuration"
```

Expected: FAIL because `src/lib/sanity/config.ts` does not exist.

- [ ] **Step 5: Implement strict configuration**

Create `.env.example`:

```dotenv
SANITY_PROJECT_ID=7lstorz2
SANITY_DATASET=production
SANITY_API_VERSION=2026-07-13
```

Create `src/lib/sanity/config.ts`:

```ts
export type SanityConfig = {
  projectId: string;
  dataset: string;
  apiVersion: string;
};

export function getSanityConfig(env?: Record<string, string | undefined>): SanityConfig {
  const source = env || (typeof import.meta.env === "object" ? import.meta.env : process.env);
  const projectId = source.SANITY_PROJECT_ID;
  const dataset = source.SANITY_DATASET || "production";
  const apiVersion = source.SANITY_API_VERSION || "2026-07-13";

  if (!projectId) throw new Error("Missing SANITY_PROJECT_ID; the Notes build requires Sanity.");
  if (!/^[a-z0-9-]+$/.test(dataset)) throw new Error(`Invalid SANITY_DATASET: ${dataset}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(apiVersion)) throw new Error(`Invalid SANITY_API_VERSION: ${apiVersion}`);

  return { projectId, dataset, apiVersion };
}
```

Create `src/lib/sanity/client.ts`:

```ts
import { createClient } from "@sanity/client";
import { getSanityConfig } from "./config";

let client: ReturnType<typeof createClient> | undefined;

export function getSanityClient() {
  client ||= createClient({
    ...getSanityConfig(),
    useCdn: true,
    perspective: "published",
  });
  return client;
}
```

- [ ] **Step 6: Run the focused and full unit tests**

Run:

```bash
npm run test:unit
```

Expected: both configuration tests PASS.

- [ ] **Step 7: Update the changelog and commit**

Add under `## 2026-07-13`:

```markdown
- Added strict build-time Sanity configuration and the API/rendering dependencies for the Notes single-source migration.
```

Run:

```bash
git add package.json package-lock.json .env.example src/lib/sanity/config.ts src/lib/sanity/client.ts tests/sanity-config.test.ts CHANGELOG.md
git commit -m "feat: add Sanity Notes build client"
```

---

### Task 2: Add the canonical Note query, validation, pairing, and memoized fetch

**Files:**
- Create: `src/lib/sanity/types.ts`
- Create: `src/lib/sanity/queries.ts`
- Create: `src/lib/sanity/notes.ts`
- Create: `tests/sanity-notes.test.ts`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Produces: `SanityNote`, `PortableTextBlock`, and `SanityNotePair` types.
- Produces: `PUBLISHED_NOTES_QUERY`.
- Produces: `validateNotes(value: unknown): SanityNote[]`.
- Produces: `pairNotes(notes: SanityNote[]): Map<string, SanityNotePair>`.
- Produces: `getAllPublishedNotes(): Promise<SanityNote[]>`.
- Produces: `portableTextToPlainText(blocks: PortableTextBlock[]): string`.

- [ ] **Step 1: Write failing data-layer tests**

Create `tests/sanity-notes.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { PUBLISHED_NOTES_QUERY } from "../src/lib/sanity/queries";
import { pairNotes, portableTextToPlainText, validateNotes } from "../src/lib/sanity/notes";

const block = (text: string) => ({
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
  assert.equal(pairs.get("paired-note")?.zh.slug, "zh-slug");
  assert.equal(pairs.get("paired-note")?.en.slug, "en-slug");
});

test("Portable Text converts to plain text for JSON-LD", () => {
  assert.equal(portableTextToPlainText([block("First"), block("Second")]), "First Second");
});
```

- [ ] **Step 2: Run tests and verify missing modules fail**

Run:

```bash
npm run test:unit
```

Expected: FAIL because `queries.ts` and `notes.ts` do not exist.

- [ ] **Step 3: Define canonical types and GROQ**

Create `src/lib/sanity/types.ts`:

```ts
export type SanityLanguage = "en" | "zh";

export type PortableTextSpan = {
  _key: string;
  _type: "span";
  marks: string[];
  text: string;
};

export type PortableTextBlock = {
  _key: string;
  _type: string;
  style?: string;
  listItem?: "bullet" | "number";
  level?: number;
  markDefs?: Array<Record<string, unknown>>;
  children?: PortableTextSpan[];
  [key: string]: unknown;
};

export type SanityNote = {
  _id: string;
  title: string;
  slug: string;
  language: SanityLanguage;
  translationKey: string;
  summary: string;
  tags: string[];
  content: PortableTextBlock[];
  faq: Array<{ question: string; answer: PortableTextBlock[] }>;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    noIndex?: boolean;
  };
  publishedAt: string;
  updatedAt?: string;
  featured: boolean;
};

export type SanityNotePair = Partial<Record<SanityLanguage, SanityNote>>;
```

Create `src/lib/sanity/queries.ts`:

```ts
export const PUBLISHED_NOTES_QUERY = `
  *[
    _type == "note" &&
    !(_id in path("drafts.**")) &&
    defined(slug.current)
  ] | order(featured desc, publishedAt desc, title asc) {
    _id,
    title,
    "slug": slug.current,
    language,
    translationKey,
    summary,
    tags,
    content,
    faq[]{question, answer},
    seo{title, description, keywords, noIndex},
    publishedAt,
    updatedAt,
    featured
  }
`;
```

- [ ] **Step 4: Implement validation, pairing, plain text, and memoization**

Create `src/lib/sanity/notes.ts`:

```ts
import { getSanityClient } from "./client";
import { PUBLISHED_NOTES_QUERY } from "./queries";
import type { PortableTextBlock, SanityLanguage, SanityNote, SanityNotePair } from "./types";

const languages = new Set<SanityLanguage>(["en", "zh"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(document: Record<string, unknown>, field: string): string {
  const value = document[field];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Sanity Note ${String(document._id || "<unknown>")} has invalid ${field}`);
  }
  return value;
}

function blocks(value: unknown, field: string, id: string): PortableTextBlock[] {
  if (!Array.isArray(value) || value.length === 0 || !value.every(isRecord)) {
    throw new Error(`Sanity Note ${id} has invalid ${field}`);
  }
  return value as PortableTextBlock[];
}

export function validateNotes(value: unknown): SanityNote[] {
  if (!Array.isArray(value)) throw new Error("Sanity Notes response must be an array");
  const routes = new Set<string>();
  const ids = new Set<string>();

  const notes = value.map((raw) => {
    if (!isRecord(raw)) throw new Error("Sanity Note must be an object");
    const _id = requiredString(raw, "_id");
    const title = requiredString(raw, "title");
    const slug = requiredString(raw, "slug");
    const language = requiredString(raw, "language") as SanityLanguage;
    const translationKey = requiredString(raw, "translationKey");
    const summary = requiredString(raw, "summary");
    const publishedAt = requiredString(raw, "publishedAt");

    if (!languages.has(language)) throw new Error(`Sanity Note ${_id} has unsupported language ${language}`);
    if (ids.has(_id)) throw new Error(`Sanity Notes contain duplicate id ${_id}`);
    ids.add(_id);

    const route = `${language}/${slug}`;
    if (routes.has(route)) throw new Error(`Sanity Notes contain duplicate route ${route}`);
    routes.add(route);

    const faq = raw.faq == null
      ? []
      : Array.isArray(raw.faq)
        ? raw.faq.map((item, index) => {
            if (!isRecord(item)) throw new Error(`Sanity Note ${_id} has invalid faq[${index}]`);
            return {
              question: requiredString(item, "question"),
              answer: blocks(item.answer, `faq[${index}].answer`, _id),
            };
          })
        : (() => { throw new Error(`Sanity Note ${_id} has invalid faq`); })();

    return {
      _id,
      title,
      slug,
      language,
      translationKey,
      summary,
      tags: Array.isArray(raw.tags) ? raw.tags.filter((tag): tag is string => typeof tag === "string") : [],
      content: blocks(raw.content, "content", _id),
      faq,
      seo: isRecord(raw.seo) ? raw.seo as SanityNote["seo"] : undefined,
      publishedAt,
      updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : undefined,
      featured: raw.featured === true,
    } satisfies SanityNote;
  });

  return notes;
}

export function pairNotes(notes: SanityNote[]): Map<string, SanityNotePair> {
  const pairs = new Map<string, SanityNotePair>();
  for (const note of notes) {
    const pair = pairs.get(note.translationKey) || {};
    if (pair[note.language]) throw new Error(`Duplicate ${note.language} translation for ${note.translationKey}`);
    pair[note.language] = note;
    pairs.set(note.translationKey, pair);
  }
  return pairs;
}

export function portableTextToPlainText(blocks: PortableTextBlock[]): string {
  return blocks
    .filter((block) => block._type === "block" && Array.isArray(block.children))
    .flatMap((block) => block.children || [])
    .map((child) => child.text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

let notesPromise: Promise<SanityNote[]> | undefined;

export function getAllPublishedNotes(): Promise<SanityNote[]> {
  notesPromise ||= getSanityClient().fetch<unknown>(PUBLISHED_NOTES_QUERY).then((value) => {
    const notes = validateNotes(value);
    if (notes.length === 0) throw new Error("Sanity returned zero published Notes; refusing a partial build");
    return notes;
  });
  return notesPromise;
}
```

- [ ] **Step 5: Run tests**

Run:

```bash
npm run test:unit
```

Expected: all configuration and data-layer tests PASS.

- [ ] **Step 6: Update changelog and commit**

Add:

```markdown
- Added the published Notes GROQ query, strict API response validation, route collision detection, bilingual pairing, and one-snapshot build fetch.
```

Run:

```bash
git add src/lib/sanity tests/sanity-notes.test.ts CHANGELOG.md
git commit -m "feat: add Sanity Notes data layer"
```

---

### Task 3: Convert the four local Note pairs and import eight deterministic Sanity documents

**Files:**
- Create: `scripts/sanity/portable-text.ts`
- Create: `scripts/export-local-notes.ts`
- Create: `scripts/validate-sanity-notes.ts`
- Create: `tests/sanity-migration.test.ts`
- Modify: `CHANGELOG.md`
- Temporary output: `/tmp/astro-site-notes-2026-07-13.ndjson`
- Temporary manifest: `/tmp/astro-site-notes-2026-07-13.json`

**Interfaces:**
- Produces: `convertLocalNoteContent(content, language): PortableTextBlock[]`.
- Produces: deterministic document IDs `note.<translationKey>.<language>`.
- Consumes: existing `notes` export only before Task 7 deletes it.

- [ ] **Step 1: Write the failing migration tests**

Create `tests/sanity-migration.test.ts` with a minimal local content fixture and assertions for section order, bullet/number lists, deterministic keys, and FAQ paragraph conversion:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { convertFaqAnswer, convertLocalNoteContent } from "../scripts/sanity/portable-text";

const local = {
  title: "Title",
  tag: "Tag",
  summary: "Summary",
  definition: "Definition text",
  overview: "Overview text",
  principles: ["Principle one", "Principle two"],
  checklist: ["Check one", "Check two"],
  examples: ["Example one"],
  next: "Next text",
  faq: [{ question: "Question", answer: "Answer" }],
};

test("migration preserves section and list order", () => {
  const blocks = convertLocalNoteContent(local, "en");
  assert.deepEqual(
    blocks.filter((block) => block.style === "h2").map((block) => block.children?.[0]?.text),
    ["Definition", "Overview", "Principles", "Checklist", "Examples", "Next steps"],
  );
  assert.deepEqual(
    blocks.filter((block) => block.listItem === "number").map((block) => block.children?.[0]?.text),
    ["Check one", "Check two"],
  );
});

test("migration keys are deterministic", () => {
  assert.deepEqual(convertLocalNoteContent(local, "zh"), convertLocalNoteContent(local, "zh"));
});

test("FAQ answers become Portable Text paragraphs", () => {
  assert.equal(convertFaqAnswer("Answer")[0]?.children?.[0]?.text, "Answer");
});
```

- [ ] **Step 2: Run tests and verify failure**

Run:

```bash
npm run test:unit
```

Expected: FAIL because `scripts/sanity/portable-text.ts` does not exist.

- [ ] **Step 3: Implement deterministic Portable Text conversion**

Create `scripts/sanity/portable-text.ts` with:

```ts
import { createHash } from "node:crypto";
import type { PortableTextBlock, SanityLanguage } from "../../src/lib/sanity/types";

export type LocalNoteContent = {
  title: string;
  tag: string;
  summary: string;
  definition: string;
  overview: string;
  principles: string[];
  checklist: string[];
  examples: string[];
  next: string;
  faq: Array<{ question: string; answer: string }>;
};

const headings = {
  en: ["Definition", "Overview", "Principles", "Checklist", "Examples", "Next steps"],
  zh: ["定义", "概览", "原则", "检查清单", "示例", "下一步"],
} as const;

function key(seed: string): string {
  return createHash("sha1").update(seed).digest("hex").slice(0, 12);
}

function textBlock(seed: string, text: string, style = "normal", listItem?: "bullet" | "number"): PortableTextBlock {
  return {
    _key: key(`block:${seed}`),
    _type: "block",
    style,
    ...(listItem ? { listItem, level: 1 } : {}),
    markDefs: [],
    children: [{ _key: key(`span:${seed}`), _type: "span", marks: [], text }],
  };
}

export function convertFaqAnswer(answer: string): PortableTextBlock[] {
  return [textBlock(`faq:${answer}`, answer)];
}

export function convertLocalNoteContent(content: LocalNoteContent, language: SanityLanguage): PortableTextBlock[] {
  const [definition, overview, principles, checklist, examples, next] = headings[language];
  return [
    textBlock(`${language}:definition:h`, definition, "h2"),
    textBlock(`${language}:definition:p:${content.definition}`, content.definition),
    textBlock(`${language}:overview:h`, overview, "h2"),
    textBlock(`${language}:overview:p:${content.overview}`, content.overview),
    textBlock(`${language}:principles:h`, principles, "h2"),
    ...content.principles.map((item, index) => textBlock(`${language}:principle:${index}:${item}`, item, "normal", "bullet")),
    textBlock(`${language}:checklist:h`, checklist, "h2"),
    ...content.checklist.map((item, index) => textBlock(`${language}:check:${index}:${item}`, item, "normal", "number")),
    textBlock(`${language}:examples:h`, examples, "h2"),
    ...content.examples.map((item, index) => textBlock(`${language}:example:${index}:${item}`, item, "normal", "bullet")),
    textBlock(`${language}:next:h`, next, "h2"),
    textBlock(`${language}:next:p:${content.next}`, content.next),
  ];
}
```

- [ ] **Step 4: Run migration unit tests**

Run:

```bash
npm run test:unit
```

Expected: migration tests PASS.

- [ ] **Step 5: Implement the temporary exporter**

Create `scripts/export-local-notes.ts` so it imports `notes` from `src/data/site.ts`, creates two documents per source entry, assigns IDs `note.<slug>.<language>`, retains the shared slug and translation key, converts the first tag and FAQ, and writes both the JSON manifest and line-delimited NDJSON. Use the fixed base timestamp `2026-07-13T00:00:00.000Z`, subtracting one minute per source Note index so current ordering is stable.

The document creation expression must be:

```ts
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
```

The script must require exactly two output paths:

```bash
npm run notes:export -- /tmp/astro-site-notes-2026-07-13.json /tmp/astro-site-notes-2026-07-13.ndjson
```

It exits non-zero unless it writes exactly 8 documents, 4 English and 4 Chinese.

- [ ] **Step 6: Export and inspect the temporary artifacts**

Run:

```bash
npm run notes:export -- /tmp/astro-site-notes-2026-07-13.json /tmp/astro-site-notes-2026-07-13.ndjson
jq 'length' /tmp/astro-site-notes-2026-07-13.json
wc -l /tmp/astro-site-notes-2026-07-13.ndjson
jq -r '.[].language' /tmp/astro-site-notes-2026-07-13.json | sort | uniq -c
```

Expected:

```text
8
8 /tmp/astro-site-notes-2026-07-13.ndjson
4 en
4 zh
```

- [ ] **Step 7: Import with deterministic replacement semantics**

Run from the CMS repository so the authenticated Sanity CLI is used:

```bash
cd "/Users/zhangjie/Documents/Jeason的创作/code/personal/astro-site-cms"
npx sanity datasets import \
  --project-id 7lstorz2 \
  --dataset production \
  --replace \
  /tmp/astro-site-notes-2026-07-13.ndjson
```

Expected: 8 documents imported/replaced and exit 0.

- [ ] **Step 8: Implement and run remote validation**

Create `scripts/validate-sanity-notes.ts` to read the JSON manifest, query the public Content Lake with `@sanity/client`, run `validateNotes`, and compare sorted tuples of `_id`, language, slug, translation key, FAQ count, and top-level content block count. It exits non-zero on any mismatch or incomplete pair.

Run:

```bash
npm run notes:validate -- /tmp/astro-site-notes-2026-07-13.json
```

Expected:

```text
Validated 8 Sanity Notes: 4 en, 4 zh, 4 complete translation pairs.
```

- [ ] **Step 9: Update changelog and commit migration tooling**

Add:

```markdown
- Added deterministic Portable Text migration tooling and imported the four bilingual local Note pairs as eight validated Sanity documents.
```

Run:

```bash
git add scripts tests/sanity-migration.test.ts CHANGELOG.md
git commit -m "feat: migrate local Notes to Sanity"
```

---

### Task 4: Render Portable Text and propagate real alternate paths and no-index metadata

**Files:**
- Create: `src/lib/sanity/image.ts`
- Create: `src/components/notes/PortableNoteBody.astro`
- Create: `src/components/notes/SanityImage.astro`
- Create: `src/components/notes/SanityCodeBlock.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/components/Seo.astro`
- Modify: `src/styles/global.css`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Produces: `<PortableNoteBody value={note.content} />`.
- BaseLayout consumes: optional `alternatePath?: string` and `noIndex?: boolean`.

- [ ] **Step 1: Add failing source contracts**

Add tests to `tests/sanity-notes.test.ts` that read the renderer and SEO sources and assert they reference `astro-portabletext`, `SanityImage`, `SanityCodeBlock`, `alternatePath`, and `noIndex`. Run `npm run test:unit`; expect failure because the files do not exist.

- [ ] **Step 2: Add Sanity image URL construction**

Create `src/lib/sanity/image.ts`:

```ts
import imageUrlBuilder from "@sanity/image-url";
import { getSanityConfig } from "./config";

const builder = imageUrlBuilder(getSanityConfig());
export const sanityImageUrl = (source: unknown) => builder.image(source);
```

- [ ] **Step 3: Add custom image and code components**

`SanityImage.astro` must receive `Astro.props.node`, require `node.alt`, build a width-1400 auto-format URL, render lazy loading, and render `<figcaption>` only when a caption exists.

`SanityCodeBlock.astro` must receive `node.code`, `node.language`, and `node.filename`, render an optional filename paragraph, and render escaped code inside `<pre><code class:list={[node.language && `language-${node.language}`]}>`.

- [ ] **Step 4: Add the Portable Text wrapper**

Create `PortableNoteBody.astro`:

```astro
---
import { PortableText } from "astro-portabletext";
import type { PortableTextBlock } from "../../lib/sanity/types";
import SanityImage from "./SanityImage.astro";
import SanityCodeBlock from "./SanityCodeBlock.astro";

interface Props { value: PortableTextBlock[] }
const { value } = Astro.props;
const components = { type: { image: SanityImage, codeBlock: SanityCodeBlock } };
const onMissingComponent = (message: string) => { throw new Error(`Unsupported Portable Text component: ${message}`); };
---

<div class="portable-note-body">
  <PortableText value={value} {components} {onMissingComponent} />
</div>
```

- [ ] **Step 5: Correct language alternates and no-index behavior**

Modify `BaseLayout.astro` so alternates contain the current language path plus the explicit paired path only when it exists:

```ts
const alternates: Partial<Record<Language, string>> = { [language]: pathname };
if (alternatePath) alternates[otherLanguage] = alternatePath;
```

Add `noIndex?: boolean` to BaseLayout and Seo props, pass it through, and add to `Seo.astro`:

```astro
{noIndex && <meta name="robots" content="noindex, nofollow" />}
```

- [ ] **Step 6: Add Portable Text styles**

Append scoped selectors under `.portable-note-body` for H2/H3 spacing, paragraphs, lists, blockquotes, figure/image/caption, pre/code overflow, and links. Reuse existing CSS variables; do not introduce a new palette.

- [ ] **Step 7: Run checks and commit**

Run:

```bash
npm run test:unit
npm run astro -- check
```

Expected: PASS.

Add a changelog entry and commit:

```bash
git add src/components/notes src/lib/sanity/image.ts src/layouts/BaseLayout.astro src/components/Seo.astro src/styles/global.css tests/sanity-notes.test.ts CHANGELOG.md
git commit -m "feat: render Sanity Portable Text"
```

---

### Task 5: Cut the homepage and Note routes over to Sanity

**Files:**
- Modify: `src/pages/[lang]/index.astro`
- Modify: `src/pages/[lang]/notes/index.astro`
- Modify: `src/pages/[lang]/notes/[slug].astro`
- Modify: `tests/integrated-site.test.mjs`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: `getAllPublishedNotes`, `pairNotes`, `portableTextToPlainText`, `PortableNoteBody`.
- Produces: 8 static Note detail routes from Sanity.

- [ ] **Step 1: Write failing built-route contracts**

Extend `tests/integrated-site.test.mjs` with the expected migrated routes:

```js
const sanityNoteSlugs = ["ai-agent-workflow", "desktop-automation", "creator-tools", "market-research"];

test("Sanity publishes every migrated bilingual Note route", async () => {
  for (const slug of sanityNoteSlugs) {
    for (const language of ["en", "zh"]) {
      await assert.doesNotReject(access(`dist/${language}/notes/${slug}/index.html`));
    }
  }
});

test("migrated Note pages render Portable Text and FAQ structured data", async () => {
  const html = await read("dist/zh/notes/ai-agent-workflow/index.html");
  assert.match(html, /AI 智能体工作流/);
  assert.match(html, /检查清单/);
  assert.match(html, /"@type":"Article"/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /class="portable-note-body"/);
});
```

Run `npm run test:site`; expect failure until routes are converted.

- [ ] **Step 2: Convert the Note directory**

Make `getStaticPaths()` async, fetch all Notes once, filter by current language in page frontmatter, and map cards from Sanity fields. Use `note.tags[0] || copy.noteLabel` for the label.

- [ ] **Step 3: Convert Note detail routes**

Make `getStaticPaths()` fetch and validate all Notes, build the pair map, and emit:

```ts
return notes.map((note) => ({
  params: { lang: note.language, slug: note.slug },
  props: { note, alternate: pairs.get(note.translationKey)?.[note.language === "en" ? "zh" : "en"] },
}));
```

Render `PortableNoteBody`, retain FAQ `<details>`, generate Article and FAQPage JSON-LD, use SEO overrides, pass actual pair path as `alternatePath`, and pass `note.seo?.noIndex`.

- [ ] **Step 4: Convert homepage cards**

Replace the local `notes` import with `getAllPublishedNotes()`, filter by `language`, and preserve the current card markup and ordering.

- [ ] **Step 5: Run build and route tests**

Run:

```bash
npm run astro -- check
npm run test:site
```

Expected: 8 migrated detail routes exist and both added integration tests PASS.

- [ ] **Step 6: Update changelog and commit**

Add:

```markdown
- Switched homepage Note cards, bilingual Note directories, and all Note detail routes to the validated Sanity dataset and Portable Text renderer.
```

Commit:

```bash
git add src/pages tests/integrated-site.test.mjs CHANGELOG.md
git commit -m "feat: build Note pages from Sanity"
```

---

### Task 6: Make Sitemap and llms.txt use the same Sanity snapshot

**Files:**
- Modify: `src/data/site.ts`
- Modify: `src/pages/sitemap.xml.ts`
- Modify: `src/pages/llms.txt.ts`
- Modify: `tests/integrated-site.test.mjs`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Produces: `allStaticSeoPaths()` containing no Note routes.
- Sitemap and `llms.txt` append Sanity Note routes from `getAllPublishedNotes()`.

- [ ] **Step 1: Add failing discovery contracts**

Extend the existing discovery test to require all 8 Note URLs in both `sitemap.xml` and `llms.txt`, and add a source assertion that `allSeoPaths` is no longer used.

- [ ] **Step 2: Separate static paths from Sanity paths**

Rename `allSeoPaths()` to `allStaticSeoPaths()` and remove all Note entries from that helper.

- [ ] **Step 3: Make Sitemap asynchronous**

Implement:

```ts
export async function GET() {
  const notes = await getAllPublishedNotes();
  const paths = [
    ...allStaticSeoPaths(),
    ...notes.map((note) => localizePath(note.language, `notes/${note.slug}`)),
  ];
  // deduplicate, serialize, and return XML
}
```

- [ ] **Step 4: Make llms.txt asynchronous**

Remove the local Notes import, fetch Sanity Notes, group by `translationKey`, and emit each actual language/slug URL. Preserve all non-Note sections and verified company facts.

- [ ] **Step 5: Run discovery tests and commit**

Run:

```bash
npm run test:site
```

Expected: Sitemap and `llms.txt` contain every migrated Note URL.

Add changelog entry and commit:

```bash
git add src/data/site.ts src/pages/sitemap.xml.ts src/pages/llms.txt.ts tests/integrated-site.test.mjs CHANGELOG.md
git commit -m "feat: source Note discovery from Sanity"
```

---

### Task 7: Delete local Notes and prove there is no fallback

**Files:**
- Delete: `scripts/export-local-notes.ts`
- Modify: `src/data/site.ts`
- Modify: `package.json`
- Modify: `tests/sanity-notes.test.ts`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Removes: local `NoteContent` type and `notes` export.
- Removes: `notes:export` script.
- Keeps: remote validator and deterministic conversion tests as migration evidence.

- [ ] **Step 1: Add the no-local-source test**

Add to `tests/sanity-notes.test.ts`:

```ts
import { readFile } from "node:fs/promises";

const sourceFiles = [
  "src/data/site.ts",
  "src/pages/[lang]/index.astro",
  "src/pages/[lang]/notes/index.astro",
  "src/pages/[lang]/notes/[slug].astro",
  "src/pages/sitemap.xml.ts",
  "src/pages/llms.txt.ts",
];

test("Astro has no local Notes source or fallback import", async () => {
  const source = (await Promise.all(sourceFiles.map((file) => readFile(file, "utf8")))).join("\n");
  assert.doesNotMatch(source, /export const notes\b/);
  assert.doesNotMatch(source, /\bnotes\s*,?\s*from ["'][^"']*data\/site/);
  assert.doesNotMatch(source, /fallbackNotes|localNotes/);
});
```

Run `npm run test:unit`; expect failure while local Notes still exist.

- [ ] **Step 2: Remove local content and obsolete exporter**

Delete from `src/data/site.ts`:

- `NoteContent`
- the complete `export const notes = [...]` block
- any Note-only helper imports left unused

Delete `scripts/export-local-notes.ts` and remove `notes:export` from `package.json`.

- [ ] **Step 3: Run unit and full verification**

Run:

```bash
npm run test:unit
npm run verify
```

Expected: all checks PASS using only Sanity.

- [ ] **Step 4: Prove invalid Sanity configuration fails**

Run:

```bash
SANITY_PROJECT_ID=invalid-project-id SANITY_DATASET=production SANITY_API_VERSION=2026-07-13 npm run build
```

Expected: non-zero exit with a Sanity query/configuration error and no successful partial build claim.

Then restore the real configuration and run:

```bash
npm run build
```

Expected: exit 0 and all 8 Note detail routes present.

- [ ] **Step 5: Revalidate the remote dataset and delete temporary source artifacts**

Run:

```bash
npm run notes:validate -- /tmp/astro-site-notes-2026-07-13.json
rm /tmp/astro-site-notes-2026-07-13.json /tmp/astro-site-notes-2026-07-13.ndjson
```

Expected: remote validation passes before the temporary files are removed.

- [ ] **Step 6: Update changelog and commit the cutover**

Add:

```markdown
- Removed the local Notes dataset and exporter after verifying Sanity as the only source and confirming that invalid API configuration fails the build.
```

Commit:

```bash
git add -A src/data/site.ts scripts/export-local-notes.ts package.json tests/sanity-notes.test.ts CHANGELOG.md
git commit -m "refactor: remove local Notes source"
```

---

### Task 8: Final verification, documentation, push, and parent submodule governance

**Files:**
- Modify: `README.md`
- Modify: `CHANGELOG.md`
- Parent modify: `CHANGELOG.md`
- Parent modify: `code/personal/astro-site` pointer
- Parent modify: `04 - MANAGEMENT/子模块管理/submodules_export.{md,csv,html,json}`

- [ ] **Step 1: Document the Sanity-only operating workflow**

Add a README section containing:

- Sanity project `7lstorz2` / dataset `production`
- required `.env` values
- `npm run notes:validate -- <manifest>` usage for audit only
- `npm run verify`
- content publishing through Sanity Studio
- explicit statement that Notes have no local fallback
- explicit statement that a Sanity outage blocks new builds but does not affect already-deployed static HTML

- [ ] **Step 2: Run fresh final verification**

Run:

```bash
npm run verify
npx sanity projects list
npx sanity datasets list
find dist/en/notes dist/zh/notes -mindepth 2 -maxdepth 2 -name index.html | sort
rg -n "ai-agent-workflow|desktop-automation|creator-tools|market-research" dist/sitemap.xml dist/llms.txt
rg -n "export const notes|fallbackNotes|localNotes" src scripts tests
```

Expected:

- `npm run verify` exits 0.
- Sanity project `7lstorz2` and dataset `production` are present.
- Exactly 8 migrated Note detail `index.html` files are listed.
- All four slugs occur in Sitemap and `llms.txt`.
- The final source search finds no local Notes export or fallback identifier.

- [ ] **Step 3: Commit and push the Astro repository**

```bash
git add README.md CHANGELOG.md
git commit -m "docs: document Sanity Notes workflow"
git status --short
git push origin master
```

Expected: child working tree clean and local `master` equals `origin/master`.

- [ ] **Step 4: Refresh parent governance without staging unrelated work**

From `/Users/zhangjie/Documents/Jeason的创作`:

```bash
bash ~/.claude/skills/git-submodule-manager/scripts/export_submodules.sh
```

Add one parent changelog line describing the Sanity-only Notes cutover. Stage only that changelog hunk, the `code/personal/astro-site` pointer, and the four export files.

- [ ] **Step 5: Verify and commit the parent pointer**

```bash
child_sha=$(git -C code/personal/astro-site rev-parse HEAD)
pointer_sha=$(git ls-files -s code/personal/astro-site | awk '{print $2}')
test "$child_sha" = "$pointer_sha"
test "$(jq '.submodules | length' '04 - MANAGEMENT/子模块管理/submodules_export.json')" = 48
git diff --cached --check
git commit -m "feat: track Sanity-only Notes cutover"
```

Expected: parent pointer equals the final child SHA; parent remains local-only and is not pushed.

- [ ] **Step 6: Confirm no deployment occurred**

Verify no new production release directory, Nginx switch, SSH deployment, or domain change occurred during this plan. Report the local build and Sanity migration as complete, with production deployment awaiting a separate explicit instruction.
