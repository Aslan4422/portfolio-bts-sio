/*
 * Pages du site : liens de projets (/projets/<slug>), page 404, plan du site,
 * robots.txt et pages exclues de Google.
 */
import { describe, expect, it } from "vitest";
import ProjectPage, { dynamicParams, generateMetadata, generateStaticParams } from "@/app/projets/[slug]/page";
import { metadata as legalMetadata } from "@/app/mentions-legales/page";
import { metadata as notFoundMetadata } from "@/app/not-found";
import { metadata as homeMetadata } from "@/app/page";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import type { Project } from "@/content/types";
import { absoluteUrl } from "@/lib/site-url";

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

/** Exécute la page et renvoie le code d'erreur Next.js levé (ex. « …;404 »), ou null. */
async function errorDigest(run: () => unknown) {
  try {
    await run();
    return null;
  } catch (error) {
    return (error as { digest?: string }).digest ?? String(error);
  }
}

describe("Pages des projets (/projets/<slug>)", () => {
  it("une page est générée à l'avance pour chaque projet, et pour eux seuls", () => {
    expect(generateStaticParams()).toEqual(projects.map((project) => ({ slug: project.slug })));
    // Toute autre adresse n'est pas générée à la demande : elle renvoie la page 404.
    expect(dynamicParams).toBe(false);
  });

  it("un projet inconnu affiche la page 404", async () => {
    for (const slug of ["inexistant", "LABO-STORMSHIELD", "../etc", ""]) {
      expect(await errorDigest(() => ProjectPage(params(slug)))).toMatch(/404/);
    }
  });

  it("un projet connu s'affiche sans erreur", async () => {
    expect(await errorDigest(() => ProjectPage(params(projects[0].slug)))).toBeNull();
  });

  it("un projet inconnu n'a pas de titre ni de description", async () => {
    await expect(generateMetadata(params("inexistant"))).resolves.toEqual({});
  });

  describe.each(projects.map((project) => [project.slug, project] as const))("« %s »", (slug, project) => {
    it("a son titre, sa description, son adresse de référence et son aperçu", async () => {
      const metadata = await generateMetadata(params(slug));
      expect(metadata.title).toBe(project.title);
      expect(metadata.description).toBe(project.pitch);
      expect(metadata.alternates?.canonical).toBe(`/projets/${slug}`);
      expect(metadata.openGraph).toMatchObject({
        url: `/projets/${slug}`,
        title: `${project.title} · ${site.name}`,
        siteName: site.name,
        locale: "fr_FR",
      });
    });

    it("a une image d'aperçu à son nom, versionnée, avec un texte alternatif qui cite le projet", async () => {
      const metadata = await generateMetadata(params(slug));
      const images = metadata.openGraph?.images as { url: string; alt: string }[];
      expect(images).toHaveLength(1);
      expect(images[0].url).toMatch(new RegExp(`^/projets/${slug}/opengraph-image\\?v=[0-9a-f]{10}$`));
      expect(images[0].alt).toContain(project.title);
    });
  });
});

describe("Version des images d'aperçu des projets", () => {
  const ogUrl = async (slug: string) =>
    ((await generateMetadata(params(slug))).openGraph?.images as { url: string }[])[0].url;

  it("chaque projet a sa propre version d'image", async () => {
    const urls = await Promise.all(projects.map((project) => ogUrl(project.slug)));
    expect(new Set(urls).size).toBe(projects.length);
  });

  it("la version change dès qu'un texte affiché sur l'image change (titre, accroche, outils, onglet)", async () => {
    const project = projects[0];
    const before = await ogUrl(project.slug);
    const changes: ((p: Project) => void)[] = [
      (p) => (p.title += " !"),
      (p) => (p.pitch += " !"),
      (p) => (p.tech = [`${p.tech[0]} !`, ...p.tech.slice(1)]),
      (p) => (p.domains = p.domains.includes("cybersecurite") ? ["systemes-reseaux"] : ["cybersecurite"]),
    ];
    for (const change of changes) {
      const saved = structuredClone(project);
      change(project);
      try {
        expect(await ogUrl(project.slug)).not.toBe(before);
      } finally {
        Object.assign(project, saved);
      }
    }
    expect(await ogUrl(project.slug)).toBe(before);
  });

  it("la version ne change pas pour un texte absent de l'image (ex. le contexte de la fiche)", async () => {
    const project = projects[0];
    const before = await ogUrl(project.slug);
    const saved = project.context;
    project.context += " (modifié)";
    try {
      expect(await ogUrl(project.slug)).toBe(before);
    } finally {
      project.context = saved;
    }
  });
});

describe("Page d'accueil", () => {
  it("a un aperçu de partage avec une image versionnée", () => {
    const images = homeMetadata.openGraph?.images as { url: string }[];
    expect(images[0].url).toMatch(/^\/opengraph-image\?v=/);
  });
});

describe("Pages exclues des résultats Google", () => {
  it("la page 404 n'est pas indexée et n'a pas d'adresse de référence", () => {
    expect(notFoundMetadata.robots).toMatchObject({ index: false });
    expect(notFoundMetadata.alternates?.canonical).toBeNull();
  });

  it("les mentions légales ne sont pas indexées", () => {
    expect(legalMetadata.robots).toMatchObject({ index: false, follow: true });
  });
});

describe("Plan du site (sitemap.xml)", () => {
  const entries = sitemap();

  it("contient l'accueil puis chaque projet, avec des adresses complètes", () => {
    expect(entries.map((entry) => entry.url)).toEqual([
      absoluteUrl("/"),
      ...projects.map((project) => absoluteUrl(`/projets/${project.slug}`)),
    ]);
  });

  it("n'a aucune adresse en double", () => {
    const urls = entries.map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("ne liste pas les pages exclues de Google (mentions légales)", () => {
    expect(entries.some((entry) => entry.url.includes("mentions-legales"))).toBe(false);
  });
});

describe("Consignes aux robots (robots.txt)", () => {
  it("autorise tout le site et indique où trouver le plan du site", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: absoluteUrl("/sitemap.xml"),
    });
  });
});
