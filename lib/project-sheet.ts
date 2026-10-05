/*
 * Ouverture de la fiche d'un projet depuis n'importe quel endroit de la page
 * (frise du parcours, veille…). La section Projets écoute cet événement et
 * ouvre la fiche exactement comme un clic sur une carte (adresse partageable,
 * bouton « Retour » du navigateur…).
 */

const OPEN_EVENT = "fiche-projet:ouvrir";

export function openProjectSheet(slug: string) {
  window.dispatchEvent(new CustomEvent<string>(OPEN_EVENT, { detail: slug }));
}

/** Abonnement à l'événement ; renvoie la fonction de désabonnement. */
export function onOpenProjectSheet(handler: (slug: string) => void) {
  const listener = (event: Event) => handler((event as CustomEvent<string>).detail);
  window.addEventListener(OPEN_EVENT, listener);
  return () => window.removeEventListener(OPEN_EVENT, listener);
}
