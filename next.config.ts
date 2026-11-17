import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: 'placecats.com',
        protocol: 'https',
        port: ''
      },
      {
        hostname: 'vibrant-mammoth-489.eu-west-1.convex.cloud',
        protocol: 'https',
        port: ''
      }
    ]
  }
};

export default nextConfig;
