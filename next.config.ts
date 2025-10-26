import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 's.alicdn.com',
      },
    ],
    unoptimized: true,
  },
  serverExternalPackages: ['firebase-admin'],
};

export default nextConfig;
