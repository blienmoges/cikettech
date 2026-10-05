import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a minimal, self-contained server bundle in .next/standalone —
  // required by the multi-stage Dockerfile so the runtime image doesn't need
  // node_modules or the full source tree.
  output: "standalone",
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "commons.wikimedia.org" },
      { protocol: "https", hostname: "cikettech.onrender.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "http", hostname: "localhost", port: "4000" },
    ],
  },
};

export default nextConfig;
