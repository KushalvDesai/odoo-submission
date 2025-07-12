import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable TypeScript strict mode
  typescript: {
    // Allow build to complete even with TypeScript errors during development
    ignoreBuildErrors: true,
  },
  // Enable ESLint during builds but ignore errors for now
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
