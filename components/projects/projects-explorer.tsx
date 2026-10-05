"use client";

import { m } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { getProjectBySlug, getProjectsByDomain, projectDomains } from "@/content/projects";
import type { ProjectDomain } from "@/content/types";
import { onOpenProjectSheet } from "@/lib/project-sheet";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./project-card";
import { ProjectModal } from "./project-modal";

/** Projet demandé par l'adresse : /projets/<slug> → fiche ouverte. */
function useProjectFromUrl() {
  const pathname = usePathname();
  const slug = pathname.match(/^\/projets\/([^/]+)\/?$/)?.[1];
  return slug ? getProjectBySlug(decodeURIComponent(slug)) : undefined;
}

/**
 * Section Projets : onglets par domaine, cartes, et fiche détaillée par-dessus la page.
 *
 * L'adresse reflète la fiche ouverte (/projets/<slug>), ce qui permet de partager
 * le lien d'un projet : en l'ouvrant, on arrive sur l'accueil avec la fiche ouverte.
 * L'adresse est modifiée sans recharger la page (history.pushState), et le bouton
 * « Retour » du navigateur referme la fiche.
 */
export function ProjectsExplorer() {
  const openProject = useProjectFromUrl();
  const [activeDomain, setActiveDomain] = useState<ProjectDomain>(projectDomains[0].id);
  // Pas d'animation au premier affichage (contenu visible immédiatement), seulement au changement d'onglet.
  const [hasSwitched, setHasSwitched] = useState(false);
  // true si la fiche a été ouverte depuis cette page (et non en arrivant directement par le lien).
  const openedHere = useRef(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const openFiche = useCallback((slug: string) => {
    openedHere.current = true;
    window.history.pushState(null, "", `/projets/${slug}`);
  }, []);

  // Fiche demandée depuis un autre endroit de la page (parcours, veille…).
  useEffect(() => onOpenProjectSheet(openFiche), [openFiche]);

  const closeFiche = useCallback(() => {
    if (openedHere.current) {
      openedHere.current = false;
      window.history.back();
    } else {
      window.history.replaceState(null, "", "/");
    }
  }, []);

  const selectTab = (index: number) => {
    const domain = projectDomains[index];
    setActiveDomain(domain.id);
    setHasSwitched(true);
    tabRefs.current[index]?.focus();
  };

  // Navigation au clavier dans les onglets (flèches, Début, Fin).
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = projectDomains.length - 1;
    const target =
      event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (target === null) return;
    event.preventDefault();
    selectTab(target);
  };

  const visibleProjects = getProjectsByDomain(activeDomain);

  return (
    <>
      <div
        role="tablist"
        aria-label="Domaines des projets"
        className="flex justify-center gap-2 sm:gap-6"
      >
        {projectDomains.map((domain, index) => {
          const selected = domain.id === activeDomain;
          return (
            <button
              key={domain.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`onglet-${domain.id}`}
              aria-selected={selected}
              aria-controls={`panneau-${domain.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectTab(index)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              className={cn(
                "shrink-0 rounded-t-md border-b-2 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors sm:px-4 sm:text-base",
                // forced-colors : mode « contraste élevé » de Windows, où les couleurs du site sont remplacées.
                selected
                  ? "border-accent text-fg forced-colors:border-[Highlight]"
                  : "border-transparent text-fg-secondary hover:border-line-strong hover:text-fg forced-colors:border-[Canvas]",
              )}
            >
              {domain.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`panneau-${activeDomain}`} aria-labelledby={`onglet-${activeDomain}`} className="mt-10">
        <m.ul
          key={activeDomain}
          initial={hasSwitched ? { opacity: 0, y: 8 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visibleProjects.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} onOpen={openFiche} />
            </li>
          ))}
        </m.ul>
      </div>

      <ProjectModal project={openProject} onClose={closeFiche} />
    </>
  );
}
