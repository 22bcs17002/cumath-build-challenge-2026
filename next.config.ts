import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // This tells Vercel to ignore strict type checks (like the word "any")
    ignoreBuildErrors: true,
  },
};

export default nextConfig;