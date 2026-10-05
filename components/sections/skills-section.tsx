import { skillFamilies } from "@/content/skills";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { ContentIcon } from "@/components/ui/content-icon";

/**
 * Contenu de la section « Compétences » : une fiche technique en lignes
 * (une ligne par famille : nom à gauche, technos à droite).
 */
export function SkillsSection() {
  return (
    <Reveal>
      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface/50">
        {skillFamilies.map((family) => (
          <li
            key={family.title}
            className="grid gap-4 px-6 py-6 sm:grid-cols-[13rem_minmax(0,1fr)] sm:items-center sm:gap-8 sm:px-8 lg:grid-cols-[16rem_minmax(0,1fr)]"
          >
            <h3 className="flex items-center gap-3 font-semibold tracking-tight text-fg">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent-light">
                <ContentIcon name={family.icon} className="size-[1.1rem]" />
              </span>
              {family.title}
            </h3>

            {family.soft ? (
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {family.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-fg-secondary">
                    <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {family.items.map((item) => (
                  <li key={item}>
                    <Badge size="md">{item}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
