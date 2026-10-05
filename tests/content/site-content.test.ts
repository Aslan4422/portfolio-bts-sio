/*
 * Autres contenus du site (identité, parcours, compétences, veille) et règles du cahier
 * des charges : site public, donc AUCUNE donnée sensible (adresse IP, téléphone,
 * identifiant, mot de passe, nom de machine interne) dans les textes publiés.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { projects } from "@/content/projects";
import { navigation, site } from "@/content/site";
import { skillFamilies } from "@/content/skills";
import { timeline } from "@/content/timeline";
import { veilleMethod, veilleSources, veilleThemes } from "@/content/veille";
import { isValidEmail } from "@/lib/contact";
import { cvHref, isCvAvailable } from "@/lib/cv";

const slugs = new Set(projects.map((project) => project.slug));

/** Tous les textes publiés sur le site, rassemblés pour être inspectés d'un coup. */
function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => collectStrings(item, out));
  return out;
}
const publishedText = collectStrings([site, navigation, projects, timeline, skillFamilies, veilleMethod, veilleThemes, veilleSources]);

describe("Aucune donnée sensible dans les textes publiés", () => {
  it.each([
    ["adresse IP", /\b\d{1,3}(?:\.\d{1,3}){3}\b/],
    ["numéro de téléphone", /(?:\+33\s?|\b0)[1-9](?:[\s.-]?\d{2}){4}\b/],
    ["identifiant ou mot de passe", /\b(?:password|passwd|pwd|mot de passe|mdp|login|identifiant)\s*[:=]/i],
    ["nom de domaine interne de laboratoire", /\b[\w-]+\.(?:local|lan|lab|intra|internal|corp|ad)\b/i],
  ])("aucun(e) %s", (_label, pattern) => {
    const found = publishedText.filter((text) => pattern.test(text));
    expect(found).toEqual([]);
  });

  it("aucune autre adresse e-mail que l'adresse de contact", () => {
    const emails = publishedText.flatMap((text) => text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) ?? []);
    expect(new Set(emails)).toEqual(new Set([site.contact.email]));
  });

  it("une localisation sans adresse précise (ni numéro, ni code postal)", () => {
    expect(site.location).not.toMatch(/\d/);
  });
});

describe("Identité et contact", () => {
  it("a une adresse e-mail de contact valide", () => {
    expect(isValidEmail(site.contact.email)).toBe(true);
  });

  it("a des liens LinkedIn, GitHub et code source sécurisés (https)", () => {
    expect(site.contact.linkedin).toMatch(/^https:\/\/(www\.)?linkedin\.com\//);
    expect(site.contact.github).toMatch(/^https:\/\/github\.com\//);
    expect(site.repository).toMatch(/^https:\/\/github\.com\//);
  });

  it("a une description de 160 caractères maximum (résultats Google)", () => {
    expect(site.description.length).toBeLessThanOrEqual(160);
  });

  it("propose un CV qui est un vrai fichier PDF, détecté par le bouton « Télécharger mon CV »", () => {
    const file = path.join(process.cwd(), "public", site.cvFile);
    expect(fs.existsSync(file)).toBe(true);
    expect(fs.readFileSync(file).subarray(0, 5).toString()).toBe("%PDF-");
    expect(isCvAvailable()).toBe(true);
    expect(cvHref).toBe(`/${site.cvFile}`);
  });
});

describe("Menu", () => {
  it("n'a aucune section en double (les liens vers les sections sont testés dans home-page.test.tsx)", () => {
    const ids = navigation.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Parcours", () => {
  it("a exactement une étape « en cours »", () => {
    expect(timeline.filter((item) => item.current)).toHaveLength(1);
  });

  it("ne relie que des projets qui existent", () => {
    for (const item of timeline) if (item.project) expect(slugs).toContain(item.project);
  });

  it("a une période et un titre pour chaque étape", () => {
    for (const item of timeline) expect(item.period.trim() && item.title.trim()).toBeTruthy();
  });
});

describe("Compétences", () => {
  it("a des familles non vides, sans compétence en double", () => {
    for (const family of skillFamilies) {
      expect(family.items.length).toBeGreaterThan(0);
      expect(new Set(family.items).size).toBe(family.items.length);
    }
  });
});

describe("Veille technologique", () => {
  it("ne relie que des projets qui existent", () => {
    for (const theme of veilleThemes) if (theme.relatedProject) expect(slugs).toContain(theme.relatedProject);
  });

  it("cite des sources distinctes, avec des liens sécurisés (https)", () => {
    expect(new Set(veilleSources.map((source) => source.name)).size).toBe(veilleSources.length);
    for (const source of veilleSources) expect(source.url).toMatch(/^https:\/\//);
  });
});
