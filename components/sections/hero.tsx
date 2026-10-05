import { ArrowRight } from "lucide-react";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { ActiveSection } from "./active-section";
import { CvButton } from "./cv-button";
import { HeroPortrait } from "./hero-portrait";

/**
 * Lumière diffuse (dégradé hero-halo, voir app/globals.css), centrée sur son point
 * d'ancrage, avec une très légère dérive tant que le visiteur est actif.
 */
const haloClass = "hero-halo motion-idle absolute -translate-x-1/2 -translate-y-1/2";

/** Haut de page : le titre et les deux boutons, avec la photo à droite. */
export function Hero() {
  return (
    <ActiveSection
      id="accueil"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16"
    >
      {/*
        Deux lumières centrées sur les bords gauche et droit de l'écran, derrière le contenu.
        Leur hauteur change selon la largeur pour ne jamais tomber sur la bulle (photo)
        (en haut à gauche sur mobile, à droite ailleurs), ni derrière le titre ou le menu
        (contraste du texte vérifié de 375 à 2560 px de large) : plus petites et juste
        sous le menu sur les écrans moyens, grandes et à mi-hauteur sur les très grands
        écrans, où le texte est loin des bords. Sur ces très grands écrans, la lumière de
        gauche est à moitié visible ; celle de droite a son centre bien à l'écran (à 88 %
        de la largeur), mais jamais à moins de 760 px du centre de la page pour rester
        à distance de la bulle.
      */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className={cn(
            haloClass,
            "top-[80%] left-0 size-[28rem] motion-safe:animate-halo-drift sm:size-[34rem] md:top-[max(18%,9.5rem)] md:size-[27rem] 2xl:top-[36%] 2xl:size-[64rem]",
          )}
        />
        <div
          className={cn(
            haloClass,
            "top-[14%] left-full size-[26rem] motion-safe:animate-halo-drift-alt sm:size-[32rem] md:top-[max(18%,9.5rem)] md:left-[104%] md:size-[27rem] 2xl:top-[42%] 2xl:left-[max(88%,calc(50%_+_760px))] 2xl:size-[52rem]",
          )}
        />
      </div>

      <Container className="grid items-center gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-12 lg:gap-16">
        {/* Sur mobile : petit, au-dessus du titre. Sur grand écran : à droite. */}
        <HeroPortrait className="justify-self-start md:order-last md:justify-self-center motion-safe:animate-hero-visual" />

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
    </ActiveSection>
  );
}
