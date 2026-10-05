import type { NextConfig } from "next";
import { projects } from "./content/projects";

const isDev = process.env.NODE_ENV !== "production";
/** Déploiement de prévisualisation Vercel (barre d'outils Vercel à autoriser). */
const isVercelPreview = process.env.VERCEL_ENV === "preview";

/**
 * Politique de sécurité du contenu (CSP) : liste blanche de ce que le navigateur
 * a le droit de charger ou d'exécuter sur ce site. Tout le reste est bloqué.
 * - Scripts, styles, images et polices : uniquement depuis le site lui-même.
 *   ('unsafe-inline' reste nécessaire : Next.js insère de petits scripts dans les pages
 *   générées à l'avance, et les animations écrivent des styles directement sur les éléments.)
 * - Le formulaire de contact ne peut envoyer ses données qu'à Formspree.
 * - Le site ne peut pas être affiché dans un cadre d'un autre site (anti-clickjacking).
 * En développement, le rechargement à chaud de Next.js a besoin de 'unsafe-eval' et des WebSockets.
 */
const vercelLive = isVercelPreview ? " https://vercel.live" : "";
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${vercelLive}`,
  `style-src 'self' 'unsafe-inline'${vercelLive}`,
  `img-src 'self' data: blob:${isVercelPreview ? " https://vercel.live https://vercel.com" : ""}`,
  `font-src 'self'${isVercelPreview ? " https://vercel.live https://assets.vercel.com" : ""}`,
  `connect-src 'self' https://formspree.io${isDev ? " ws: wss:" : ""}${isVercelPreview ? " https://vercel.live wss://ws-us3.pusher.com" : ""}`,
  `frame-src ${isVercelPreview ? "https://vercel.live" : "'none'"}`,
  "form-action 'self' https://formspree.io",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

/** En-têtes de sécurité HTTP envoyés avec chaque page. */
const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // Le navigateur n'utilisera plus que HTTPS pour ce site pendant 2 ans.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  // Isole la fenêtre du site des fenêtres ouvertes par d'autres sites.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Empêche le navigateur de « deviner » le type d'un fichier (attaques par confusion de type).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Ne transmet que le nom du site (pas l'URL complète) aux sites externes.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Interdit d'afficher le site dans un cadre d'un autre site (anti-clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Désactive les fonctions sensibles du navigateur dont le site n'a pas besoin.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/**
 * Photos d'illustration venant d'Unsplash : seules celles réellement utilisées par
 * les projets sont autorisées (liste construite à partir de content/projects/).
 * Personne ne peut donc se servir du site pour redimensionner n'importe quelle photo.
 */
const unsplashCovers = projects
  .map((project) => new URL(project.cover.src, "http://local"))
  .filter((url) => url.hostname === "images.unsplash.com")
  .map((url) => ({ protocol: "https" as const, hostname: "images.unsplash.com", pathname: url.pathname }));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Ne pas annoncer la technologie du serveur dans les en-têtes HTTP.
  poweredByHeader: false,
  images: {
    // Les photos sont redimensionnées et servies par le site lui-même :
    // le navigateur du visiteur ne contacte jamais Unsplash.
    remotePatterns: unsplashCovers,
    // Photos rangées dans le site (ex. public/images/projets/pare-feu-fortigate.jpg).
    localPatterns: [{ pathname: "/images/projets/**", search: "" }],
    formats: ["image/avif", "image/webp"],
    // Une seule qualité (celle de next/image par défaut) : pas de variantes inutiles.
    qualities: [75],
    // Images optimisées gardées 31 jours en cache. Pour changer une photo, lui donner un nouveau nom.
    minimumCacheTTL: 2_678_400,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
