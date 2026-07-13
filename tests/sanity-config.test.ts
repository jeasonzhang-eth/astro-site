import test from "node:test";
import assert from "node:assert/strict";
import { getSanityConfig } from "../src/lib/sanity/config";

test("Sanity configuration requires a project ID", () => {
  assert.throws(
    () => getSanityConfig({ SANITY_DATASET: "production", SANITY_API_VERSION: "2026-07-13" }),
    /SANITY_PROJECT_ID/,
  );
});

test("Sanity configuration returns the fixed production settings", () => {
  assert.deepEqual(
    getSanityConfig({
      SANITY_PROJECT_ID: "7lstorz2",
      SANITY_DATASET: "production",
      SANITY_API_VERSION: "2026-07-13",
    }),
    { projectId: "7lstorz2", dataset: "production", apiVersion: "2026-07-13" },
  );
});
