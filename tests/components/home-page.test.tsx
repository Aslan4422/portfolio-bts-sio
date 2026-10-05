// @vitest-environment jsdom
/*
 * Page d'accueil : chaque lien du menu doit mener à une section qui existe vraiment,
 * avec un titre (h2) qui reçoit le focus clavier. Le contenu des sections est remplacé
 * par du vide pour ne tester que la structure de la page.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/seo/person-json-ld", () => ({ PersonJsonLd: () => null }));
vi.mock("@/components/sections/hero", () => ({ Hero: () => null }));
vi.mock("@/components/sections/about-section", () => ({ AboutSection: () => null }));
vi.mock("@/components/projects/projects-explorer", () => ({ ProjectsExplorer: () => null }));
vi.mock("@/components/sections/skills-section", () => ({ SkillsSection: () => null }));
vi.mock("@/components/sections/veille-section", () => ({ VeilleSection: () => null }));
vi.mock("@/components/sections/contact-section", () => ({ ContactSection: () => null }));

import { HomePage } from "@/components/sections/home-page";
import { navigation } from "@/content/site";

describe("Menu et sections de la page d'accueil", () => {
  const page = new DOMParser().parseFromString(renderToStaticMarkup(<HomePage />), "text/html");

  it("présente les sections dans le même ordre que le menu", () => {
    const sectionIds = [...page.querySelectorAll("section[id]")].map((section) => section.id);
    expect(sectionIds).toEqual(navigation.map((item) => item.id));
  });

  it.each(navigation.map((item) => [item.label, item.id] as const))(
    "le lien « %s » mène à la section #%s, avec son titre",
    (label, id) => {
      const section = page.querySelector(`section#${id}`);
      expect(section, `section #${id} introuvable`).not.toBeNull();
      const heading = section?.querySelector(`h2#${id}-titre`);
      expect(heading?.getAttribute("tabindex")).toBe("-1");
      expect(section?.getAttribute("aria-labelledby")).toBe(`${id}-titre`);
      // Le titre de la section reprend le libellé du menu (ex. « Veille » → « Veille technologique »).
      expect(heading?.textContent).toContain(label);
    },
  );
});
