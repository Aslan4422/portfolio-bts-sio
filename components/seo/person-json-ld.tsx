import { buildPersonJsonLd, serializeJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site-url";

/**
 * Données structurées invisibles (fiche Person) pour les moteurs de recherche.
 * Une balise <script type="application/ld+json"> est une donnée : elle n'est jamais exécutée.
 */
export function PersonJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildPersonJsonLd(siteUrl.toString())) }}
    />
  );
}
