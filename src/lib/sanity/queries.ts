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

export const PUBLISHED_SITE_CONTENT_QUERY = `
  *[
    _type in [
      "siteSettings", "siteCopy", "homePage", "aboutPage", "companyPage", "contactPage",
      "servicesPage", "projectsPage", "notesPage", "project", "service"
    ] &&
    !(_id in path("drafts.**"))
  ] | order(_type asc, order asc, language asc) {
    ...,
    "slug": slug.current
  }
`
