import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true, // Disable image optimization for regular <img> tags
  },
  // Ensure static files are served correctly in standalone mode
  experimental: {
    outputFileTracingRoot: undefined,
  },
};

export default nextConfig;
