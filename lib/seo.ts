/*
 * Référencement : informations communes aux aperçus de liens et
 * « données structurées » (fiche Person lue par Google, format JSON-LD).
 */
import { createHash } from "node:crypto";
import { site } from "@/content/site";
import { skillFamilies } from "@/content/skills";
import { timeline } from "@/content/timeline";
import { OG_DESIGN_VERSION, OG_SIZE, ogHomeText } from "@/lib/og";

/**
 * Champs communs des aperçus de liens (Open Graph : LinkedIn, Discord, WhatsApp…).
 * À reprendre sur chaque page qui personnalise son aperçu : Next.js remplace
 * l'objet openGraph entier, il ne le complète pas.
 */
export const openGraphBase = {
  siteName: site.name,
  locale: "fr_FR",
  type: "website",
} as const;

/**
 * Description de l'image d'aperçu d'une page, avec un numéro de version calculé
 * à partir de ce qu'elle affiche : si un texte change, l'adresse de l'image change
 * aussi, et les réseaux sociaux téléchargent la nouvelle image.
 */
export function ogImage(path: string, alt: string, shownContent: unknown) {
  const version = createHash("sha1")
    .update(JSON.stringify([shownContent, OG_DESIGN_VERSION]))
    .digest("hex")
    .slice(0, 10);
  return { url: `${path}?v=${version}`, ...OG_SIZE, type: "image/png", alt };
}

/** Aperçu de la page d'accueil (utilisé par app/layout.tsx et app/page.tsx). */
export const homeOpenGraph = {
  ...openGraphBase,
  url: "/",
  title: site.title,
  description: site.description,
  images: [
    ogImage("/opengraph-image", `${site.name} — ${site.role}`, [
      site.name,
      site.roleLead,
      site.roleAccent,
      site.initials,
      ogHomeText,
    ]),
  ],
};

/**
 * Fiche « Person » au format schema.org : aide Google à relier ce site
 * à son auteur, à ses profils LinkedIn / GitHub et à ses compétences.
 * Ne contient que des informations déjà visibles sur le site.
 */
export function buildPersonJsonLd(siteUrl: string) {
  const school = timeline.find((item) => item.current && item.kind === "formation");
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: siteUrl,
    image: new URL(site.photo.src, siteUrl).toString(),
    jobTitle: "Étudiant en BTS SIO option SISR",
    description: site.description,
    email: `mailto:${site.contact.email}`,
    sameAs: [site.contact.linkedin, site.contact.github],
    address: { "@type": "PostalAddress", addressRegion: site.location, addressCountry: "FR" },
    ...(school?.organization && {
      affiliation: { "@type": "EducationalOrganization", name: school.organization },
    }),
    knowsAbout: skillFamilies.filter((family) => !family.soft).flatMap((family) => family.items),
    knowsLanguage: ["fr", "en"],
  };
}

/**
 * Transforme un objet en texte JSON sûr à placer dans une balise <script>
 * (le caractère « < » est échappé pour qu'aucun texte ne puisse fermer la balise).
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
