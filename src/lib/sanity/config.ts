export type SanityConfig = {
  projectId: string;
  dataset: string;
  apiVersion: string;
};

export function getSanityConfig(env?: Record<string, string | undefined>): SanityConfig {
  const source = env || (typeof import.meta.env === "object" ? import.meta.env : process.env);
  const projectId = source.SANITY_PROJECT_ID;
  const dataset = source.SANITY_DATASET || "production";
  const apiVersion = source.SANITY_API_VERSION || "2026-07-13";

  if (!projectId) throw new Error("Missing SANITY_PROJECT_ID; the Notes build requires Sanity.");
  if (!/^[a-z0-9-]+$/.test(dataset)) throw new Error(`Invalid SANITY_DATASET: ${dataset}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(apiVersion)) throw new Error(`Invalid SANITY_API_VERSION: ${apiVersion}`);

  return { projectId, dataset, apiVersion };
}
