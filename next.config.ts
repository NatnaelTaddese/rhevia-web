import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "images.justwatch.com",
        pathname: "/poster/**",
      },
      {
        protocol: "https",
        hostname: "live.metahub.space",
        pathname: "/poster/**",
      },
    ],
  },
};

export default nextConfig;
