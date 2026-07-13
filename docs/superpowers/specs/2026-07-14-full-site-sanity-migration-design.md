# Full-Site Sanity Migration Design

## Objective

Move every editable piece of the bilingual Astro site into Sanity so Sanity is the only runtime content source. Astro retains rendering, layout, styling, routing rules, language support, runtime validation, and discovery serialization. There is no local content fallback.

## Selected Architecture

Use several strongly typed Sanity document types rather than one large settings document or a generic page blob:

- `siteSettings`: one fixed-ID singleton for site identity, canonical URL, author, default language, company facts, contact data, ICP data, and structured-data facts.
- `siteCopy`: two fixed-ID documents (`siteCopy-en`, `siteCopy-zh`) for navigation, footer, calls to action, section labels, and detail-page labels shared across routes.
- Typed localized page documents, two fixed IDs per type:
  - `homePage-en` / `homePage-zh`
  - `aboutPage-en` / `aboutPage-zh`
  - `companyPage-en` / `companyPage-zh`
  - `contactPage-en` / `contactPage-zh`
  - `servicesPage-en` / `servicesPage-zh`
  - `projectsPage-en` / `projectsPage-zh`
  - `notesPage-en` / `notesPage-zh`
- Collection documents:
  - `project-<translationKey>-<language>`
  - `service-<translationKey>-<language>`
  - existing root-ID Notes remain unchanged.

Every localized document stores its language explicitly. Pairing uses `translationKey`, while slugs remain independently editable per language for collections.

## Why This Model

This model gives editors clear folders and fields, avoids an unmaintainable giant singleton, and preserves compile-time/runtime expectations in Astro. It is deliberately more explicit than a generic Portable Text page because the current visual system depends on structured fields such as method steps, service evidence, project outcomes, company principles, and CTA copy.

Rejected alternatives:

1. **One giant site singleton:** fewer queries, but poor editing ergonomics, larger conflict surface, and weak ownership boundaries.
2. **Generic page plus Portable Text:** flexible, but loses the structured fields required by the current templates and makes validation/rendering less predictable.
3. **Incremental Projects/Services-only migration:** lower initial change, but violates the requirement that Sanity be the whole-site single source.

## Content Boundary

Sanity owns:

- Site name, canonical URL, author, default language.
- Company legal names, short names, phone, bilingual addresses, city/country, postal code, ICP and verification data.
- Navigation/footer labels and all reusable bilingual UI copy.
- Home, About, Company, Contact, Services index, Projects index, and Notes index page copy.
- All Project, Service, and Note documents.
- SEO title/description fields and no-index controls where applicable.
- Data used to generate JSON-LD, sitemap, robots.txt, and llms.txt.

Astro owns:

- Supported language codes (`en`, `zh`) and route names.
- HTML structure, components, CSS, artwork, accessibility behavior, language/theme controls.
- GROQ queries, strict validators, rendering adapters, URL serialization, and build-failure policy.
- Display components and artwork composition rules; authored headline lines, accessible labels, image alternative text, and captions come from Sanity.

Migration manifests stored in the CMS repository are immutable audit artifacts, not runtime fallbacks.

## Query and Runtime Flow

Astro performs two memoized published-perspective reads during a build:

1. A complete site-content snapshot for settings, shared copy, typed pages, Projects, and Services.
2. The existing Notes query, preserving its stricter Portable Text validation.

The site snapshot validator rejects:

- Missing required singleton or localized document IDs.
- Missing English/Chinese translation pairs.
- Unsupported languages.
- Duplicate IDs, translation keys, routes, slugs, or display order where uniqueness is required.
- Empty required strings/arrays, invalid URLs, invalid phone links, malformed SEO, or disabled required migrated Services.
- Wrong Project/Service counts for the initial migration baseline.

A rejected or partial snapshot fails the build. No local fallback or stale embedded copy is used.

## Studio Structure

The Studio navigation becomes:

- Notes → 中文 / English
- Projects → 中文 / English
- Services → 中文 / English
- Pages
  - Home → 中文 / English
  - About → 中文 / English
  - Company → 中文 / English
  - Contact → 中文 / English
  - Services index → 中文 / English
  - Projects index → 中文 / English
  - Notes index → 中文 / English
- Shared Copy → 中文 / English
- Site Settings

Singleton and localized page IDs are fixed in Structure Builder so editors cannot accidentally create duplicate page documents.

## Migration Strategy

1. Add schemas and Studio structure first.
2. Generate deterministic `createOrReplace` documents from the current local TypeScript content.
3. Dry-run and validate the manifest locally.
4. Import through `sanity exec --with-user-token` in one transaction or bounded transaction batches.
5. Read the production dataset back and compare required IDs, counts, language pairs, slugs, and content fingerprints.
6. Only after the remote verification succeeds, switch Astro pages to Sanity and delete the local content files.
7. Build the entire static site from the production dataset and run route/content regression checks.

Existing Notes are never replaced by the full-site migration.

## Failure and Recovery

- Import is idempotent because all migrated documents use deterministic IDs and `createOrReplace`.
- A failed transaction can be rerun without creating duplicates.
- Before mutation, the script prints the target project/dataset and a document summary.
- A `--dry-run` mode never mutates Sanity.
- A `--verify` mode reads the remote dataset and compares it to the manifest.
- Astro refuses partial content, so a missing/unpublished page cannot silently produce an incomplete production build.
- No production site deployment is part of this work.

## Verification

CMS:

- Migration manifest unit tests.
- TypeScript typecheck.
- Sanity Studio production build.
- Dry-run manifest count and ID report.
- Remote import verification.

Astro:

- Validator unit tests, including malformed/missing/duplicate content cases.
- Tests proving local content files and imports no longer exist.
- Existing Note/Portable Text/security tests.
- Astro typecheck.
- Full static build against the production dataset.
- Integrated route checks, sitemap/llms/robots checks, and visual regression assertions.
