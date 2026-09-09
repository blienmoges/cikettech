import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a minimal, self-contained server bundle in .next/standalone —
  // required by the multi-stage Dockerfile so the runtime image doesn't need
  // node_modules or the full source tree.
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "commons.wikimedia.org" },
      // Admin-uploaded files, served by cikettech-backend (see resolveMediaUrl
      // in app/lib/api.ts). Add your production backend's hostname here too
      // once one exists.
      { protocol: "http", hostname: "localhost", port: "4000" },
    ],
  },
};

export default nextConfig;
