export type SanityLanguage = "en" | "zh";

export type PortableTextLinkMarkDef = {
  _key: string;
  _type: "link";
  href: string;
  openInNewTab?: boolean;
};

export type PortableTextSpan = {
  _key: string;
  _type: "span";
  marks: string[];
  text: string;
};

export type PortableTextBlock = {
  _key: string;
  _type: "block";
  style?: "normal" | "h2" | "h3" | "blockquote";
  listItem?: "bullet" | "number";
  level?: number;
  markDefs: PortableTextLinkMarkDef[];
  children: PortableTextSpan[];
};

export type SanityImageAssetReference = {
  _type: "reference";
  _ref: string;
};

export type SanityImageCrop = {
  _type: "sanity.imageCrop";
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type SanityImageHotspot = {
  _type: "sanity.imageHotspot";
  x: number;
  y: number;
  height: number;
  width: number;
};

export type PortableTextImage = {
  _key: string;
  _type: "image";
  asset: SanityImageAssetReference;
  alt: string;
  caption?: string;
  crop?: SanityImageCrop;
  hotspot?: SanityImageHotspot;
};

export type PortableTextCodeBlock = {
  _key: string;
  _type: "codeBlock";
  code: string;
  language?: string;
  filename?: string;
};

export type PortableTextNode = PortableTextBlock | PortableTextImage | PortableTextCodeBlock;

export type SanityNoteSeo = {
  title?: string;
  description?: string;
  keywords?: string[];
  noIndex?: boolean;
};

export type SanityNote = {
  _id: string;
  title: string;
  slug: string;
  language: SanityLanguage;
  translationKey: string;
  summary: string;
  tags: string[];
  content: PortableTextNode[];
  faq: Array<{ question: string; answer: PortableTextNode[] }>;
  seo?: SanityNoteSeo;
  publishedAt: string;
  updatedAt?: string;
  featured: boolean;
};

export type SanityNotePair = Partial<Record<SanityLanguage, SanityNote>>;
