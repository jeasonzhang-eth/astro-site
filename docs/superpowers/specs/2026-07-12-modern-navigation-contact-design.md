# Modern Navigation and Contact Surface Design

## Status

Approved visual direction: modern technology product interface.

## Problem

The current header reads as a collection of unrelated utility buttons. The bordered brand block, text navigation, language control, and theme control use different shapes and visual weights, so the top of the page has no clear hierarchy.

The current contact surface uses a large light-colored square containing an oversized phone number, while company facts sit in a separate definition list. In dark mode this creates an abrupt white poster, repeats the phone number, and makes the contact action feel disconnected from the company information.

## Goals

- Make the header feel like one intentional product-navigation component.
- Preserve fast access to all six primary routes, language switching, and theme switching.
- Make the active route immediately visible without adding visual noise.
- Replace the isolated phone poster with a coherent contact action panel.
- Preserve verified company name, address, phone number, and ICP information.
- Work consistently in Chinese and English, light and dark themes, desktop and mobile layouts.
- Preserve minimum 44px interaction targets and keyboard-visible focus states.

## Non-goals

- No navigation labels or route order changes.
- No hamburger menu or hidden desktop navigation.
- No new contact channels, social accounts, QR codes, or unverified company facts.
- No global typography, hero copy, page order, or footer redesign.
- No large decorative gradients, stock imagery, or icon library dependency.

## Navigation Design

### Desktop

The header becomes a floating capsule inside the existing site shell.

- Sticky position with approximately 16px top clearance.
- Height approximately 56px, with a consistent 12-16px internal rhythm.
- Translucent surface based on the current paper/panel color and `backdrop-filter: blur(...)`.
- One subtle border and soft shadow separate it from the page grid.
- The brand becomes an unboxed horizontal lockup. The existing abstract mark remains, but the rectangular border is removed.
- The six primary links remain visible in one row.
- The active route uses a compact signal-colored pill or filled surface; inactive links remain quiet.
- Language and theme controls use the same height, radius, border treatment, and typography.
- Hover states use small surface/color changes, not large movement.

Desktop structure:

```text
[brand lockup]   project note service company about [contact]   [language] [theme]
```

### Mobile

The mobile header uses two intentional rows rather than the current six-cell button grid.

- First row: brand lockup on the left; language and theme controls on the right.
- Second row: horizontally scrollable navigation rail with all six labels visible through scrolling.
- No hamburger menu and no hidden destinations.
- The current route remains a filled pill.
- Navigation rail hides the visual scrollbar while preserving touch scrolling and keyboard access.
- Every interactive target is at least 44px high.

### Theme treatment

Dark theme:

- Deep translucent blue-black surface.
- Cool gray border.
- Signal teal used only for the active route and focus/hover accents.
- Soft shadow with low opacity.

Light theme:

- Warm translucent paper surface.
- Neutral gray border.
- Same signal teal active state.
- Shadow reduced to avoid a floating-card-heavy appearance.

## Contact Surface Design

### Primary contact panel

Replace the square `contact-call` poster with a horizontal glass-style action panel spanning the contact content width.

Desktop structure:

```text
Direct conversation
185 9314 1894                       [Call now ->]
A short call can confirm the problem, boundaries, and next step.
```

- The panel uses a translucent dark/paper-compatible surface rather than a fixed white or black block.
- A restrained signal-colored edge glow or corner gradient may be used, but it must not reduce text contrast.
- The phone number remains prominent but is reduced to a controlled display size.
- The phone number appears only once inside the panel.
- The existing call action becomes a real right-aligned CTA with an arrow.
- The entire panel remains a `tel:` link, while the CTA visually explains the action.
- Hover/focus can move the arrow by a few pixels and strengthen the border.
- The telephone remains `nowrap` with tabular numerals.

### Company facts

Company name, address, and ICP registration move into a compact three-column fact strip below the primary contact panel.

- Shared surface and border language with the contact panel.
- Small signal-colored labels and restrained body text.
- No competing oversized typography.
- ICP remains a normal external link.
- On narrow screens, facts stack into one column with divider lines.

### Mobile

- Contact panel becomes a vertical stack.
- Label and number appear first, explanatory text follows, CTA spans the available width.
- Number remains on one line at 390px.
- Fact strip stacks beneath the panel.

## Motion

- Header hover/focus transitions: 140-180ms.
- Active navigation state does not animate on initial load.
- Contact panel CTA arrow translates no more than 4px on hover/focus.
- Respect `prefers-reduced-motion` by disabling nonessential transforms.

## Accessibility

- Keep semantic `<header>`, `<nav>`, links, and button elements.
- Add `aria-current="page"` to the active primary navigation link.
- Preserve visible `:focus-visible` outlines.
- Maintain minimum 44px hit targets.
- Maintain WCAG-readable contrast in both themes.
- Do not use color alone for the active route: combine fill/border and `aria-current`.
- Keep telephone and ICP links keyboard operable.

## Responsive Acceptance Criteria

Desktop checks at 1440x1100:

- Header remains one row and does not wrap.
- Brand, six links, language, and theme controls all fit inside the site shell.
- Header does not cover the page headline when sticky.
- Contact number, CTA, and explanatory copy have clear hierarchy.

Mobile checks at 390x844:

- Header first row and navigation rail remain within viewport width.
- Navigation rail scrolls horizontally without page-level horizontal overflow.
- All controls are at least 44px high.
- Phone number remains on one line.
- Contact CTA is easy to tap and company facts remain readable.

## Visual Acceptance Criteria

- Header reads as one component rather than separate boxes.
- Active page is identifiable within one second.
- Contact panel belongs to the dark/light page rather than appearing as an unrelated poster.
- Phone number is prominent but not the largest visual element on the page.
- No duplicated phone number inside the contact panel.
- No clipped text, accidental wrapping, browser-default link styling, or horizontal overflow.
- Existing hero, page content, footer, routing, and factual information remain unchanged.

## Verification Plan

- Add structural tests for `aria-current`, shared control sizing, mobile navigation rail, and nonduplicated contact number.
- Run `npm run verify`.
- Capture contact page and one representative non-contact page in Chinese/English, light/dark, desktop/mobile.
- Inspect screenshots at native size.
- Verify keyboard focus and `tel:` behavior.
- Deploy as a versioned release with the previous release retained for rollback.
