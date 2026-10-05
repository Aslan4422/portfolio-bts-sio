import { ArrowRight } from "lucide-react";
import type { MouseEvent } from "react";
import type { Project } from "@/content/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProjectCover } from "./project-cover";

/** Nombre de technos affichées sur une carte (les suivantes sont résumées par « +N »). */
const CARD_TECH_COUNT = 4;

function TechList({ tech }: { tech: string[] }) {
  const shown = tech.slice(0, CARD_TECH_COUNT);
  const hidden = tech.length - shown.length;
  return (
    <ul aria-label="Technologies principales" className="flex flex-wrap gap-2">
      {shown.map((item) => (
        <li key={item}>
          <Badge>{item}</Badge>
        </li>
      ))}
      {hidden > 0 && (
        <li>
          <Badge>
            +{hidden}
            <span className="sr-only"> autres technologies</span>
          </Badge>
        </li>
      )}
    </ul>
  );
}

type ProjectCardProps = {
  project: Project;
  /** Ouvre la fiche du projet par-dessus la page. */
  onOpen: (slug: string) => void;
};

/**
 * Carte projet : photo d'en-tête, titre, accroche, technos.
 * Toute la carte est cliquable grâce au lien du titre, étiré par-dessus la carte.
 * Le lien pointe vers /projets/<slug> : un Ctrl+clic ou un clic du milieu ouvre
 * la fiche dans un nouvel onglet ; un clic normal l'ouvre sur place.
 */
export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const modified = event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (modified) return;
    event.preventDefault();
    onOpen(project.slug);
  };

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface/80",
        "transition-[border-color,background-color,translate] duration-200",
        "hover:border-line-strong hover:bg-surface motion-safe:hover:-translate-y-0.5",
        "has-[a:focus-visible]:border-line-strong has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent-light",
      )}
    >
      <ProjectCover
        src={project.cover.src}
        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
        className="aspect-[16/9]"
      />

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg leading-snug font-semibold tracking-tight text-fg">
          <a
            href={`/projets/${project.slug}`}
            onClick={onClick}
            aria-haspopup="dialog"
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {project.title}
          </a>
        </h3>
        <p className="mt-3 leading-relaxed text-fg-secondary">{project.pitch}</p>

        <div className="mt-5">
          <TechList tech={project.tech} />
        </div>

        {/* pointer-events-none : la flèche, déplacée au survol, passerait sinon
            au-dessus du lien étiré et bloquerait le clic. */}
        <div aria-hidden="true" className="pointer-events-none mt-auto pt-6">
          <div className="flex items-center gap-1.5 border-t border-line pt-4 text-sm font-medium text-accent-light">
            Voir le détail
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </article>
  );
}
