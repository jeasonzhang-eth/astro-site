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

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function blocks(value: unknown, field: string, id: string): PortableTextBlock[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Sanity Note ${id} has invalid ${field}`);
  }

  for (const entry of value) {
    if (!isRecord(entry) || !isNonEmptyString(entry._key) || !isNonEmptyString(entry._type)) {
      throw new Error(`Sanity Note ${id} has invalid ${field}`);
    }

    if (entry._type === "block") {
      if (!Array.isArray(entry.children) || !entry.children.every((child) => (
        isRecord(child)
        && isNonEmptyString(child._key)
        && child._type === "span"
        && Array.isArray(child.marks)
        && child.marks.every((mark) => typeof mark === "string")
        && typeof child.text === "string"
      ))) {
        throw new Error(`Sanity Note ${id} has invalid ${field}`);
      }
    }
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
    .map((block) => (block.children || []).map((child) => child.text).join(""))
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
