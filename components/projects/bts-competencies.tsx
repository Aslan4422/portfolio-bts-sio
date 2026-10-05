import { ChevronDown, GraduationCap } from "lucide-react";
import type { BtsBlockCoverage } from "@/content/bts";

function formatBlocks(coverage: BtsBlockCoverage[]) {
  const ids = coverage.map((group) => group.block.id);
  return `${ids.length > 1 ? "Blocs" : "Bloc"} ${ids.join(", ")}`;
}

/**
 * Bloc « Compétences du référentiel BTS SIO », replié par défaut.
 * Élément <details> natif : fonctionne au clavier et sans JavaScript.
 * Utilisé dans la fiche projet, dont le titre est un h2 : ce bloc est donc un h3.
 * Le titre reste en dehors de la zone dépliable (<summary>) : certains lecteurs
 * d'écran n'annoncent pas un titre placé à l'intérieur.
 */
export function BtsCompetencies({ coverage, idPrefix }: { coverage: BtsBlockCoverage[]; idPrefix: string }) {
  if (coverage.length === 0) return null;
  const count = coverage.reduce((total, group) => total + group.items.length, 0);
  const titleId = `${idPrefix}-competences-bts`;

  return (
    <section
      aria-labelledby={titleId}
      className="rounded-2xl border border-line bg-canvas/40 has-[details[open]]:border-line-strong"
    >
      <div className="flex items-center gap-4 px-5 pt-5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-surface text-accent-light">
          <GraduationCap aria-hidden="true" className="size-5" />
        </span>
        <h3 id={titleId} className="font-semibold tracking-tight text-fg sm:text-lg">
          Compétences du référentiel BTS SIO
        </h3>
      </div>

      <details className="group/bts">
        <summary className="mt-2 flex cursor-pointer list-none items-center justify-between gap-4 rounded-b-2xl px-5 py-3 text-sm text-fg-muted transition-colors group-open/bts:rounded-none hover:bg-canvas/60 [&::-webkit-details-marker]:hidden">
          <span>
            Voir les {count} compétence{count > 1 ? "s" : ""} · {formatBlocks(coverage)}
          </span>
          <ChevronDown
            aria-hidden="true"
            className="size-5 shrink-0 text-accent-light transition-transform duration-200 group-open/bts:rotate-180"
          />
        </summary>

        <div className="space-y-6 border-t border-line p-5">
          {coverage.map(({ block, items }) => (
            <div key={block.id}>
              <h4 className="text-sm font-semibold text-accent-light">{block.title}</h4>
              <ul className="mt-3 space-y-3">
                {items.map((item) => (
                  <li key={item.id} className="rounded-xl border border-line bg-surface/60 p-4">
                    <p className="font-medium text-fg">{item.label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-fg-secondary">{item.evidence}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}
