import type { Metadata } from "next";
import { HomePage } from "@/components/sections/home-page";
import { homeOpenGraph } from "@/lib/seo";

// Aperçu de la page d'accueil, avec l'adresse versionnée de son image (voir lib/seo.ts).
export const metadata: Metadata = { openGraph: homeOpenGraph };

export default function Page() {
  return <HomePage />;
}
