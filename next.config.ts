import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true, // Disable image optimization for regular <img> tags
  },
};

export default nextConfig;
