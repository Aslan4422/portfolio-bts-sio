"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/**
 * - LazyMotion + domAnimation : ne charge que les fonctions d'animation utiles
 *   (fondus, glissements, survol, apparition au scroll), pas le glisser-déposer
 *   ni les animations de mise en page → bundle plus léger.
 *   `strict` : interdit d'utiliser `motion.*` (lourd) à la place de `m.*`.
 * - reducedMotion="user" : respecte le réglage système « réduire les animations ».
 *   Les déplacements sont alors désactivés, seuls les fondus sont conservés.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
