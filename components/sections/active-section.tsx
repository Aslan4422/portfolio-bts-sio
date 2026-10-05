"use client";

import { useEffect, useRef, type ComponentProps } from "react";

/** Délai sans activité du visiteur avant que les animations s'arrêtent. */
const IDLE_DELAY_MS = 4000;
/** Ce qui compte comme « activité » : souris, toucher, clavier, défilement. */
const ACTIVITY_EVENTS = ["pointermove", "pointerdown", "keydown", "wheel", "scroll", "touchstart"] as const;

/**
 * Section dont les animations décoratives (éléments portant la classe « motion-idle »)
 * ne tournent que pendant que le visiteur est actif sur la page : elles s'arrêtent
 * après 4 secondes d'inactivité, ou quand la section n'est plus à l'écran.
 * Ainsi, aucun mouvement ne dure sans fin (règle d'accessibilité WCAG 2.2.2).
 * Fonctionnement : l'attribut data-active est posé sur la section tant que le visiteur
 * est actif (voir la règle .motion-idle dans app/globals.css).
 * Sans JavaScript, ou si l'appareil demande de réduire les animations, rien ne bouge.
 */
export function ActiveSection(props: ComponentProps<"section">) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let idleTimer = 0;
    let onScreen = true;
    const setActive = (active: boolean) => section.toggleAttribute("data-active", active);
    const pause = () => setActive(false);
    const wake = () => {
      window.clearTimeout(idleTimer);
      if (onScreen) setActive(true);
      idleTimer = window.setTimeout(pause, IDLE_DELAY_MS);
    };

    for (const type of ACTIVITY_EVENTS) window.addEventListener(type, wake, { passive: true });
    // Hors de l'écran, inutile d'animer.
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) wake();
      else pause();
    });
    observer.observe(section);
    wake(); // La page vient de s'ouvrir : les animations tournent quelques secondes.

    return () => {
      window.clearTimeout(idleTimer);
      for (const type of ACTIVITY_EVENTS) window.removeEventListener(type, wake);
      observer.disconnect();
    };
  }, []);

  return <section ref={sectionRef} {...props} />;
}
