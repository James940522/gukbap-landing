import type { NextConfig } from "next";
import { getSeoConfig } from "./src/lib/seo";

const { siteUrl, origin } = getSeoConfig();

const nextConfig: NextConfig = {
  // Keep project instructions intact when starting the local preview.
  agentRules: false,
  devIndicators: false,
  outputFileTracingIncludes: {
    "/api/stores": ["./data/stores.csv"],
    "/": ["./data/stores.csv"],
    "/stores": ["./data/stores.csv"],
    "/sitemap.xml": ["./data/stores.csv"],
  },
  async redirects() {
    const host = siteUrl.hostname;
    if (siteUrl.protocol !== "https:" || host === "localhost" || siteUrl.port) return [];
    const alternateHost = host.startsWith("www.") ? host.slice(4) : `www.${host}`;
    return [{ source: "/:path*", has: [{ type: "host" as const, value: alternateHost.replace(/\./g, "\\.") }],
      destination: `${origin}/:path*`, permanent: true }];
  },
  async headers() {
    return [{ source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] }];
  },
  images: {
    // Include QHD at 1x and 2x without serving the full camera original.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840, 5120],
    qualities: [75, 90],
  },
};

export default nextConfig;
