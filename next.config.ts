import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
    // placeholder gallery photos (Unsplash licence) until the client sends real work
    remotePatterns: [new URL("https://images.unsplash.com/**")],
  },
};

export default nextConfig;
