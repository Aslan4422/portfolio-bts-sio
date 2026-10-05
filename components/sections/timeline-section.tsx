import { ArrowRight } from "lucide-react";
import { timeline } from "@/content/timeline";
import type { TimelineItem } from "@/content/types";
import { ProjectSheetLink } from "@/components/projects/project-sheet-link";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const kindLabels: Record<TimelineItem["kind"], string> = {
  formation: "Formation",
  stage: "Stage",
  certification: "Certification",
};

/**
 * Parcours (dans la section « À propos »), un point par étape.
 * - Mobile et tablette : frise verticale, trait à gauche.
 * - Grand écran : frise horizontale, dates au-dessus du trait, une carte par colonne.
 */
export function TimelineSection() {
  return (
    // role="list" : sans puces visibles, Safari n'annonce plus la liste aux lecteurs d'écran.
    <ol
      role="list"
      className="space-y-6 border-l border-line-strong pl-7 sm:pl-9 lg:grid lg:grid-cols-5 lg:gap-4 lg:space-y-0 lg:border-l-0 lg:pl-0"
    >
      {timeline.map((item, index) => {
        const last = index === timeline.length - 1;
        return (
          <li key={`${item.period}-${item.title}`} className="relative lg:flex lg:flex-col">
            {/* Grand écran : date au-dessus du trait (et masquée dans la carte). */}
            <p className="hidden text-sm font-semibold text-accent-light lg:block">
              {item.period}
            </p>

            {/* Point sur le trait (doré pour l'étape en cours) et, sur grand écran, segment de trait vers l'étape suivante. */}
            <div
              aria-hidden="true"
              className="absolute top-6 -left-7 sm:-left-9 lg:relative lg:top-0 lg:left-0 lg:mt-3 lg:mb-5 lg:flex lg:h-3 lg:items-center"
            >
              <span
                className={cn(
                  "absolute top-1/2 left-0 hidden h-px -translate-y-1/2 lg:block",
                  last ? "right-0 bg-linear-to-r from-line-strong to-transparent" : "-right-4 bg-line-strong",
                )}
              />
              <span
                className={cn(
                  "relative block size-3 -translate-x-1/2 rounded-full ring-4 ring-canvas lg:translate-x-0",
                  item.current ? "bg-accent" : "bg-line-strong",
                )}
              />
            </div>

            <Reveal delay={index * 0.06} className="lg:flex-1">
              <article className="flex h-full flex-col rounded-2xl border border-line bg-surface/70 p-5 sm:p-6 lg:p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="mr-1 text-sm font-semibold text-accent-light lg:hidden">{item.period}</p>
                  <Badge>{kindLabels[item.kind]}</Badge>
                  {item.current && <Badge variant="accent">En cours</Badge>}
                </div>
                <h4 className="mt-3 text-lg leading-snug font-semibold tracking-tight text-fg lg:text-base">
                  {item.title}
                </h4>
                {(item.organization || item.place) && (
                  <p className="mt-1 text-fg-secondary lg:text-sm">
                    {[item.organization, item.place].filter(Boolean).join(" · ")}
                  </p>
                )}
                {item.description && <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.description}</p>}
                {item.project && (
                  <div className="mt-auto pt-4">
                    <ProjectSheetLink
                      slug={item.project}
                      className="group inline-flex min-h-6 items-center gap-1.5 rounded-md text-sm font-medium text-accent-light"
                    >
                      Voir le projet
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </ProjectSheetLink>
                  </div>
                )}
              </article>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
