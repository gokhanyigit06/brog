import type { NextConfig } from "next";

const ORCHESTRA_URL =
  process.env.ORCHESTRA_URL ||
  "https://vogolab-orchestra-production.up.railway.app";

// Tüm sayfalarda uygulanan güvenlik başlıkları. CSP bilinçli olarak burada YOK:
// GA4 / Meta Pixel / Firebase inline+harici script kullanıyor, sıkı bir CSP bunları
// kırar. CSP ayrı bir adımda önce Report-Only ile test edilerek eklenmeli.
const SECURITY_HEADERS = [
  // Yalnız HTTPS — 2 yıl, alt alan adları dahil, preload listesine uygun.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Clickjacking koruması (CSP frame-ancestors'ın öncülü — eski tarayıcılar için).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // MIME sniffing kapalı.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Çapraz kaynağa yalnız origin sız — referrer gizliliği.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Kullanılmayan güçlü API'leri kapat.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.microlink.io" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
    ];
  },
  async redirects() {
    return [
      // www → apex, kalıcı (308). Tek canonical host; link değeri apex'te toplanır.
      // Not: Orchestra'ya proxy'lenen yollar (/ads, /studio, /portal-static) da apex'e
      // taşınır; bunlar host bazlı değil path bazlı yönlendiğinden sorun olmaz.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.vogolab.com" }],
        destination: "https://vogolab.com/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Public customer portal — proxies to Vogolab Orchestra dashboard.
      // Brog uses [lang] dynamic route (vogolab.com/tr/...), so we must
      // match both /ads and /:lang/ads. Cookies pass through transparently.
      { source: "/ads", destination: `${ORCHESTRA_URL}/ads` },
      { source: "/ads/:path*", destination: `${ORCHESTRA_URL}/ads/:path*` },
      { source: "/:lang/ads", destination: `${ORCHESTRA_URL}/ads` },
      { source: "/:lang/ads/:path*", destination: `${ORCHESTRA_URL}/ads/:path*` },
      // Static portal assets + public API endpoints (same locale handling)
      { source: "/portal-static/:path*", destination: `${ORCHESTRA_URL}/portal-static/:path*` },
      { source: "/:lang/portal-static/:path*", destination: `${ORCHESTRA_URL}/portal-static/:path*` },
      { source: "/api/public/:path*", destination: `${ORCHESTRA_URL}/api/public/:path*` },
      { source: "/:lang/api/public/:path*", destination: `${ORCHESTRA_URL}/api/public/:path*` },

      // Internal operator dashboard (Basic Auth gated). Locale-agnostic.
      { source: "/studio", destination: `${ORCHESTRA_URL}/studio` },
      { source: "/studio/:path*", destination: `${ORCHESTRA_URL}/studio/:path*` },
      { source: "/:lang/studio", destination: `${ORCHESTRA_URL}/studio` },
      { source: "/:lang/studio/:path*", destination: `${ORCHESTRA_URL}/studio/:path*` },
      { source: "/studio-static/:path*", destination: `${ORCHESTRA_URL}/studio-static/:path*` },
      { source: "/:lang/studio-static/:path*", destination: `${ORCHESTRA_URL}/studio-static/:path*` },
    ];
  },
};

export default nextConfig;
