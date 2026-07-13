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
