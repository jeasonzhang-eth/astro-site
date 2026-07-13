import type { Language } from "../site/language";

export type LanguageAlternateInput = {
  language: Language;
  pathname: string;
  alternatePath?: string;
  noIndex?: boolean;
};

export function buildLanguageAlternates({
  language,
  pathname,
  alternatePath,
  noIndex,
}: LanguageAlternateInput): Partial<Record<Language, string>> {
  if (noIndex === true) return {};

  const alternates: Partial<Record<Language, string>> = { [language]: pathname };
  if (alternatePath) alternates[language === "en" ? "zh" : "en"] = alternatePath;
  return alternates;
}
