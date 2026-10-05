"use client";

import { CheckCircle2, ShieldCheck, X } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { groupEvidenceByBlock } from "@/content/bts";
import { site } from "@/content/site";
import type { Project } from "@/content/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BtsCompetencies } from "./bts-competencies";
import { ProjectCover } from "./project-cover";

/** true si la fiche est une vraie fenêtre modale (navigateurs très anciens : on se fie à « open »). */
function isModal(dialog: HTMLDialogElement) {
  try {
    return dialog.matches(":modal");
  } catch {
    return dialog.open;
  }
}

type ProjectModalProps = {
  /** Projet à afficher, ou undefined pour fermer la fiche. */
  project: Project | undefined;
  onClose: () => void;
};

/**
 * Fiche détaillée d'un projet, affichée par-dessus la page d'accueil
 * (élément <dialog> natif : le focus clavier reste dans la fiche tant qu'elle est ouverte).
 * Fond flouté derrière, fermeture par la croix, Échap ou un clic sur le fond.
 */
export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Garde le dernier projet affiché pendant la fermeture (évite un cadre vide).
  const [shown, setShown] = useState(project);
  if (project && project !== shown) setShown(project);
  /*
   * Arrivée directe par un lien partagé (/projets/<slug>) : la fiche est déjà ouverte
   * dans la page générée à l'avance, donc visible avant le chargement du JavaScript
   * (voir .project-dialog dans app/globals.css). Valeur figée au premier affichage.
   */
  const [openOnLoad] = useState(() => project !== undefined);

  // Ouvre ou ferme la fenêtre selon le projet demandé.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (project) {
      // Fiche fermée, ou ouverte sans être encore une vraie fenêtre « modale » : on la convertit.
      if (!isModal(dialog)) {
        if (dialog.open) dialog.close();
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [project]);

  // Nouveau projet ouvert : la fiche démarre en haut.
  useEffect(() => {
    dialogRef.current?.scrollTo({ top: 0 });
  }, [project?.slug]);

  // Titre de l'onglet du navigateur.
  useEffect(() => {
    document.title = project ? `${project.title} · ${site.name}` : site.title;
  }, [project]);

  // Clic sur le fond flouté (en dehors de la fiche) : fermeture.
  const onDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog || event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    const inside =
      event.clientX >= box.left &&
      event.clientX <= box.right &&
      event.clientY >= box.top &&
      event.clientY <= box.bottom;
    if (!inside) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      open={openOnLoad || undefined}
      aria-labelledby={shown ? "fiche-titre" : undefined}
      onCancel={(event) => {
        // Touche Échap : on passe par onClose pour remettre l'adresse à jour.
        event.preventDefault();
        onClose();
      }}
      onClick={onDialogClick}
      className={cn(
        "project-dialog m-auto max-h-[calc(100dvh-2rem)] w-[min(56rem,calc(100%-2rem))] overflow-y-auto overscroll-contain",
        "rounded-2xl border border-line-strong bg-surface p-0 text-fg shadow-2xl shadow-black/40",
        "backdrop:bg-[rgb(3_46_35/0.55)] backdrop:backdrop-blur-md",
      )}
    >
      {shown && <ProjectDetails project={shown} onClose={onClose} />}
    </dialog>
  );
}

/* ------------------------------------------------------------------ */

function DetailTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h3 id={id} className="flex items-center gap-3 text-lg font-semibold tracking-tight text-fg sm:text-xl">
      <span aria-hidden="true" className="h-5 w-1 shrink-0 rounded-full bg-accent" />
      {children}
    </h3>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-relaxed text-fg-secondary">
          <span aria-hidden="true" className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ProjectDetails({ project, onClose }: { project: Project; onClose: () => void }) {
  const coverage = groupEvidenceByBlock(project.bts);
  const id = (suffix: string) => `fiche-${project.slug}-${suffix}`;

  return (
    <article>
      {/* Croix de fermeture : reste visible en haut de la fiche pendant le défilement. */}
      <div className="sticky top-0 z-20 flex h-0 justify-end">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la fiche"
          className="m-3 inline-flex size-10 items-center justify-center rounded-lg border border-line-strong bg-canvas/80 text-fg backdrop-blur-sm transition-colors hover:border-accent-light"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>

      <ProjectCover src={project.cover.src} sizes="(min-width: 896px) 896px, 100vw" className="h-44 sm:h-60" priority />

      <div className="px-6 pt-6 pb-8 sm:px-10 sm:pt-8 sm:pb-10">
        <p className="text-sm text-fg-muted">{project.setting}</p>
        <h2 id="fiche-titre" className="mt-2 text-2xl leading-tight font-semibold tracking-tight text-balance sm:text-3xl">
          {project.title}
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-fg-secondary">{project.pitch}</p>

        <dl className="mt-7 grid gap-x-6 gap-y-4 rounded-xl border border-line bg-canvas/40 p-5 text-sm sm:grid-cols-2">
          {project.facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-fg-muted">{fact.label}</dt>
              <dd className="mt-0.5 text-fg">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-fg">Outils utilisés</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.tech.map((item) => (
              <li key={item}>
                <Badge>{item}</Badge>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 space-y-10">
          {project.notice && (
            <p
              role="note"
              className="flex gap-3 rounded-xl border border-accent/30 bg-accent/5 p-4 text-sm leading-relaxed text-fg-secondary"
            >
              <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent-light" />
              {project.notice}
            </p>
          )}

          <section aria-labelledby={id("contexte")}>
            <DetailTitle id={id("contexte")}>Contexte</DetailTitle>
            <p className="mt-4 leading-relaxed text-fg-secondary">{project.context}</p>
          </section>

          {project.sections.map((section, index) => (
            <section
              key={section.title}
              aria-labelledby={id(`partie-${index}`)}
              className={cn(section.highlight && "rounded-2xl border border-line-strong bg-canvas/40 p-5 sm:p-6")}
            >
              <DetailTitle id={id(`partie-${index}`)}>{section.title}</DetailTitle>
              {section.intro && <p className="mt-4 leading-relaxed text-fg">{section.intro}</p>}
              <BulletList items={section.items} />
            </section>
          ))}

          {project.results.length > 0 && (
            <section aria-labelledby={id("resultats")}>
              <DetailTitle id={id("resultats")}>Résultats</DetailTitle>
              <ul className="mt-4 space-y-3">
                {project.results.map((result) => (
                  <li key={result} className="flex gap-3 leading-relaxed text-fg-secondary">
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent-light" />
                    <span>{result}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <BtsCompetencies coverage={coverage} idPrefix={id("bts")} />
        </div>

        <p className="mt-8 text-xs text-fg-muted">
          Photo d&apos;illustration :{" "}
          <CreditLink href={project.cover.url}>
            {project.cover.author} / {project.cover.source}
          </CreditLink>
          {project.cover.license && (
            <>
              {" · licence "}
              <CreditLink href={project.cover.license.url}>{project.cover.license.name}</CreditLink>
            </>
          )}
        </p>
      </div>
    </article>
  );
}

function CreditLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-line-strong underline-offset-2 transition-colors hover:text-accent-light"
    >
      {children}
      <span className="sr-only"> (nouvel onglet)</span>
    </a>
  );
}
