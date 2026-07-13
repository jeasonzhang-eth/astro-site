import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { getSanityConfig } from "./config";

const builder = createImageUrlBuilder(getSanityConfig());

export const sanityImageUrl = (source: SanityImageSource) => builder.image(source);
