"use client";

import { useEffect, useRef } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/** Délai sans activité du visiteur avant que la bulle s'immobilise. */
const IDLE_DELAY_MS = 4000;
/** Ce qui compte comme « activité » : souris, toucher, clavier, défilement. */
const ACTIVITY_EVENTS = ["pointermove", "pointerdown", "keydown", "wheel", "scroll", "touchstart"] as const;

/*
 * Initiales « EA » dans une forme arrondie et souple qui ondule lentement
 * (animation blob-morph, voir app/globals.css).
 * L'animation ne tourne que pendant que le visiteur est actif sur la page,
 * et s'arrête après 4 secondes d'inactivité (ou quand la bulle n'est plus à l'écran) :
 * aucun mouvement ne dure sans fin (règle d'accessibilité WCAG 2.2.2).
 * Sans JavaScript, ou si l'appareil demande de réduire les animations, elle reste immobile.
 * Purement décoratif : le nom complet figure déjà dans le titre de la page.
 */
export function HeroMonogram({ className }: { className?: string }) {
  const shapeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shape = shapeRef.current;
    if (!shape) return;

    let idleTimer = 0;
    let onScreen = true;
    const pause = () => {
      shape.style.animationPlayState = "paused";
    };
    const wake = () => {
      window.clearTimeout(idleTimer);
      if (onScreen) shape.style.animationPlayState = "running";
      idleTimer = window.setTimeout(pause, IDLE_DELAY_MS);
    };

    for (const type of ACTIVITY_EVENTS) window.addEventListener(type, wake, { passive: true });
    // Hors de l'écran, inutile d'animer.
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) wake();
      else pause();
    });
    observer.observe(shape);
    wake(); // La page vient de s'ouvrir : la bulle ondule quelques secondes.

    return () => {
      window.clearTimeout(idleTimer);
      for (const type of ACTIVITY_EVENTS) window.removeEventListener(type, wake);
      observer.disconnect();
    };
  }, []);

  return (
    <div aria-hidden="true" className={className}>
      <div
        ref={shapeRef}
        className={cn(
          "flex size-22 items-center justify-center border border-line-strong bg-surface",
          "shadow-[inset_0_1px_0_0_rgb(245_241_230/0.06)] md:size-72 lg:size-80",
          // Forme de départ = première étape de l'animation (pas de saut au démarrage).
          "rounded-[58%_42%_33%_67%/58%_33%_67%_42%] motion-safe:animate-blob-morph",
        )}
      >
        <span className="text-3xl font-semibold tracking-tight text-accent-light md:text-7xl lg:text-8xl">
          {site.initials}
        </span>
      </div>
    </div>
  );
}
