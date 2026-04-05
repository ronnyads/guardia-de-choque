import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 768, 1024, 1280, 1920],
    imageSizes: [32, 64, 128, 220, 256, 384],
    minimumCacheTTL: 5184000,
  },
};

export default nextConfig;
