import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { veilleMethod, veilleSources, veilleThemes } from "@/content/veille";
import { ProjectSheetLink } from "@/components/projects/project-sheet-link";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { ContentIcon } from "@/components/ui/content-icon";
import { cn } from "@/lib/utils";

function GroupTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-xl font-semibold tracking-tight text-fg">{children}</h3>;
}

/**
 * Contenu de la section « Veille technologique ».
 * Trois formes distinctes : la méthode (citation avec barre dorée),
 * les thèmes (blocs numérotés) et les sources (tuiles-liens horizontales : qui publie
 * et pourquoi je la retiens).
 */
export function VeilleSection() {
  return (
    <div className="space-y-16">
      {/* Méthode : présentée comme une citation, avec une barre dorée. */}
      <Reveal>
        <div className="flex gap-6">
          <span aria-hidden="true" className="w-1 shrink-0 rounded-full bg-accent" />
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-fg">Ma méthode de veille</h3>
            <p className="mt-3 max-w-4xl text-lg leading-relaxed text-fg-secondary">{veilleMethod}</p>
          </div>
        </div>
      </Reveal>

      {/* Thèmes : blocs numérotés, sans bordure, fond en dégradé. */}
      <div>
        <GroupTitle>Thèmes suivis</GroupTitle>
        <ol className="mt-6 grid gap-5 md:grid-cols-3">
          {veilleThemes.map((theme, index) => (
            <li key={theme.title}>
              <Reveal delay={index * 0.06} className="h-full">
                <article className="flex h-full flex-col rounded-2xl bg-linear-to-b from-surface/90 to-surface/20 p-7">
                  <p aria-hidden="true" className="text-4xl font-semibold text-accent-light tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h4 className="mt-4 text-lg leading-snug font-semibold tracking-tight text-fg">{theme.title}</h4>
                  <p className="mt-3 leading-relaxed text-fg-secondary">{theme.description}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {theme.tags.map((tag) => (
                      <li key={tag}>
                        <Badge>{tag}</Badge>
                      </li>
                    ))}
                  </ul>
                  {theme.relatedProject && (
                    <div className="mt-auto pt-6">
                      <ProjectSheetLink
                        slug={theme.relatedProject}
                        className="group inline-flex min-h-6 items-center gap-1.5 rounded-md text-sm font-medium text-accent-light"
                      >
                        Voir le projet lié
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
          ))}
        </ol>
      </div>

      {/* Sources : tuiles-liens horizontales (icône ronde, texte, flèche). */}
      <div>
        <GroupTitle>Mes sources</GroupTitle>
        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {veilleSources.map((source, index) => (
            // Nombre impair de sources : la dernière, seule sur sa ligne, est centrée (même largeur que les autres).
            <li
              key={source.name}
              className="lg:last:odd:col-span-2 lg:last:odd:mx-auto lg:last:odd:w-[calc(50%-0.5rem)]"
            >
              <Reveal delay={(index % 2) * 0.06} className="h-full">
                <article
                  className={cn(
                    "group relative flex h-full gap-4 rounded-2xl border border-line bg-canvas/30 p-5",
                    "transition-colors duration-200 hover:border-line-strong hover:bg-surface/60",
                    "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent-light",
                  )}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-accent-light">
                    <ContentIcon name={source.icon} className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {/* Toute la tuile est cliquable (lien étiré), un seul lien par tuile. */}
                        <h4 className="font-semibold tracking-tight text-fg">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none"
                          >
                            {source.name}
                            <span className="sr-only"> (nouvel onglet)</span>
                          </a>
                        </h4>
                        <p className="mt-0.5 text-sm text-accent-light">{source.publisher}</p>
                      </div>
                      {/* pointer-events-none : la flèche, déplacée au survol, passerait sinon
                          au-dessus du lien étiré et bloquerait le clic. */}
                      <ArrowUpRight
                        aria-hidden="true"
                        className="pointer-events-none size-5 shrink-0 text-fg-muted transition-[color,translate] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-light"
                      />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-fg-secondary">{source.description}</p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
