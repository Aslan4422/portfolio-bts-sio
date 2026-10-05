import { ArrowLeft, LayoutGrid } from "lucide-react";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Page introuvable",
  // Pas d'adresse canonique héritée de l'accueil : cette page ne doit pas être indexée.
  alternates: { canonical: null },
  robots: { index: false, follow: true },
};

/** Page 404 : affichée pour toute adresse inexistante (ex. /projets/slug-inexistant). */
export default function NotFound() {
  return (
    <section aria-labelledby="introuvable-titre" className="flex min-h-[75vh] items-center pt-28 pb-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-sm text-accent-light">Erreur 404</p>
          <h1 id="introuvable-titre" className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Page introuvable
          </h1>
          <p className="mt-5 leading-relaxed text-fg-secondary">
            La page que vous cherchez n&apos;existe pas ou a été déplacée. Vous pouvez revenir à
            l&apos;accueil ou parcourir mes projets.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/" size="lg">
              <ArrowLeft aria-hidden="true" />
              Retour à l&apos;accueil
            </ButtonLink>
            <ButtonLink href="/#projets" variant="secondary" size="lg">
              <LayoutGrid aria-hidden="true" />
              Voir les projets
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
