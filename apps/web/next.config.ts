import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true
  },
  transpilePackages: ["@tech-news-hub/shared", "@tech-news-hub/ui"]
};

export default nextConfig;
