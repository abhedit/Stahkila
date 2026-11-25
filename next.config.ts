import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  outputFileTracingIncludes: {
    "/*": ["./src/components/sites/morphogenesis/archive/**/*"],
  },
};

export default nextConfig;
