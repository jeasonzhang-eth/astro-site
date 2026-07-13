import test from "node:test";
import assert from "node:assert/strict";
import {
  buildNoteDiscoveryEntries,
  encodeRouteSegment,
  escapeXmlText,
  serializeLlmsNoteLines,
  serializeSitemap,
  toSingleLineText,
} from "../src/lib/discovery/serialize";

test("XML text escaping covers every reserved character used in loc output", () => {
  assert.equal(escapeXmlText(`&<>"'`), "&amp;&lt;&gt;&quot;&apos;");
});

test("Sitemap serialization escapes canonical URLs and deduplicates in first-seen order", () => {
  const unsafeUrl = `https://example.test/notes/?a=1&tag=<note>&quote="yes"&apostrophe='ok'`;
  const xml = serializeSitemap([unsafeUrl, "https://example.test/safe/", unsafeUrl]);

  assert.equal((xml.match(/<loc>/g) ?? []).length, 2);
  assert.match(
    xml,
    /<loc>https:\/\/example\.test\/notes\/\?a=1&amp;tag=&lt;note&gt;&amp;quote=&quot;yes&quot;&amp;apostrophe=&apos;ok&apos;<\/loc>/,
  );
  assert.ok(xml.indexOf("/notes/") < xml.indexOf("/safe/"));
});

test("llms labels collapse line-breaking and repeated whitespace into one trimmed line", () => {
  assert.equal(
    toSingleLineText(" \r\n  Safe\t title   with\n extra spacing  "),
    "Safe title with extra spacing",
  );

  const output = serializeLlmsNoteLines(
    [{
      language: "en",
      path: "/en/notes/safe-note/",
      title: "Safe title\r\n- Injected entry: https://evil.test/",
    }],
    "https://beishuyinqing.cn",
  );

  assert.equal(output.split("\n").length, 1);
  assert.equal(
    output,
    "- Safe title - Injected entry: https://evil.test/ (EN): https://beishuyinqing.cn/en/notes/safe-note/",
  );
});

test("route segments are encoded safely and reject path/control injection", () => {
  assert.equal(encodeRouteSegment("中文 & note"), "%E4%B8%AD%E6%96%87%20%26%20note");
  assert.throws(() => encodeRouteSegment("nested/path"), /single route segment/);
  assert.throws(() => encodeRouteSegment("line\nbreak"), /control characters/);
  assert.throws(() => encodeRouteSegment("   "), /non-empty/);
});

test("Note discovery preserves translated slugs, incomplete pairs, deterministic order, and dedupe", () => {
  const entries = buildNoteDiscoveryEntries([
    {
      translationKey: "paired",
      language: "zh",
      slug: "zh-actual-slug",
      title: "中文标题",
    },
    {
      translationKey: "english-only",
      language: "en",
      slug: "english-only-slug",
      title: "English only",
    },
    {
      translationKey: "paired",
      language: "en",
      slug: "different-en-slug",
      title: "English title",
    },
    {
      translationKey: "duplicate-route",
      language: "en",
      slug: "english-only-slug",
      title: "Duplicate route",
    },
    {
      translationKey: "hidden",
      language: "zh",
      slug: "hidden-note",
      title: "Hidden note",
      seo: { noIndex: true },
    },
  ]);

  assert.deepEqual(entries, [
    {
      language: "en",
      path: "/en/notes/different-en-slug/",
      title: "English title",
    },
    {
      language: "zh",
      path: "/zh/notes/zh-actual-slug/",
      title: "中文标题",
    },
    {
      language: "en",
      path: "/en/notes/english-only-slug/",
      title: "English only",
    },
  ]);
});
