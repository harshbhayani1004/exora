import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: path.dirname(projectRoot),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-2a5d8e5eaff3498da143b1150b20a7c1.r2.dev",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 828, 1080, 1200, 1920],
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
