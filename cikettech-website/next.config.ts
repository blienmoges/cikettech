import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a minimal, self-contained server bundle in .next/standalone —
  // required by the multi-stage Dockerfile so the runtime image doesn't need
  // node_modules or the full source tree.
  output: "standalone",
};

export default nextConfig;
