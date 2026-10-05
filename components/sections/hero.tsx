import { ArrowRight } from "lucide-react";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { CvButton } from "./cv-button";
import { HeroMonogram } from "./hero-monogram";

/** Halo de lumière diffus : un dégradé circulaire qui s'efface vers les bords (aucun filtre de flou). */
const haloClass =
  "absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(36_150_112/0.6),rgb(36_150_112/0.22)_55%,transparent)]";

/** Haut de page : le titre et les deux boutons, avec le monogramme à droite. */
export function Hero() {
  return (
    <section
      id="accueil"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16"
    >
      {/*
        Deux halos de lumière centrés sur les bords gauche et droit de l'écran, derrière le contenu.
        Leur hauteur change selon la largeur pour ne jamais tomber sur la bulle « EA »
        (en haut à gauche sur mobile, à droite ailleurs).
      */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className={cn(haloClass, "top-[80%] left-0 size-[28rem] sm:size-[42rem] md:top-[36%] lg:size-[56rem]")} />
        <div
          className={cn(haloClass, "top-[14%] left-full size-[26rem] sm:size-[38rem] xl:size-[44rem] 2xl:top-[42%]")}
        />
      </div>

      <Container className="grid items-center gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-12 lg:gap-16">
        {/* Sur mobile : petit, au-dessus du titre. Sur grand écran : à droite. */}
        <HeroMonogram className="justify-self-start md:order-last md:justify-self-center motion-safe:animate-hero-visual" />

        <div>
          {/* Le nom n'est pas affiché, mais reste lu par les lecteurs d'écran et les moteurs de recherche. */}
          <h1
            id="hero-title"
            className="text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]"
          >
            <span className="sr-only">{site.name} — </span>
            {site.roleLead} <span className="text-accent-light">{site.roleAccent}</span>
          </h1>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/#projets" size="lg">
              Voir mes projets
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <CvButton />
          </div>
        </div>
      </Container>
    </section>
  );
}
