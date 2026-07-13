import test from "node:test";
import assert from "node:assert/strict";
import { getSanityConfig } from "../src/lib/sanity/config";
import { getSanityClient } from "../src/lib/sanity/client";

test("Sanity configuration requires a project ID", () => {
  assert.throws(
    () => getSanityConfig({ SANITY_DATASET: "production", SANITY_API_VERSION: "2026-07-13" }),
    /SANITY_PROJECT_ID/,
  );
});

test("Sanity configuration rejects a mismatched project ID", () => {
  assert.throws(
    () =>
      getSanityConfig({
        SANITY_PROJECT_ID: "different-project",
        SANITY_DATASET: "production",
        SANITY_API_VERSION: "2026-07-13",
      }),
    /SANITY_PROJECT_ID/,
  );
});

test("Sanity configuration rejects a mismatched dataset", () => {
  assert.throws(
    () =>
      getSanityConfig({
        SANITY_PROJECT_ID: "7lstorz2",
        SANITY_DATASET: "staging",
        SANITY_API_VERSION: "2026-07-13",
      }),
    /SANITY_DATASET/,
  );
});

test("Sanity configuration rejects a mismatched API version", () => {
  assert.throws(
    () =>
      getSanityConfig({
        SANITY_PROJECT_ID: "7lstorz2",
        SANITY_DATASET: "production",
        SANITY_API_VERSION: "2026-07-12",
      }),
    /SANITY_API_VERSION/,
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

function withSanityEnvironment(run: () => void) {
  const previous = {
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
    SANITY_DATASET: process.env.SANITY_DATASET,
    SANITY_API_VERSION: process.env.SANITY_API_VERSION,
  };

  process.env.SANITY_PROJECT_ID = "7lstorz2";
  process.env.SANITY_DATASET = "production";
  process.env.SANITY_API_VERSION = "2026-07-13";

  try {
    run();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test("Sanity client is created once and reused", () => {
  withSanityEnvironment(() => {
    assert.strictEqual(getSanityClient(), getSanityClient());
  });
});

test("Sanity client uses the fixed published-read configuration", () => {
  withSanityEnvironment(() => {
    const config = getSanityClient().config();

    assert.deepEqual(
      {
        projectId: config.projectId,
        dataset: config.dataset,
        apiVersion: config.apiVersion,
        useCdn: config.useCdn,
        perspective: config.perspective,
      },
      {
        projectId: "7lstorz2",
        dataset: "production",
        apiVersion: "2026-07-13",
        useCdn: true,
        perspective: "published",
      },
    );
  });
});
