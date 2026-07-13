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
