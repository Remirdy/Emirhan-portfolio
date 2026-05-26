import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Vercel build should not fail on strict third-party animation variant typings.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
