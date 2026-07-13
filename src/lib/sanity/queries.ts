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
