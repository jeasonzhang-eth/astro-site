import { createClient } from "@sanity/client";
import { getSanityConfig } from "./config";

let client: ReturnType<typeof createClient> | undefined;

export function getSanityClient() {
  client ||= createClient({
    ...getSanityConfig(),
    useCdn: false,
    perspective: "published",
  });
  return client;
}
