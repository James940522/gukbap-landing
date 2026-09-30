import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep project instructions intact when starting the local preview.
  agentRules: false,
  devIndicators: false,
};

export default nextConfig;
