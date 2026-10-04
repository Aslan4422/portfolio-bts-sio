"use client";

import { m } from "framer-motion";
import { useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Délai en secondes, pour décaler l'apparition d'éléments voisins. */
  delay?: number;
  className?: string;
};

const visible = { opacity: 1, y: 0 };

/**
 * Fondu + léger glissement vers le haut quand l'élément entre à l'écran.
 * Joué une seule fois. Si l'utilisateur a activé « réduire les animations »
 * dans son système, le glissement est supprimé (voir MotionProvider).
 *
 * Garde-fous :
 * - un élément qui reçoit le focus clavier apparaît immédiatement ;
 * - sans JavaScript ou à l'impression, le contenu reste visible
 *   (règle [data-reveal] dans app/globals.css).
 *
 * À ne pas utiliser sur le titre principal du hero : il doit être visible
 * dès le premier affichage (performance perçue / LCP).
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const [focused, setFocused] = useState(false);

  return (
    <m.div
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={visible}
      animate={focused ? visible : undefined}
      onFocusCapture={() => setFocused(true)}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </m.div>
  );
}
