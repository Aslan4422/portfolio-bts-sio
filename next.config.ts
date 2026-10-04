import type { NextConfig } from "next";

/**
 * En-têtes de sécurité HTTP envoyés avec chaque page.
 * (Une politique CSP complète sera ajoutée et testée à l'étape de mise en ligne.)
 */
const securityHeaders = [
  // Empêche le navigateur de « deviner » le type d'un fichier (attaques par confusion de type).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Ne transmet que le nom du site (pas l'URL complète) aux sites externes.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Interdit d'afficher le site dans un cadre d'un autre site (anti-clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Désactive les fonctions sensibles du navigateur dont le site n'a pas besoin.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Ne pas annoncer la technologie du serveur dans les en-têtes HTTP.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
