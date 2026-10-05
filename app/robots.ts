import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-url";

/**
 * Consignes pour les robots des moteurs de recherche (/robots.txt) :
 * tout le site peut être indexé, et voici où trouver le plan du site.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
