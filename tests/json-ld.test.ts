import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { serializeJsonLd } from "../src/lib/seo/json-ld";

const hostileValue = {
  title: "Hostile JSON-LD",
  payload: '</script><script>globalThis.compromised = true</script>',
  separators: "first\u2028second\u2029third",
  nested: ["<strong>markup</strong>", { value: "safe" }],
};

test("JSON-LD serialization prevents script-tag breakouts", () => {
  const serialized = serializeJsonLd(hostileValue);

  assert.doesNotMatch(serialized, /<\/script><script>/i);
  assert.doesNotMatch(serialized, /<\/script/i);
  assert.match(serialized, /\\u003c\/script>/i);
});

test("JSON-LD serialization escapes line separators and round-trips", () => {
  const serialized = serializeJsonLd(hostileValue);

  assert.doesNotMatch(serialized, /\u2028/);
  assert.doesNotMatch(serialized, /\u2029/);
  assert.match(serialized, /\\u2028/);
  assert.match(serialized, /\\u2029/);
  assert.deepEqual(JSON.parse(serialized), hostileValue);
});

test("SEO rendering uses the safe JSON-LD serializer", () => {
  const seoSource = readFileSync(new URL("../src/components/Seo.astro", import.meta.url), "utf8");

  assert.match(seoSource, /import \{ serializeJsonLd \}/);
  assert.match(seoSource, /set:html=\{serializeJsonLd\(item\)\}/);
  assert.doesNotMatch(seoSource, /set:html=\{JSON\.stringify\(item\)\}/);
});
