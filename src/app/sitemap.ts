import type { MetadataRoute } from "next";
import { absoluteUrl, getSeoConfig } from "@/lib/seo";
import { getStoreDirectory } from "@/lib/stores";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const config = getSeoConfig();
  if (!config.indexable) return [];
  const directory = await getStoreDirectory();
  return [
    { url: absoluteUrl("/", config) },
    ...(!directory.error && directory.stores.length > 0
      ? [{ url: absoluteUrl("/stores", config) }] : []),
  ];
}
