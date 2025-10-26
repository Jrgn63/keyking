import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  },
  serverExternalPackages: ['firebase-admin'],
};

export default nextConfig;
