/*
 * Adresse publique du site (ex. https://erhan-aslan.vercel.app).
 * Elle sert à écrire des liens complets là où une adresse relative ne suffit pas :
 * aperçus de liens partagés, plan du site (sitemap.xml), robots.txt, adresse canonique.
 */

type SiteUrlEnv = {
  /** Adresse choisie à la main (facultatif, voir .env.example). */
  NEXT_PUBLIC_SITE_URL?: string;
  /** Fournie automatiquement par Vercel : domaine de production du projet, sans « https:// ». */
  VERCEL_PROJECT_PRODUCTION_URL?: string;
};

const LOCAL_URL = "http://localhost:3000";

/**
 * Choisit l'adresse du site, par ordre de priorité :
 * 1. NEXT_PUBLIC_SITE_URL si elle est renseignée et valide (ex. nom de domaine personnel) ;
 * 2. le domaine de production donné par Vercel ;
 * 3. l'adresse locale (développement sur l'ordinateur).
 * Fonction « pure » : testée automatiquement (Vitest).
 */
export function resolveSiteUrl(env: SiteUrlEnv): URL {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    try {
      const url = new URL(explicit);
      if (url.protocol === "https:" || url.protocol === "http:") return new URL(url.origin);
    } catch {
      // Adresse mal écrite : on passe à la suivante.
    }
  }

  const vercelDomain = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelDomain) {
    try {
      return new URL(`https://${vercelDomain}`);
    } catch {
      // Valeur inattendue : adresse locale.
    }
  }

  return new URL(LOCAL_URL);
}

/** Adresse du site pour ce déploiement (lue une seule fois, au moment de la génération). */
export const siteUrl = resolveSiteUrl({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
});

/** Adresse complète d'une page du site, ex. absoluteUrl("/projets/labo-stormshield"). */
export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}
