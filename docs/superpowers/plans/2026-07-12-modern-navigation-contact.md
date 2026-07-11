# Modern Navigation and Contact Surface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the boxed utility-style header and isolated phone poster with a floating product-style navigation capsule and an integrated responsive contact action panel.

**Architecture:** Keep the existing `BaseLayout.astro` and contact page data model, adding a small navigation-item model and route-active helper in the layout. Recompose the contact page markup around one `tel:` action panel plus a separate fact strip, then implement all visual behavior in the existing global stylesheet without adding dependencies.

**Tech Stack:** Astro 5/7 static output, TypeScript frontmatter, semantic HTML, CSS custom properties, Node test runner, Playwright fallback for rendered QA.

## Global Constraints

- Preserve the six navigation labels, order, routes, language switching, and theme switching.
- Preserve verified company name, phone, address, and ICP information.
- Do not add new contact channels, QR codes, icons, or dependencies.
- Desktop navigation must remain one row at 1440×1100.
- Mobile uses a brand/control row plus a horizontally scrollable navigation rail, not a hamburger or six-cell grid.
- Every interactive target must be at least 44px high.
- Phone number must appear once in the primary contact panel and remain on one line at 390px.
- Respect `prefers-reduced-motion`.
- Update `CHANGELOG.md` with implementation and deployment evidence.

---

### Task 1: Add navigation and contact structure contracts

**Files:**
- Modify: `tests/visual-regressions.test.mjs`
- Modify: `tests/integrated-site.test.mjs`

**Interfaces:**
- Consumes: built HTML under `dist/zh/` and `dist/en/`, plus `src/styles/global.css`.
- Produces: regression contracts for active navigation, mobile rail, shared hit targets, and nonduplicated contact actions.

- [ ] **Step 1: Add a failing active-navigation contract**

Add a test that reads `dist/zh/contact/index.html` and asserts the Contact navigation link contains `aria-current="page"`, while a noncontact navigation link does not.

```js
test("primary navigation exposes the active route semantically", async () => {
  const html = await read("dist/zh/contact/index.html");
  assert.match(html, /<a[^>]*class="[^"]*nav-contact[^"]*is-current[^"]*"[^>]*aria-current="page"[^>]*>联系<\/a>/);
  assert.doesNotMatch(html, /href="\/zh\/projects\/"[^>]*aria-current="page"/);
});
```

- [ ] **Step 2: Add failing mobile rail and contact contracts**

Add tests requiring `.site-nav` mobile overflow scrolling, `.contact-call` horizontal action anatomy, one phone-number occurrence inside the panel, and `.contact-cta`.

```js
test("mobile navigation uses a horizontal product rail", async () => {
  const css = await read("src/styles/global.css");
  assert.match(css, /\.site-nav\s*\{[^}]*overflow-x\s*:\s*auto/is);
  assert.match(css, /scrollbar-width\s*:\s*none/i);
});

test("contact page renders one integrated call action", async () => {
  const html = await read("dist/zh/contact/index.html");
  const panel = html.match(/<a[^>]*class="contact-call"[\s\S]*?<\/a>/)?.[0] ?? "";
  assert.match(panel, /class="contact-cta"/);
  assert.equal((panel.match(/185 9314 1894/g) ?? []).length, 1);
  assert.match(html, /class="contact-facts"/);
});
```

- [ ] **Step 3: Run the focused tests and verify RED**

Run:

```bash
npm run build
node --test --test-name-pattern='active route|horizontal product rail|integrated call action' tests/*.test.mjs
```

Expected: the three new contracts fail because `aria-current`, scroll rail styling, and CTA markup do not exist.

- [ ] **Step 4: Commit the failing contracts**

```bash
git add tests/integrated-site.test.mjs tests/visual-regressions.test.mjs
git commit -m "test: define modern navigation and contact contracts"
```

---

### Task 2: Implement semantic product-style navigation markup

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Consumes: `pathname`, `language`, `labels`, and `localizePath()` already available in layout frontmatter.
- Produces: `navItems: Array<{ href: string; label: string; className?: string }>` and `isNavCurrent(href: string): boolean` used by rendered navigation links.

- [ ] **Step 1: Define navigation items and route matching**

Add after the existing address/company constants:

```ts
const navItems = [
  { href: localizePath(language, "projects"), label: copy.projectLabel },
  { href: localizePath(language, "notes"), label: copy.noteLabel },
  { href: localizePath(language, "services"), label: copy.servicesLabel },
  { href: localizePath(language, "company"), label: copy.companyLabel },
  { href: localizePath(language, "about"), label: copy.aboutLabel },
  { href: localizePath(language, "contact"), label: copy.contactLabel, className: "nav-contact" },
];

const isNavCurrent = (href: string) => pathname === href || pathname.startsWith(href);
```

Because each section URL ends with `/`, `startsWith` marks project/note detail pages without matching unrelated routes.

- [ ] **Step 2: Render mapped links with current-page semantics**

Replace six duplicated navigation anchors with:

```astro
<nav class="site-nav" aria-label="Primary">
  {navItems.map((item) => {
    const isCurrent = isNavCurrent(item.href);
    return (
      <a
        class:list={[item.className, { "is-current": isCurrent }]}
        href={item.href}
        aria-current={isCurrent ? "page" : undefined}
      >
        {item.label}
      </a>
    );
  })}
</nav>
```

- [ ] **Step 3: Build and run the active-route test**

Run:

```bash
npm run build
node --test --test-name-pattern='active route' tests/*.test.mjs
```

Expected: PASS.

- [ ] **Step 4: Commit semantic navigation**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add active navigation semantics"
```

---

### Task 3: Recompose the contact action and data

**Files:**
- Modify: `src/pages/[lang]/contact.astro`
- Modify: `src/data/company.ts`

**Interfaces:**
- Consumes: `page.phoneLabel`, `page.callAction`, `page.lede`, `company.phoneDisplay`, and existing company facts.
- Produces: `.contact-call__content`, `.contact-call__description`, `.contact-cta`, and the existing `.contact-facts` as separate siblings inside `.contact-layout`.

- [ ] **Step 1: Remove the duplicated number from CTA copy**

Change localized data:

```ts
callAction: "Call now",
```

and:

```ts
callAction: "立即拨打",
```

- [ ] **Step 2: Replace the contact panel markup**

Use one number and a distinct CTA:

```astro
<div class="contact-layout">
  <a class="contact-call" href={company.phoneHref}>
    <span class="contact-call__content">
      <span class="contact-call__label">{page.phoneLabel}</span>
      <strong>{company.phoneDisplay}</strong>
      <span class="contact-call__description">{page.lede}</span>
    </span>
    <span class="contact-cta">
      <span>{page.callAction}</span>
      <span aria-hidden="true">→</span>
    </span>
  </a>

  <dl class="contact-facts">
    <!-- Preserve the existing three fact divs unchanged. -->
  </dl>
</div>
```

The outer anchor remains the single `tel:` interaction target.

- [ ] **Step 3: Build and run the contact contract**

Run:

```bash
npm run build
node --test --test-name-pattern='integrated call action|company and contact' tests/*.test.mjs
```

Expected: PASS with verified company facts preserved.

- [ ] **Step 4: Commit contact structure**

```bash
git add src/pages/'[lang]'/contact.astro src/data/company.ts
git commit -m "feat: integrate contact call action"
```

---

### Task 4: Implement the floating navigation visual system

**Files:**
- Modify: `src/styles/global.css`
- Test: `tests/visual-regressions.test.mjs`

**Interfaces:**
- Consumes: `.site-toolbar`, `.brand`, `.site-nav`, `.is-current`, `.control-stack`, `.control-link`, `.control-button`.
- Produces: desktop floating capsule and mobile two-row scroll rail.

- [ ] **Step 1: Replace boxed header styling**

Implement these properties in the existing header rules:

```css
.site-toolbar {
  top: 16px;
  min-height: 58px;
  padding: 7px 8px 7px 14px;
  border: 1px solid color-mix(in srgb, var(--line) 84%, transparent);
  border-radius: 18px;
  background: color-mix(in srgb, var(--paper) 82%, transparent);
  box-shadow: 0 14px 34px color-mix(in srgb, #02080c 18%, transparent);
  backdrop-filter: blur(18px) saturate(140%);
}

.brand {
  border: 0;
  padding: 0 8px 0 0;
  background: transparent;
}

.site-nav a {
  min-width: auto;
  padding: 0 12px;
  border-radius: 12px;
}

.site-nav a.is-current {
  color: var(--ink);
  background: color-mix(in srgb, var(--signal) 16%, var(--button-surface));
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--signal) 32%, transparent);
}
```

Unify `.control-link` and `.control-button` to 44px height, matching radii, and equal surface treatment.

- [ ] **Step 2: Replace mobile grid with scroll rail**

Inside the narrow breakpoint:

```css
.site-nav {
  display: flex;
  width: 100%;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scrollbar-width: none;
  scroll-snap-type: inline proximity;
}

.site-nav::-webkit-scrollbar {
  display: none;
}

.site-nav a {
  flex: 0 0 auto;
  scroll-snap-align: start;
  min-height: 44px;
  padding: 0 14px;
  border: 0;
}
```

Keep brand/control row first and navigation second.

- [ ] **Step 3: Add reduced-motion behavior**

```css
@media (prefers-reduced-motion: reduce) {
  .site-nav a,
  .control-link,
  .control-button,
  .contact-cta span:last-child {
    transition: none;
    transform: none;
  }
}
```

- [ ] **Step 4: Run navigation structural tests**

Run:

```bash
node --test --test-name-pattern='navigation|header controls' tests/visual-regressions.test.mjs
```

Expected: all navigation and 44px contracts pass.

- [ ] **Step 5: Commit navigation styles**

```bash
git add src/styles/global.css tests/visual-regressions.test.mjs
git commit -m "feat: style floating product navigation"
```

---

### Task 5: Implement the contact glass panel and fact strip

**Files:**
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: contact classes introduced in Task 3.
- Produces: responsive horizontal contact action, CTA arrow motion, and three-column fact strip.

- [ ] **Step 1: Replace the contact layout and panel rules**

Implement:

```css
.contact-layout {
  display: grid;
  gap: 18px;
  margin-top: 56px;
}

.contact-call {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 32px;
  align-items: end;
  min-height: 0;
  padding: clamp(24px, 4vw, 42px);
  border: 1px solid color-mix(in srgb, var(--signal) 30%, var(--line));
  border-radius: 24px;
  color: var(--ink);
  background:
    radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--signal) 13%, transparent), transparent 42%),
    color-mix(in srgb, var(--panel) 88%, transparent);
  box-shadow: 0 22px 60px color-mix(in srgb, #02080c 16%, transparent);
  text-decoration: none;
}

.contact-call__content {
  display: grid;
  gap: 14px;
}

.contact-call strong {
  white-space: nowrap;
  font-size: clamp(2.4rem, 6vw, 4.8rem);
}

.contact-call__description {
  max-width: 650px;
  color: var(--muted);
  line-height: 1.65;
}

.contact-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  min-height: 48px;
  padding: 0 18px;
  border-radius: 14px;
  color: var(--paper);
  background: var(--ink);
  font-weight: 800;
}
```

- [ ] **Step 2: Style company facts as a strip**

```css
.contact-facts {
  display: grid;
  grid-template-columns: 1fr 1.6fr 0.8fr;
  border: 1px solid var(--line);
  border-radius: 18px;
  overflow: hidden;
  background: color-mix(in srgb, var(--button-surface) 86%, transparent);
}

.contact-facts > div {
  min-height: 128px;
  padding: 22px;
  border-right: 1px solid var(--line);
  border-bottom: 0;
}
```

The last item removes the right border.

- [ ] **Step 3: Add mobile stacking**

At the mobile breakpoint, switch `.contact-call` and `.contact-facts` to one column, make `.contact-cta` full width, and replace right borders with bottom dividers.

- [ ] **Step 4: Run contact and full tests**

Run:

```bash
npm run verify
git diff --check
```

Expected: 0 Astro diagnostics and all Node tests pass.

- [ ] **Step 5: Commit contact styles**

```bash
git add src/styles/global.css
git commit -m "feat: style modern contact surface"
```

---

### Task 6: Rendered fidelity QA and final delivery

**Files:**
- Modify: `CHANGELOG.md`
- Create: `02 - PROCESSING` screenshots outside the submodule repository.

**Interfaces:**
- Consumes: final built site.
- Produces: native-size screenshots, final verification evidence, Git commits, and versioned production release.

- [ ] **Step 1: Run final local verification**

```bash
npm run verify
git diff --check
```

Expected: 0 errors/warnings/hints, 35 pages, all tests pass.

- [ ] **Step 2: Start a local preview and capture representative pages**

Capture these combinations:

- `/zh/contact/`: desktop/mobile, light/dark.
- `/en/contact/`: desktop/mobile, light/dark.
- `/zh/`: desktop/mobile, light/dark.

Check active route, one-row desktop fit, mobile scroll rail, 44px targets, number wrapping, CTA, fact strip, console, images, and horizontal overflow.

- [ ] **Step 3: Inspect screenshots at native size and fix mismatches**

Reject clipped navigation, tiny controls, duplicated number, white poster appearance, excessive glow, broken dark/light contrast, or mobile page overflow. Repeat build and screenshots until no material mismatch remains.

- [ ] **Step 4: Update changelog and commit implementation**

Add implementation and verification bullets under `2026-07-12`, then:

```bash
git add CHANGELOG.md src tests
git commit -m "feat: modernize navigation and contact surface"
```

- [ ] **Step 5: Merge, verify, and push**

```bash
git merge --ff-only codex/modern-nav-contact
npm run verify
git push origin master
```

- [ ] **Step 6: Deploy a versioned release**

Archive `dist`, upload to `tencent-gz`, unpack under `/var/www/astro-site/releases/<timestamp>-<sha>`, validate files, atomically update `/var/www/astro-site/current`, run `nginx -t`, and retain the prior release.

- [ ] **Step 7: Verify production and update the parent repository**

Verify `/zh/`, `/en/`, `/zh/contact/`, `/en/contact/`, navigation semantics, CSS markers, and browser rendering. Update the parent repository's `code/personal/astro-site` pointer and add a targeted `CHANGELOG.md` entry without staging unrelated parent changes.
