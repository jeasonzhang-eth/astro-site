import { buildNoteDiscoveryEntries } from "../discovery/serialize";
import { getSanityClient } from "./client";
import { PUBLISHED_NOTES_QUERY } from "./queries";
import type {
  PortableTextBlock,
  PortableTextCodeBlock,
  PortableTextImage,
  PortableTextLinkMarkDef,
  PortableTextNode,
  SanityImageCrop,
  SanityImageHotspot,
  SanityLanguage,
  SanityNote,
  SanityNotePair,
  SanityNoteSeo,
} from "./types";

export const REQUIRED_MIGRATED_NOTE_TRANSLATION_KEYS = [
  "ai-agent-workflow",
  "desktop-automation",
  "creator-tools",
  "market-research",
] as const;

const languages = new Set<SanityLanguage>(["en", "zh"]);
const allowedDecorators = new Set(["strong", "em", "code"]);
const allowedBlockStyles = new Set(["normal", "h2", "h3", "blockquote"]);
const allowedListItems = new Set(["bullet", "number"]);
const controlCharacters = /[\u0000-\u001f\u007f]/;

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

function portableTextError(id: string, field: string, detail: string): never {
  throw new Error(`Sanity Note ${id} has invalid ${field}: ${detail}`);
}

export function isSafePortableTextHref(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim() || value.trim() !== value || controlCharacters.test(value)) {
    return false;
  }

  const scheme = value.match(/^([a-z][a-z0-9+.-]*):/i)?.[1]?.toLowerCase();
  if (!scheme || !["http", "https", "mailto", "tel"].includes(scheme)) return false;

  if (scheme === "http" || scheme === "https") {
    if (!/^https?:\/\//i.test(value)) return false;
    try {
      const url = new URL(value);
      return url.protocol === `${scheme}:` && Boolean(url.hostname);
    } catch {
      return false;
    }
  }

  const payload = value.slice(scheme.length + 1);
  return Boolean(payload) && !/\s/.test(payload);
}

export function assertSafePortableTextHref(value: unknown): string {
  if (!isSafePortableTextHref(value)) {
    throw new Error("Sanity Portable Text link has an unsafe or unsupported href");
  }
  return value;
}

function optionalString(
  source: Record<string, unknown>,
  field: string,
  id: string,
  context: string,
): string | undefined {
  const value = source[field];
  if (value === undefined) return undefined;
  if (typeof value !== "string") portableTextError(id, context, `${field} must be a string`);
  return value;
}

function unitNumber(
  source: Record<string, unknown>,
  field: string,
  id: string,
  context: string,
): number {
  const value = source[field];
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1) {
    portableTextError(id, context, `${field} must be a number between 0 and 1`);
  }
  return value;
}

function imageCrop(value: unknown, id: string, field: string): SanityImageCrop | undefined {
  if (value === undefined) return undefined;
  if (!isRecord(value) || value._type !== "sanity.imageCrop") {
    portableTextError(id, field, "image crop has an invalid shape");
  }
  return {
    _type: "sanity.imageCrop",
    top: unitNumber(value, "top", id, field),
    bottom: unitNumber(value, "bottom", id, field),
    left: unitNumber(value, "left", id, field),
    right: unitNumber(value, "right", id, field),
  };
}

function imageHotspot(value: unknown, id: string, field: string): SanityImageHotspot | undefined {
  if (value === undefined) return undefined;
  if (!isRecord(value) || value._type !== "sanity.imageHotspot") {
    portableTextError(id, field, "image hotspot has an invalid shape");
  }
  return {
    _type: "sanity.imageHotspot",
    x: unitNumber(value, "x", id, field),
    y: unitNumber(value, "y", id, field),
    height: unitNumber(value, "height", id, field),
    width: unitNumber(value, "width", id, field),
  };
}

function imageNode(entry: Record<string, unknown>, field: string, id: string): PortableTextImage {
  if (!isRecord(entry.asset) || entry.asset._type !== "reference" || !isNonEmptyString(entry.asset._ref)) {
    portableTextError(id, field, "image asset must be a valid reference with a non-empty _ref");
  }
  if (!isNonEmptyString(entry.alt)) portableTextError(id, field, "image alt must be non-empty");

  const caption = optionalString(entry, "caption", id, field);
  const crop = imageCrop(entry.crop, id, field);
  const hotspot = imageHotspot(entry.hotspot, id, field);

  return {
    _key: entry._key as string,
    _type: "image",
    asset: { _type: "reference", _ref: entry.asset._ref },
    alt: entry.alt,
    ...(caption !== undefined ? { caption } : {}),
    ...(crop ? { crop } : {}),
    ...(hotspot ? { hotspot } : {}),
  };
}

function codeBlockNode(entry: Record<string, unknown>, field: string, id: string): PortableTextCodeBlock {
  if (!isNonEmptyString(entry.code)) portableTextError(id, field, "codeBlock code must be non-empty");
  const language = optionalString(entry, "language", id, field);
  const filename = optionalString(entry, "filename", id, field);

  return {
    _key: entry._key as string,
    _type: "codeBlock",
    code: entry.code,
    ...(language !== undefined ? { language } : {}),
    ...(filename !== undefined ? { filename } : {}),
  };
}

function linkMarkDef(value: unknown, field: string, id: string): PortableTextLinkMarkDef {
  if (!isRecord(value) || value._type !== "link" || !isNonEmptyString(value._key)) {
    portableTextError(id, field, "markDefs support only keyed link annotations");
  }
  if (!isSafePortableTextHref(value.href)) {
    portableTextError(id, field, "link markDef href must use http, https, mailto, or tel");
  }
  if (value.openInNewTab !== undefined && typeof value.openInNewTab !== "boolean") {
    portableTextError(id, field, "link markDef openInNewTab must be boolean");
  }

  return {
    _key: value._key,
    _type: "link",
    href: value.href,
    ...(value.openInNewTab !== undefined ? { openInNewTab: value.openInNewTab } : {}),
  };
}

function blockNode(entry: Record<string, unknown>, field: string, id: string): PortableTextBlock {
  if (!Array.isArray(entry.markDefs)) portableTextError(id, field, "block markDefs must be an array");
  const markDefs = entry.markDefs.map((markDef) => linkMarkDef(markDef, field, id));
  const markDefKeys = new Set<string>();
  for (const markDef of markDefs) {
    if (markDefKeys.has(markDef._key)) portableTextError(id, field, `duplicate markDef key ${markDef._key}`);
    markDefKeys.add(markDef._key);
  }

  if (!Array.isArray(entry.children)) portableTextError(id, field, "block children must be an array");
  const children = entry.children.map((child) => {
    if (
      !isRecord(child)
      || !isNonEmptyString(child._key)
      || child._type !== "span"
      || !Array.isArray(child.marks)
      || !child.marks.every((mark) => typeof mark === "string")
      || typeof child.text !== "string"
    ) {
      portableTextError(id, field, "block child spans or marks are invalid");
    }

    for (const mark of child.marks) {
      if (!allowedDecorators.has(mark) && !markDefKeys.has(mark)) {
        portableTextError(id, field, `span mark ${mark || "<empty>"} does not resolve to a valid markDef`);
      }
    }

    return {
      _key: child._key,
      _type: "span" as const,
      marks: [...child.marks],
      text: child.text,
    };
  });

  if (entry.style !== undefined && (typeof entry.style !== "string" || !allowedBlockStyles.has(entry.style))) {
    portableTextError(id, field, "block style is unsupported");
  }
  if (entry.listItem !== undefined && (typeof entry.listItem !== "string" || !allowedListItems.has(entry.listItem))) {
    portableTextError(id, field, "block listItem is unsupported");
  }
  if (entry.level !== undefined && (!Number.isInteger(entry.level) || (entry.level as number) < 1)) {
    portableTextError(id, field, "block level must be a positive integer");
  }

  return {
    _key: entry._key as string,
    _type: "block",
    ...(entry.style !== undefined ? { style: entry.style as PortableTextBlock["style"] } : {}),
    ...(entry.listItem !== undefined ? { listItem: entry.listItem as PortableTextBlock["listItem"] } : {}),
    ...(entry.level !== undefined ? { level: entry.level as number } : {}),
    markDefs,
    children,
  };
}

function blocks(value: unknown, field: string, id: string): PortableTextNode[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Sanity Note ${id} has invalid ${field}`);
  }

  return value.map((entry) => {
    if (!isRecord(entry) || !isNonEmptyString(entry._key) || !isNonEmptyString(entry._type)) {
      portableTextError(id, field, "every top-level object requires non-empty _key and _type");
    }

    if (entry._type === "block") return blockNode(entry, field, id);
    if (entry._type === "image") return imageNode(entry, `${field} image`, id);
    if (entry._type === "codeBlock") return codeBlockNode(entry, `${field} codeBlock`, id);
    return portableTextError(id, field, `unsupported top-level Portable Text type ${entry._type}`);
  });
}

function seo(value: unknown, id: string): SanityNoteSeo | undefined {
  if (value == null) return undefined;
  if (!isRecord(value)) throw new Error(`Sanity Note ${id} has invalid seo`);

  const result: SanityNoteSeo = {};
  for (const field of ["title", "description"] as const) {
    const fieldValue = value[field];
    if (fieldValue != null && typeof fieldValue !== "string") {
      throw new Error(`Sanity Note ${id} has invalid seo.${field}`);
    }
    if (fieldValue != null) result[field] = fieldValue;
  }

  if (value.keywords != null) {
    if (!Array.isArray(value.keywords) || !value.keywords.every((keyword) => typeof keyword === "string")) {
      throw new Error(`Sanity Note ${id} has invalid seo.keywords`);
    }
    result.keywords = [...value.keywords];
  }

  if (value.noIndex != null) {
    if (typeof value.noIndex !== "boolean") throw new Error(`Sanity Note ${id} has invalid seo.noIndex`);
    result.noIndex = value.noIndex;
  }

  return result;
}

export function validateNotes(value: unknown): SanityNote[] {
  if (!Array.isArray(value)) throw new Error("Sanity Notes response must be an array");
  const routes = new Set<string>();
  const ids = new Set<string>();

  return value.map((raw) => {
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

    buildNoteDiscoveryEntries([{ translationKey, language, slug, title }]);
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
      seo: seo(raw.seo, _id),
      publishedAt,
      updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : undefined,
      featured: raw.featured === true,
    } satisfies SanityNote;
  });
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

export function assertRequiredMigratedNoteTranslations(notes: SanityNote[]): void {
  const pairs = pairNotes(notes);
  const missing = REQUIRED_MIGRATED_NOTE_TRANSLATION_KEYS.flatMap((translationKey) => {
    const pair = pairs.get(translationKey);
    return (["en", "zh"] as const)
      .filter((language) => !pair?.[language])
      .map((language) => `${translationKey} (${language})`);
  });

  if (missing.length > 0) {
    throw new Error(
      `Sanity required migrated Note translations are missing: ${missing.join(", ")}. Publish each missing en/zh document before building.`,
    );
  }
}

export function portableTextToPlainText(nodes: PortableTextNode[]): string {
  return nodes
    .filter((node): node is PortableTextBlock => node._type === "block")
    .map((block) => block.children.map((child) => child.text).join(""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

let notesPromise: Promise<SanityNote[]> | undefined;

export function getAllPublishedNotes(): Promise<SanityNote[]> {
  notesPromise ||= getSanityClient().fetch<unknown>(PUBLISHED_NOTES_QUERY).then((value) => {
    const notes = validateNotes(value);
    if (notes.length === 0) throw new Error("Sanity returned zero published Notes; refusing a partial build");
    assertRequiredMigratedNoteTranslations(notes);
    return notes;
  });
  return notesPromise;
}
