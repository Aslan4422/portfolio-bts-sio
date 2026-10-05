import { site } from "@/content/site";
import { Reveal } from "@/components/motion/reveal";
import { TimelineSection } from "./timeline-section";

/**
 * Contenu de la section « À propos » : présentation sur toute la largeur,
 * puis le parcours (frise horizontale sur grand écran).
 */
export function AboutSection() {
  return (
    <>
      <Reveal>
        <p className="max-w-4xl text-xl leading-relaxed text-fg-secondary">{site.tagline}</p>
      </Reveal>

      <h3 className="mt-14 text-xl font-semibold tracking-tight text-fg">Parcours</h3>
      <div className="mt-6 lg:mt-8">
        <TimelineSection />
      </div>
    </>
  );
}
