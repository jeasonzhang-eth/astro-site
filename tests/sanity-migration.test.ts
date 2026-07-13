import test from "node:test";
import assert from "node:assert/strict";
import { convertFaqAnswer, convertLocalNoteContent } from "../scripts/sanity/portable-text";

const local = {
  title: "Title",
  tag: "Tag",
  summary: "Summary",
  definition: "Definition text",
  overview: "Overview text",
  principles: ["Principle one", "Principle two"],
  checklist: ["Check one", "Check two"],
  examples: ["Example one"],
  next: "Next text",
  faq: [{ question: "Question", answer: "Answer" }],
};

test("migration preserves section and list order", () => {
  const blocks = convertLocalNoteContent(local, "en");
  assert.deepEqual(
    blocks.filter((block) => block.style === "h2").map((block) => block.children?.[0]?.text),
    ["Definition", "Overview", "Principles", "Checklist", "Examples", "Next steps"],
  );
  assert.deepEqual(
    blocks.filter((block) => block.listItem === "number").map((block) => block.children?.[0]?.text),
    ["Check one", "Check two"],
  );
});

test("migration keys are deterministic", () => {
  assert.deepEqual(convertLocalNoteContent(local, "zh"), convertLocalNoteContent(local, "zh"));
});

test("FAQ answers become Portable Text paragraphs", () => {
  assert.equal(convertFaqAnswer("Answer")[0]?.children?.[0]?.text, "Answer");
});

import { existsSync } from "node:fs";

test("full-site migration removes every runtime local content source", () => {
  for (const path of ["src/data/site.ts", "src/data/company.ts", "src/data/services.ts"]) {
    assert.equal(existsSync(path), false, `${path} must not remain as a runtime fallback`);
  }
});
