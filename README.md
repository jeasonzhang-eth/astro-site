# astro-site

A personal Astro website for publishing projects, notes, and field work.

## Commands

```bash
npm install
npm run dev
npm run build
npm run verify
```

## Sanity Notes workflow

Notes use Sanity Content Lake as their only source of truth:

- Project: `7lstorz2`
- Dataset: `production`
- API version: `2026-07-13`

Create a local `.env` with the exact public read configuration from `.env.example`:

```dotenv
SANITY_PROJECT_ID=7lstorz2
SANITY_DATASET=production
SANITY_API_VERSION=2026-07-13
```

The public Content Lake dataset and the Astro build are tokenless; a read token is not required. Publish and update Note content through Sanity Studio. Publicly readable Notes must have a root document ID with no dot/path segment. The eight migrated documents use deterministic `note-<slug>-<language>` IDs, but this naming pattern is only needed when an API/import workflow wants deterministic IDs; new Notes created normally through Studio may use Sanity-generated UUIDs. Dotted IDs are private path documents and are not returned by the public Content Lake API.

Builds require both `en` and `zh` translations for the four migrated keys (`ai-agent-workflow`, `desktop-automation`, `creator-tools`, and `market-research`). New translation keys may be published in only one language; they build normally without a missing-language alternate. Notes with `seo.noIndex: true` remain directly buildable and reachable through intentional navigation, but are omitted from Sitemap, `llms.txt`, and hreflang advertising. Portable Text accepts only the Studio schema's `block`, `image`, and `codeBlock` objects, and link annotations are restricted to `http`, `https`, `mailto`, and `tel` URLs.

Run the complete local check before handing off a change:

```bash
npm run verify
```

`notes:validate` is an audit-only structural/count migration check, not the publishing workflow. It requires an explicit manifest path:

```bash
npm run notes:validate -- <manifest>
```

After validating the manifest and remote records structurally, the audit compares each Note's `_id`, language, slug, `translationKey`, FAQ item count, and top-level content block count. It also compares total, English, Chinese, translation-pair, and complete-pair counts. It does **not** prove full field, body, or SEO equality between the manifest and Sanity.

There is no local Notes fallback. If Sanity is unavailable, a new build is blocked instead of silently publishing stale local content. Already-deployed static HTML remains available during a Sanity outage because the deployed pages do not require a runtime Content Lake request.

Production deployment is outside this workflow and requires a separate explicit deployment task.

## Project structure

```text
src/pages/index.astro
src/styles/global.css
public/favicon.svg
```
