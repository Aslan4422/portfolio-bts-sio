import { ProjectsExplorer } from "@/components/projects/projects-explorer";
import { PersonJsonLd } from "@/components/seo/person-json-ld";
import { AboutSection } from "./about-section";
import { ContactSection } from "./contact-section";
import { Hero } from "./hero";
import { Section } from "./section";
import { SkillsSection } from "./skills-section";
import { VeilleSection } from "./veille-section";

/**
 * Contenu de la page d'accueil (une seule page qui défile).
 * Affiché sur « / » et sur « /projets/<slug> » (même page, fiche du projet ouverte).
 */
export function HomePage() {
  return (
    <>
      <PersonJsonLd />
      <Hero />

      <Section id="a-propos" title="À propos">
        <AboutSection />
      </Section>

      <Section id="competences" title="Compétences">
        <SkillsSection />
      </Section>

      <Section id="projets" title="Projets">
        <ProjectsExplorer />
      </Section>

      <Section id="veille" title="Veille technologique">
        <VeilleSection />
      </Section>

      <Section id="contact" title="Contact">
        <ContactSection />
      </Section>
    </>
  );
}
