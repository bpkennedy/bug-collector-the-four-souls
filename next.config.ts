import type { NextConfig } from "next";

// Add a timestamp to force new builds
const buildId = Date.now().toString();

const nextConfig: NextConfig = {
  /* config options here */
  generateBuildId: () => buildId,
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0, must-revalidate'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
