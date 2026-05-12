import type { NextConfig } from "next";

const ORCHESTRA_URL =
  process.env.ORCHESTRA_URL ||
  "https://vogolab-orchestra-production.up.railway.app";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.microlink.io" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
    ],
  },
  async rewrites() {
    return [
      // Public customer portal — proxies to Vogolab Orchestra dashboard
      // service. Cookies (portal_session) are passed through; user sees
      // everything at vogolab.com/ads/* with no cross-domain CORS issues.
      {
        source: "/ads",
        destination: `${ORCHESTRA_URL}/ads`,
      },
      {
        source: "/ads/:path*",
        destination: `${ORCHESTRA_URL}/ads/:path*`,
      },
      // Static portal assets + public API endpoints
      {
        source: "/portal-static/:path*",
        destination: `${ORCHESTRA_URL}/portal-static/:path*`,
      },
      {
        source: "/api/public/:path*",
        destination: `${ORCHESTRA_URL}/api/public/:path*`,
      },
    ];
  },
};

export default nextConfig;
