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

The public Content Lake dataset and the Astro build are tokenless; a read token is not required. Publish and update Note content through Sanity Studio. Public root document IDs must use `note-<slug>-<language>` because dotted Sanity IDs are private path documents and are not returned by the public Content Lake API.

Run the complete local check before handing off a change:

```bash
npm run verify
```

`notes:validate` is an audit-only migration check, not a publishing command. It requires an explicit manifest path:

```bash
npm run notes:validate -- <manifest>
```

There is no local Notes fallback. If Sanity is unavailable, a new build is blocked instead of silently publishing stale local content. Already-deployed static HTML remains available during a Sanity outage because the deployed pages do not require a runtime Content Lake request.

Production deployment is outside this workflow and requires a separate explicit deployment task.

## Project structure

```text
src/pages/index.astro
src/styles/global.css
public/favicon.svg
```
