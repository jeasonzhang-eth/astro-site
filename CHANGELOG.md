# Changelog

## 2026-07-13

- Sourced Sitemap and llms.txt Note discovery from the shared memoized Sanity snapshot, grouped actual translation routes, deduplicated URLs, and removed Note paths from the static SEO helper.
- Escaped script-breaking characters in all JSON-LD output and added hostile-payload round-trip plus parsed Note Article/FAQ regression coverage.
- Switched homepage Note cards, bilingual Note directories, and all Note detail routes to the validated Sanity dataset and Portable Text renderer.
- Added strict Sanity Portable Text rendering with required-alt responsive images, escaped code blocks, explicit bilingual alternates, no-index propagation, and theme-aware article styles.
- Added deterministic Portable Text migration tooling and imported the four bilingual local Note pairs as eight public root-ID Sanity documents validated through anonymous direct and CDN reads.
- Added the published Notes GROQ query, strict API and Portable Text validation, route collision detection, bilingual pairing, span-aware plain-text extraction, and one-snapshot build fetch.
- Locked the Sanity Notes client to the approved production project, dataset, and API version with singleton client regression coverage.
- Added strict build-time Sanity configuration and the API/rendering dependencies for the Notes single-source migration.
- Added the task-by-task implementation plan for migrating eight bilingual Notes to Sanity, cutting Astro over to API-only content, and removing all local fallback data.
- Added the approved design for migrating all bilingual Notes to Sanity as the only source of truth, with Portable Text rendering, API-driven static generation, strict failure semantics, and no local fallback.

## 2026-07-12

- Rebuilt the shared header as a floating translucent product-navigation capsule with semantic active-route states, unified controls, and a two-row mobile scroll rail.
- Replaced the isolated phone poster with an integrated responsive call panel and compact company-fact strip; verified Chinese/English, light/dark, desktop/mobile layouts with 12 rendered screenshots.
- Added the task-by-task implementation and verification plan for the modern navigation capsule and integrated contact surface.
- Added the approved design specification for a floating product-style navigation capsule and integrated contact action panel across themes and responsive layouts.
## 2026-07-11

- Replaced the visible root redirect page with a head-first `location.replace()` redirect and a no-JavaScript fallback, eliminating the “continue visiting” flash without requiring Nginx configuration.
- Completed two-pass black-box visual QA across all 34 bilingual routes and 68 desktop/mobile screenshots, then added structural regression contracts for the repaired layouts.
- Reworked editorial display headlines into accessible authored lines, corrected the measured triptych crops, and balanced the homepage artwork and typography across desktop and mobile.
- Expanded navigation, language/theme controls, and FAQ summaries to 44px hit targets; prevented broken English words, phone-number wrapping, and excess detail-page footer spacing.
- Added the approved illustration design and implementation plan for a shared editorial triptych across the homepage, Services page, and Company page.
- Added an optimized shared editorial triptych and a reusable Astro artwork component across the homepage, Services page, and Company page with bilingual alt text and captions.
- Deployed illustration release `20260710T170213Z-ffce81e` to `beishuyinqing.cn`; verified the 259KB WebP asset, three production crops, accessibility text, and rollback to the previous release.
- Added the approved design specification for integrating Jeason’s personal site with the Multiple Engine company website, including content migration, bilingual routes, SEO/GEO, deployment, and rollback requirements.
- Added the task-by-task implementation and verification plan for the integrated site migration and production replacement.
- Ignored project-local Git worktrees so the implementation can run in an isolated checkout.
- Added production-build contract tests for bilingual company routes, verified legal facts, SEO/GEO discovery files, structured data, and the legacy verification token.
- Added verified company and service content sources, production-domain metadata, the legacy verification token, and the unified personal/company positioning.
- Expanded the shared bilingual navigation and added a company-aware footer with verified phone, address, and ICP information.
- Added bilingual Services, Company, and Contact pages with factual service boundaries, Organization and Service structured data, and direct cooperation paths.
- Rebuilt the homepage around personal accountability, real project evidence, five company services, a four-step working method, and formal Multiple Engine delivery; expanded the author page with verified engineering experience.
- Updated llms.txt and production discovery metadata to expose all bilingual service, company, contact, project, note, and verified company-fact paths.
- Set the production root and x-default locale to Chinese while preserving direct bilingual route switching.
- Deployed release `20260710T164025Z-a28ad24` to Tencent Guangzhou and switched `beishuyinqing.cn` from the legacy single-page root to the versioned Astro release while preserving the old site and Nginx rollback backup.
- Confirmed the apex domain, HTTPS routes, Sitemap, llms.txt, robots.txt, and verification token; `www.beishuyinqing.cn` remains pending because no DNS record currently exists.

## 2026-07-02

- Added localized About/author pages with Person JSON-LD, navigation links, sitemap coverage, and llms.txt entry.
- Replaced the placeholder project list with Jeason-owned projects, including Twitter Translator, Apple Price, USD Liquidity, and WeCom KF AI Agent; replaced the text brand badge with a cleaner abstract mark.
- Added localized project and note directory pages, wired top navigation and detail-page breadcrumbs to those directories, and normalized Capty copy to "Mac OS".
- Expanded all project and note pages with definitions, audiences, workflows, checklists, examples, outcomes, and FAQ content for stronger SEO/GEO coverage.

## 2026-07-01

- Added the basic SEO/GEO structure: localized `/en/` and `/zh/` routes, project pages, note pages, shared SEO metadata, JSON-LD, `robots.txt`, `sitemap.xml`, and `llms.txt`.
- Fixed primary button contrast in dark mode.
- Added client-side English/Chinese language switching with persisted preference.
- Added light/dark theme switching with persisted preference and system-theme default.

## 2026-06-30

- Initialized the Astro website with a personal homepage, responsive styling, and project metadata.
