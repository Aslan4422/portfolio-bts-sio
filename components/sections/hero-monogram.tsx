import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/*
 * Initiales « EA » dans une forme arrondie et souple qui ondule lentement
 * (animation blob-morph, voir app/globals.css). Comme les lumières du haut de page,
 * elle ne bouge que pendant que le visiteur est actif (voir active-section.tsx).
 * Purement décoratif : le nom complet figure déjà dans le titre de la page.
 */
export function HeroMonogram({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      <div
        className={cn(
          "flex size-22 items-center justify-center border border-line-strong bg-surface",
          "shadow-[inset_0_1px_0_0_rgb(245_241_230/0.06)] md:size-72 lg:size-80",
          // Forme de départ = première étape de l'animation (pas de saut au démarrage).
          "rounded-[58%_42%_33%_67%/58%_33%_67%_42%] motion-idle motion-safe:animate-blob-morph",
        )}
      >
        <span className="text-3xl font-semibold tracking-tight text-accent-light md:text-7xl lg:text-8xl">
          {site.initials}
        </span>
      </div>
    </div>
  );
}
