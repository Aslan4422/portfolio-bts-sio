"use client";

import type { MouseEvent, ReactNode } from "react";
import { openProjectSheet } from "@/lib/project-sheet";

type ProjectSheetLinkProps = {
  slug: string;
  children: ReactNode;
  className?: string;
};

/**
 * Lien qui ouvre la fiche d'un projet par-dessus la page.
 * Ctrl+clic ou clic du milieu : ouvre /projets/<slug> dans un nouvel onglet.
 */
export function ProjectSheetLink({ slug, children, className }: ProjectSheetLinkProps) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const modified = event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (modified) return;
    event.preventDefault();
    openProjectSheet(slug);
  };

  return (
    <a href={`/projets/${slug}`} onClick={onClick} aria-haspopup="dialog" className={className}>
      {children}
    </a>
  );
}
