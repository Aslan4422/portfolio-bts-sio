"use client";

import type { MouseEvent } from "react";

export const MAIN_CONTENT_ID = "contenu";

/**
 * Lien d'évitement « Aller au contenu », visible seulement au clavier (touche Tab).
 * Il place le focus sur le contenu principal sans ajouter d'entrée dans
 * l'historique du navigateur (le bouton « Retour » reste fiable).
 */
export function SkipLink() {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const main = document.getElementById(MAIN_CONTENT_ID);
    if (!main) return;
    event.preventDefault();
    // Rendu « focusable » le temps de ce saut seulement : sinon, un simple clic de souris
    // dans le texte placerait le focus sur <main>, et la touche Tab repartirait du haut de la page.
    main.setAttribute("tabindex", "-1");
    main.addEventListener("blur", () => main.removeAttribute("tabindex"), { once: true });
    main.focus();
  };

  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      onClick={onClick}
      className="sr-only z-[60] rounded-lg bg-accent px-4 py-2 font-medium text-on-accent focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:px-4 focus:py-2"
    >
      Aller au contenu
    </a>
  );
}
