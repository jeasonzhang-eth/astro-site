import test from "node:test";
import assert from "node:assert/strict";
import { createLocalNoteDocuments } from "../scripts/export-local-notes";
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

test("exported Note IDs are public root document IDs", () => {
  const documents = createLocalNoteDocuments();
  const ids = documents.map((document) => document._id);

  assert.deepEqual(ids, [
    "note-ai-agent-workflow-en",
    "note-ai-agent-workflow-zh",
    "note-desktop-automation-en",
    "note-desktop-automation-zh",
    "note-creator-tools-en",
    "note-creator-tools-zh",
    "note-market-research-en",
    "note-market-research-zh",
  ]);
  assert.equal(ids.some((id) => id.includes(".")), false);
  for (const id of ids) assert.match(id, /^note-[a-z0-9-]+-(en|zh)$/);
});
