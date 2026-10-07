import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep project instructions intact when starting the local preview.
  agentRules: false,
  devIndicators: false,
  images: {
    // Include QHD at 1x and 2x without serving the full camera original.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840, 5120],
    qualities: [75, 90],
  },
};

export default nextConfig;
