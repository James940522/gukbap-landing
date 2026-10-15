import type { MetadataRoute } from "next";
import { absoluteUrl, getSeoConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const config = getSeoConfig();
  return {
    // Allow rendering resources and HTML so crawlers can read the noindex policy.
    rules: { userAgent: "*", allow: "/" },
    ...(config.indexable ? { sitemap: absoluteUrl("/sitemap.xml", config) } : {}),
  };
}
