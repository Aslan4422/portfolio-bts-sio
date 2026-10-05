import Image from "next/image";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/*
 * Photo dans une forme arrondie et souple qui ondule lentement
 * (animation blob-morph, voir app/globals.css). Comme les lumières du haut de page,
 * elle ne bouge que pendant que le visiteur est actif (voir active-section.tsx).
 */
export function HeroPortrait({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div
        className={cn(
          "relative size-28 overflow-hidden border border-line-strong bg-surface md:size-72 lg:size-80",
          // Forme de départ = première étape de l'animation (pas de saut au démarrage).
          "rounded-[58%_42%_33%_67%/58%_33%_67%_42%] motion-idle motion-safe:animate-blob-morph",
        )}
      >
        <Image
          src={site.photo.src}
          alt={site.photo.alt}
          fill
          priority
          sizes="(min-width: 1024px) 320px, (min-width: 768px) 288px, 112px"
          className="object-cover"
        />
      </div>
    </div>
  );
}
