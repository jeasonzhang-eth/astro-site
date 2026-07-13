# Full-Site Sanity Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Sanity the only editable content source for the complete bilingual Astro site while preserving all routes, visuals, SEO, Notes behavior, and strict build guarantees.

**Architecture:** Add fixed-ID global/shared/page documents plus localized Project and Service collections to the CMS. Import deterministic documents from an immutable migration manifest, then fetch and strictly validate a memoized site snapshot in Astro; remove all runtime local content modules after remote verification.

**Tech Stack:** Sanity Studio 6, `@sanity/client` 7, Astro 7, TypeScript, GROQ, Node test runner, `tsx`.

## Global Constraints

- Sanity project ID is `7lstorz2`, dataset is `production`, API version is `2026-07-13`.
- Sanity is the only runtime content source; no local content fallback is allowed.
- Existing Notes and their root IDs must remain unchanged.
- Import writes must be deterministic and idempotent.
- Missing, malformed, partial, or duplicate required content must fail the Astro build.
- Preserve bilingual routes, independent localized slugs, canonical URLs, alternates, JSON-LD, sitemap.xml, robots.txt, and llms.txt.
- Update each modified submodule's `CHANGELOG.md`.
- Do not deploy the production website.
- Keep individual commands below the workspace 120-second timeout boundary.

---

### Task 1: CMS typed content model

**Files:**
- Create: `astro-site-cms/schemaTypes/objects/language.ts`
- Create: `astro-site-cms/schemaTypes/siteCopy.ts`
- Create: `astro-site-cms/schemaTypes/pages/*.ts`
- Modify: `astro-site-cms/schemaTypes/siteSettings.ts`
- Modify: `astro-site-cms/schemaTypes/project.ts`
- Modify: `astro-site-cms/schemaTypes/service.ts`
- Modify: `astro-site-cms/schemaTypes/index.ts`
- Modify: `astro-site-cms/structure/index.ts`
- Test: `astro-site-cms/tests/schema-contract.test.ts`

**Interfaces:**
- Produces fixed schema type names and deterministic document IDs consumed by the migration manifest and Astro GROQ query.

- [ ] Write schema contract tests for required type names, fixed structure IDs, and Project/Service field contracts.
- [ ] Run tests and confirm they fail before the new types exist.
- [ ] Add reusable language fields/helpers and typed page schemas.
- [ ] Expand settings and collection schemas to the approved content boundary.
- [ ] Add fixed-ID Studio navigation for pages/shared copy/settings.
- [ ] Run tests, typecheck, and Studio build.

### Task 2: Deterministic full-site manifest and importer

**Files:**
- Create: `astro-site-cms/migrations/2026-07-14-full-site-content.ts`
- Create: `astro-site-cms/scripts/migrate-full-site.ts`
- Create: `astro-site-cms/tests/full-site-manifest.test.ts`
- Modify: `astro-site-cms/package.json`
- Modify: `astro-site-cms/package-lock.json`

**Interfaces:**
- Produces `FULL_SITE_DOCUMENTS`, deterministic IDs, `validateFullSiteManifest()`, dry-run/import/verify CLI modes.

- [ ] Write failing tests for required IDs, 14 localized page docs, 2 shared-copy docs, 12 Projects, 10 Services, language pairs, slugs, and deterministic content.
- [ ] Run tests and confirm missing-manifest failures.
- [ ] Build the immutable manifest from the current local content.
- [ ] Implement validation, dry-run, `createOrReplace`, and remote verification.
- [ ] Run tests and dry-run.
- [ ] Run the idempotent production import with the authenticated Sanity CLI.
- [ ] Run remote verification and query counts/IDs independently.

### Task 3: Astro site snapshot validator

**Files:**
- Create: `astro-site/src/lib/site/language.ts`
- Create: `astro-site/src/lib/site/routes.ts`
- Create: `astro-site/src/lib/sanity/site-content.ts`
- Modify: `astro-site/src/lib/sanity/queries.ts`
- Modify: `astro-site/src/lib/sanity/types.ts`
- Modify: `astro-site/src/lib/sanity/config.ts`
- Test: `astro-site/tests/sanity-site-content.test.ts`

**Interfaces:**
- Produces `getSiteContent(): Promise<SanitySiteContent>` and pure `validateSiteContent(value)`.
- Produces route helpers independent of editorial content.

- [ ] Write failing validator tests for complete data, missing fixed IDs, bad language pairs, duplicate routes, malformed URLs, empty arrays, and wrong baseline counts.
- [ ] Run tests and confirm failures.
- [ ] Add types, GROQ projection, validators, pair/index helpers, and memoized fetch.
- [ ] Extract route/language helpers from local data files.
- [ ] Run unit tests.

### Task 4: Convert all Astro pages and layouts

**Files:**
- Modify: `astro-site/src/pages/[lang]/*.astro`
- Modify: `astro-site/src/pages/[lang]/projects/*.astro`
- Modify: `astro-site/src/pages/[lang]/notes/*.astro`
- Modify: `astro-site/src/layouts/BaseLayout.astro`
- Modify: `astro-site/src/components/Seo.astro`
- Modify: `astro-site/src/lib/seo/alternates.ts`
- Modify: `astro-site/src/pages/index.astro`

**Interfaces:**
- Consumes `getSiteContent()` and route helpers; pages no longer import `src/data/*`.

- [ ] Add tests that reject remaining local data imports and verify required pages consume Sanity.
- [ ] Run tests and confirm they fail.
- [ ] Convert layout, SEO, home, About, Company, Contact, Services, Projects, and Notes list/detail dependencies.
- [ ] Preserve visual-only hardcoded headline line breaks while sourcing accessible/editorial copy from Sanity.
- [ ] Run Astro check and targeted tests.

### Task 5: Discovery outputs and removal of local content

**Files:**
- Modify: `astro-site/src/pages/llms.txt.ts`
- Modify: `astro-site/src/pages/robots.txt.ts`
- Modify: `astro-site/src/pages/sitemap.xml.ts`
- Delete: `astro-site/src/data/site.ts`
- Delete: `astro-site/src/data/company.ts`
- Delete: `astro-site/src/data/services.ts`
- Modify: `astro-site/tests/integrated-site.test.mjs`
- Modify: `astro-site/tests/sanity-migration.test.ts`

**Interfaces:**
- Discovery outputs consume only Sanity snapshot plus route serialization helpers.

- [ ] Add failing tests for Sanity-only discovery and absence of local content files.
- [ ] Convert llms.txt, robots.txt, and sitemap.xml.
- [ ] Delete local content modules.
- [ ] Run unit tests and Astro check.

### Task 6: Full verification, documentation, and repository updates

**Files:**
- Modify: `astro-site/README.md`
- Modify: `astro-site/CHANGELOG.md`
- Modify: `astro-site-cms/README.md`
- Modify: `astro-site-cms/CHANGELOG.md`
- Modify: parent submodule pointer and generated governance exports only.

**Interfaces:**
- Produces committed and pushed child repositories plus a local parent pointer update.

- [ ] Verify the remote dataset contains every required published document and all existing Notes.
- [ ] Run CMS test/typecheck/build verification.
- [ ] Run Astro unit tests with fixed Sanity environment variables.
- [ ] Run Astro full static build and integrated/visual tests against production Sanity.
- [ ] Grep for forbidden local imports/fallbacks and verify route/page counts.
- [ ] Review diffs and update both CHANGELOG files and README workflows.
- [ ] Commit and push CMS.
- [ ] Commit and push Astro.
- [ ] Refresh parent submodule governance export, stage only exact migration-related files, and make a local parent commit.
