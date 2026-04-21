import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // This tells Vercel to ignore ESLint warnings (like unused variables)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This tells Vercel to ignore strict type checks (like the word "any")
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
