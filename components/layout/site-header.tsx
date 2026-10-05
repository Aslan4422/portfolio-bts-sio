"use client";

import { AnimatePresence, m } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { navigation, site, type SectionId } from "@/content/site";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const MOBILE_MENU_ID = "menu-mobile";
/** Hauteur du menu fixe (h-16), qui masque le haut de l'écran. */
const HEADER_HEIGHT = 64;

/**
 * Section en cours de lecture (page d'accueil uniquement) : celle qui occupe
 * la plus grande partie de l'écran. Tant que le haut de page domine, aucune ;
 * tout en bas de la page, la dernière section (Contact).
 */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom && window.scrollY > 0) {
        setActive(navigation[navigation.length - 1].id);
        return;
      }

      const candidates: { id: SectionId | null; el: HTMLElement | null }[] = [
        { id: null, el: document.getElementById("accueil") },
        ...navigation.map((item) => ({ id: item.id, el: document.getElementById(item.id) })),
      ];
      let best: SectionId | null = null;
      let bestVisible = 0;
      for (const { id, el } of candidates) {
        if (!el) continue;
        const box = el.getBoundingClientRect();
        const visible = Math.min(box.bottom, window.innerHeight) - Math.max(box.top, HEADER_HEIGHT);
        if (visible > bestVisible) {
          bestVisible = visible;
          best = id;
        }
      }
      setActive(best);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled]);

  return active;
}

export function SiteHeader() {
  const pathname = usePathname();
  // « /projets/<slug> » affiche aussi la page d'accueil (avec la fiche du projet ouverte).
  const isHome = pathname === "/" || pathname.startsWith("/projets/");
  const active = useActiveSection(isHome);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Effet « verre dépoli » dès que du contenu passe sous le menu.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /*
   * Liens internes (« /#projets »…) : après le défilement, le focus clavier passe
   * au titre de la section visée (comme une ancre classique).
   * Écoute globale pour couvrir aussi les boutons du haut de page et de la page 404.
   * defaultPrevented = le lien a été pris en charge par Next.js
   * (un Ctrl+clic pour ouvrir un nouvel onglet n'est donc pas concerné).
   */
  const pendingSection = useRef<string | null>(null);
  useEffect(() => {
    const onClick = (event: globalThis.MouseEvent) => {
      if (!event.defaultPrevented) return;
      const href = (event.target as Element | null)?.closest("a")?.getAttribute("href");
      if (!href?.startsWith("/#")) return;
      const id = href.slice(2);
      const heading = document.getElementById(`${id}-titre`);
      // Section sur la page actuelle : focus tout de suite. Sinon (page 404) : après le changement de page.
      if (heading) setTimeout(() => heading.focus({ preventScroll: true }), 0);
      else pendingSection.current = id;
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const id = pendingSection.current;
    if (!id || !isHome) return;
    pendingSection.current = null;
    const timer = setTimeout(() => document.getElementById(`${id}-titre`)?.focus({ preventScroll: true }), 0);
    return () => clearTimeout(timer);
  }, [pathname, isHome]);

  // Menu mobile : fermeture avec Échap, et si l'écran repasse en format large.
  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // Le focus ne revient sur le bouton que s'il était dans le menu.
      const focusInside = headerRef.current?.contains(document.activeElement);
      setOpen(false);
      if (focusInside) toggleRef.current?.focus();
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onResize = () => desktop.matches && setOpen(false);

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  // Sur l'accueil, le logo remonte en haut de page sans ajouter de # à l'adresse.
  const onLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    // Ctrl/Cmd/Maj + clic (nouvel onglet, nouvelle fenêtre) : comportement normal du navigateur.
    const modified = event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (!isHome || modified) return;
    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    history.replaceState(null, "", "/");
  };

  return (
    <header
      ref={headerRef}
      // Menu mobile ouvert : il se ferme si le focus clavier part ailleurs dans la page.
      onBlur={(event) => {
        const next = event.relatedTarget as Node | null;
        if (open && next && !headerRef.current?.contains(next)) setOpen(false);
      }}
      /*
       * Transparent tout en haut de la page ; dès que du contenu passe dessous,
       * voile léger (55 %) et flou prononcé. Une ombre douce derrière les textes
       * du menu les garde lisibles au-dessus des photos claires.
       */
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-300",
        "[&_a]:[text-shadow:0_1px_10px_rgb(3_46_35/0.9)]",
        open ? "bg-canvas/95 backdrop-blur-md" : scrolled ? "bg-canvas/55 backdrop-blur-2xl" : "bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          onClick={onLogoClick}
          aria-label={`${site.name}, retour à l'accueil`}
          className="shrink-0 rounded-md text-lg font-semibold tracking-tight whitespace-nowrap text-fg transition-colors hover:text-accent-light"
        >
          {site.name}
        </Link>

        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="-mr-3 flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <Link
                    href={`/#${item.id}`}
                    aria-current={isActive ? "true" : undefined}
                    // Section en cours : or + soulignement (repérable même sans percevoir les couleurs).
                    className={cn(
                      "rounded-md px-3 py-2 text-sm transition-colors duration-200",
                      isActive
                        ? "text-accent-light underline decoration-2 underline-offset-8"
                        : "text-fg-secondary hover:text-fg",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={MOBILE_MENU_ID}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className="inline-flex size-10 items-center justify-center rounded-lg border border-line text-fg transition-colors hover:border-line-strong hover:bg-surface md:hidden"
        >
          {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <m.nav
            id={MOBILE_MENU_ID}
            aria-label="Navigation principale"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-line md:hidden"
          >
            <Container className="py-4">
              <ul className="flex flex-col">
                {navigation.map((item, index) => (
                  <li key={item.id}>
                    <Link
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={`/#${item.id}`}
                      onClick={() => setOpen(false)}
                      aria-current={active === item.id ? "true" : undefined}
                      className={cn(
                        "block rounded-lg px-3 py-3 text-base transition-colors",
                        active === item.id
                          ? "text-accent-light underline decoration-2 underline-offset-8"
                          : "text-fg-secondary hover:bg-surface hover:text-fg",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
