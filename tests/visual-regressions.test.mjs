import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(path, "utf8");

const editorialRoutes = [
  "dist/zh/index.html",
  "dist/en/index.html",
  "dist/zh/services/index.html",
  "dist/en/services/index.html",
  "dist/zh/company/index.html",
  "dist/en/company/index.html",
  "dist/zh/contact/index.html",
  "dist/en/contact/index.html",
  "dist/zh/about/index.html",
  "dist/en/about/index.html",
];

function extractBalancedBlocks(source, atRulePattern) {
  const blocks = [];
  const matcher = new RegExp(atRulePattern.source, atRulePattern.flags.includes("g") ? atRulePattern.flags : `${atRulePattern.flags}g`);
  let match;

  while ((match = matcher.exec(source)) !== null) {
    const open = source.indexOf("{", match.index);
    if (open === -1) continue;

    let depth = 0;
    for (let index = open; index < source.length; index += 1) {
      if (source[index] === "{") depth += 1;
      if (source[index] === "}") depth -= 1;
      if (depth === 0) {
        blocks.push(source.slice(match.index, index + 1));
        matcher.lastIndex = index + 1;
        break;
      }
    }
  }

  return blocks;
}

function cssRules(source) {
  return [...source.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((match) => ({
    selector: match[1].trim(),
    declarations: match[2],
  }));
}

function cssLengthToPx(value, unit) {
  const numeric = Number.parseFloat(value);
  if (unit === "px") return numeric;
  if (unit === "rem" || unit === "em") return numeric * 16;
  return Number.NaN;
}

test("editorial landing pages expose deliberate multi-line display headlines", async () => {
  const [css, displayHeadline, ...documents] = await Promise.all([
    read("src/styles/global.css"),
    read("src/components/DisplayHeadline.astro"),
    ...editorialRoutes.map(read),
  ]);

  assert.match(
    `${css}\n${displayHeadline}`,
    /\.headline-line\s*\{[^}]*display\s*:\s*block\s*;/s,
    "headline-line must be a block-level visual line",
  );

  editorialRoutes.forEach((route, index) => {
    const html = documents[index];
    const heading = html.match(/<h1\b[^>]*class="[^"]*\bdisplay-headline\b[^"]*"[^>]*>[\s\S]*?<\/h1>/i)?.[0];

    assert.ok(heading, `${route} must render an h1.display-headline`);
    const lineCount = (heading.match(/class="[^"]*\bheadline-line\b[^"]*"/g) ?? []).length;
    assert.ok(lineCount >= 2, `${route} must render at least two intentional headline lines, got ${lineCount}`);
  });
});

test("home display headlines preserve complete accessible labels", async () => {
  const [zh, en] = await Promise.all([
    read("dist/zh/index.html"),
    read("dist/en/index.html"),
  ]);

  assert.match(zh, /aria-label="把真实业务问题，做成可以运行的工具与系统。"/);
  assert.match(en, /aria-label="Turn real business problems into working tools and systems\."/);
});

test("editorial artwork uses measured per-panel crop parameters instead of equal thirds", async () => {
  const [component, css] = await Promise.all([
    read("src/components/EditorialArtwork.astro"),
    read("src/styles/global.css"),
  ]);
  const artworkSource = `${component}\n${css}`;

  assert.doesNotMatch(artworkSource, /width\s*:\s*300%/i);
  assert.doesNotMatch(artworkSource, /(?:left\s*:\s*|translateX\(\s*)-100%/i);
  assert.doesNotMatch(artworkSource, /(?:left\s*:\s*|translateX\(\s*)-200%/i);

  for (const variant of ["workbench", "systems", "company"]) {
    const objectConfig = component.match(
      new RegExp(`${variant}\\s*:\\s*\\{([\\s\\S]{0,500}?)\\n\\s*\\}`, "i"),
    )?.[1];
    const cssConfig = component.match(
      new RegExp(`\\.editorial-art--${variant}\\s+\\.editorial-art__image\\s*\\{([^}]*)\\}`, "i"),
    )?.[1];
    const configuredBlock = objectConfig ?? cssConfig;

    assert.ok(configuredBlock, `EditorialArtwork must define measured crop settings for ${variant}`);
    assert.match(configuredBlock, /(?:left|x|start|position)\s*[:=]\s*["']?-?\d+(?:\.\d+)?(?:%|px)?/i);
    assert.match(configuredBlock, /(?:width|size|end)\s*[:=]\s*["']?\d+(?:\.\d+)?(?:%|px)?/i);
  }
});

test("desktop navigation provides a comfortable vertical hit area", async () => {
  const css = await read("src/styles/global.css");
  const desktopNavRule = css.match(/\.site-nav a\s*\{([^}]*)\}/i)?.[1] ?? "";

  assert.match(desktopNavRule, /display\s*:\s*inline-flex/i);
  assert.match(desktopNavRule, /align-items\s*:\s*center/i);
  const minHeight = Number.parseFloat(desktopNavRule.match(/min-height\s*:\s*(\d+(?:\.\d+)?)px/i)?.[1] ?? "0");
  const minWidth = Number.parseFloat(desktopNavRule.match(/min-width\s*:\s*(\d+(?:\.\d+)?)px/i)?.[1] ?? "0");
  assert.ok(minHeight >= 44, `desktop navigation link min-height must be at least 44px, got ${minHeight}px`);
  assert.ok(minWidth >= 44, `desktop navigation link min-width must be at least 44px, got ${minWidth}px`);
});

test("mobile English hero keeps its three authored lines intact", async () => {
  const component = await read("src/components/DisplayHeadline.astro");
  assert.match(
    component,
    /display-headline\[data-variant="hero"\]\[data-language="en"\][^{]*headline-line\s*\{[^}]*white-space\s*:\s*nowrap/is,
  );
  const mobileEnglishRule = component.match(
    /@media\s*\(max-width:\s*820px\)[\s\S]*?\.display-headline\[data-variant="hero"\]\[data-language="en"\]\s*\{([^}]*)\}/i,
  )?.[1] ?? "";
  const maximumRem = Number.parseFloat(mobileEnglishRule.match(/font-size\s*:\s*clamp\([^,]+,[^,]+,\s*(\d+(?:\.\d+)?)rem\s*\)/i)?.[1] ?? "99");
  assert.ok(maximumRem <= 1.6, `mobile English hero maximum must stay compact enough for three lines, got ${maximumRem}rem`);
});

test("header controls meet a 44px minimum hit target", async () => {
  const css = await read("src/styles/global.css");
  for (const selector of ["control-button", "control-link"]) {
    const rules = [...css.matchAll(new RegExp(`\\.${selector}\\s*\\{([^}]*)\\}`, "gi"))];
    const minHeights = rules.map((rule) =>
      Number.parseFloat(rule[1].match(/min-height\s*:\s*(\d+(?:\.\d+)?)px/i)?.[1] ?? "0"),
    );
    assert.ok(Math.max(0, ...minHeights) >= 44, `${selector} must define a min-height of at least 44px`);
  }
});

test("mobile navigation keeps touch-safe links in its product rail", async () => {
  const css = await read("src/styles/global.css");
  const mobileCss = extractBalancedBlocks(css, /@media\s*\([^)]*max-width\s*:[^)]*\)/gi).join("\n");
  const rules = cssRules(mobileCss);
  const linkDeclarations = rules
    .filter(({ selector }) => /\.site-nav\s+a\b/.test(selector))
    .map(({ declarations }) => declarations)
    .join("\n");

  const minHeights = [...linkDeclarations.matchAll(/min-height\s*:\s*(\d+(?:\.\d+)?)(px|rem|em)/gi)]
    .map((match) => cssLengthToPx(match[1], match[2].toLowerCase()))
    .filter(Number.isFinite);
  assert.ok(minHeights.some((height) => height >= 44), "mobile navigation links must have a min-height of at least 44px");
  assert.match(mobileCss, /\.site-nav\s*\{[^}]*overflow-x\s*:\s*auto/is);
});

test("FAQ summaries provide a full-size click target", async () => {
  const css = await read("src/styles/global.css");
  const declarations = css.match(/\.faq-list summary\s*\{([^}]*)\}/i)?.[1] ?? "";
  const minHeight = Number.parseFloat(declarations.match(/min-height\s*:\s*(\d+(?:\.\d+)?)px/i)?.[1] ?? "0");
  assert.ok(minHeight >= 44, `FAQ summary min-height must be at least 44px, got ${minHeight}px`);
});

test("headings do not use emergency anywhere wrapping", async () => {
  const css = await read("src/styles/global.css");
  const unsafeHeadingRules = cssRules(css).filter(({ selector, declarations }) =>
    /(^|,|\s)h[1-3](?=\s|,|$)/i.test(selector) && /overflow-wrap\s*:\s*anywhere/i.test(declarations),
  );

  assert.deepEqual(
    unsafeHeadingRules.map(({ selector }) => selector),
    [],
    "h1-h3 must not use overflow-wrap:anywhere",
  );
});

test("contact phone typography remains intact and numerically aligned", async () => {
  const css = await read("src/styles/global.css");
  const contactDeclarations = cssRules(css)
    .filter(({ selector }) => selector.includes("contact") && /(?:strong|phone|tel|call)/i.test(selector))
    .map(({ declarations }) => declarations)
    .join("\n");

  assert.match(contactDeclarations, /white-space\s*:\s*nowrap/i);
  assert.match(contactDeclarations, /font-variant-numeric\s*:\s*tabular-nums/i);
});

test("footer text never drops below 12px", async () => {
  const css = await read("src/styles/global.css");
  const footerSizes = cssRules(css)
    .filter(({ selector }) => selector.includes("footer"))
    .flatMap(({ selector, declarations }) =>
      [...declarations.matchAll(/font-size\s*:\s*(\d+(?:\.\d+)?)(px|rem|em)/gi)].map((match) => ({
        selector,
        raw: `${match[1]}${match[2]}`,
        px: cssLengthToPx(match[1], match[2].toLowerCase()),
      })),
    );

  assert.ok(footerSizes.length > 0, "footer must declare an explicit readable font size");
  const undersized = footerSizes.filter(({ px }) => Number.isFinite(px) && px < 12);
  assert.deepEqual(
    undersized,
    [],
    `footer font sizes must be at least 12px: ${undersized.map(({ selector, raw }) => `${selector}=${raw}`).join(", ")}`,
  );
});

test("WeCom project titles keep AI Agent together", async () => {
  for (const route of [
    "dist/zh/projects/wecom-kf-ai-agent/index.html",
    "dist/en/projects/wecom-kf-ai-agent/index.html",
  ]) {
    const html = await read(route);
    const heading = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/i)?.[0];

    assert.ok(heading, `${route} must render a project h1`);
    assert.match(heading, /AI(?:&nbsp;|&#160;|&#xA0;|\u00a0)Agent/i);
    assert.doesNotMatch(heading, /AI Agent/i);
  }
});

test("mobile navigation uses a horizontal product rail", async () => {
  const css = await read("src/styles/global.css");
  const mobileCss = extractBalancedBlocks(css, /@media\s*\([^)]*max-width\s*:[^)]*\)/gi).join("\n");

  assert.match(mobileCss, /\.site-nav\s*\{[^}]*overflow-x\s*:\s*auto/is);
  assert.match(mobileCss, /\.site-nav\s*\{[^}]*grid-row\s*:\s*2/is);
  assert.match(mobileCss, /\.control-stack\s*\{[^}]*grid-row\s*:\s*1/is);
  assert.match(mobileCss, /scrollbar-width\s*:\s*none/i);
  assert.match(css, /\.site-nav::?-webkit-scrollbar\s*\{[^}]*display\s*:\s*none/is);
});
