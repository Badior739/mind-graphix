// En-têtes de sécurité appliqués à tout le site public.
// La politique de contenu (CSP) est posée dans middleware.js : stricte avec jeton unique pour l'espace de gestion.
const security = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  serverExternalPackages: ["sharp", "@electric-sql/pglite", "postgres", "nodemailer"],
  experimental: { serverActions: { bodySizeLimit: "4mb" } },
  async headers() {
    return [
      { source: "/:path*", headers: security },
    ];
  },
};

export default nextConfig;
