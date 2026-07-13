export type SanityConfig = {
  projectId: string;
  dataset: string;
  apiVersion: string;
};

const SANITY_PROJECT_ID = "7lstorz2";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2026-07-13";

export function getSanityConfig(env?: Record<string, string | undefined>): SanityConfig {
  const source = env || (typeof import.meta.env === "object" ? import.meta.env : process.env);
  const projectId = source.SANITY_PROJECT_ID;
  const dataset = source.SANITY_DATASET || SANITY_DATASET;
  const apiVersion = source.SANITY_API_VERSION || SANITY_API_VERSION;

  if (!projectId) throw new Error("Missing SANITY_PROJECT_ID; the site build requires Sanity.");
  if (projectId !== SANITY_PROJECT_ID) throw new Error(`Invalid SANITY_PROJECT_ID: ${projectId}`);
  if (dataset !== SANITY_DATASET) throw new Error(`Invalid SANITY_DATASET: ${dataset}`);
  if (apiVersion !== SANITY_API_VERSION) throw new Error(`Invalid SANITY_API_VERSION: ${apiVersion}`);

  return { projectId, dataset, apiVersion };
}
