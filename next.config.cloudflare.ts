import type { NextConfig } from "next";

// Configuration for Cloudflare Pages static export
const nextConfig: NextConfig = {
  output: 'export', // Static export for Cloudflare Pages
  images: {
    unoptimized: true, // Required for static export (images already optimized via custom renderer)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    turbo: {
      root: __dirname,
    },
  },
  // Note: async headers() doesn't work with static export
  // Security headers are configured in public/_headers for Cloudflare Pages
};

export default nextConfig;
