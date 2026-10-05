/*
 * Référencement : adresse publique du site, images d'aperçu versionnées,
 * fiche « Person » pour Google et police des images d'aperçu.
 */
import { describe, expect, it, vi } from "vitest";
import { site } from "@/content/site";
import { loadOgFonts, OG_SIZE } from "@/lib/og";
import { buildPersonJsonLd, homeOpenGraph, ogImage, serializeJsonLd } from "@/lib/seo";
import { absoluteUrl, resolveSiteUrl } from "@/lib/site-url";

describe("Adresse publique du site", () => {
  it("prend en priorité l'adresse choisie à la main", () => {
    const url = resolveSiteUrl({
      NEXT_PUBLIC_SITE_URL: "https://erhan-aslan.fr",
      VERCEL_PROJECT_PRODUCTION_URL: "portfolio.vercel.app",
    });
    expect(url.href).toBe("https://erhan-aslan.fr/");
  });

  it("ne garde que l'origine (sans chemin ni barre finale en trop)", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://erhan-aslan.fr/portfolio/?x=1" }).href).toBe(
      "https://erhan-aslan.fr/",
    );
  });

  it("utilise ensuite le domaine fourni par Vercel, en https", () => {
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "portfolio-bts-sio.vercel.app" }).href).toBe(
      "https://portfolio-bts-sio.vercel.app/",
    );
  });

  it.each(["pas une adresse", "ftp://erhan-aslan.fr", "javascript:alert(1)", "   "])(
    "ignore une adresse invalide ou dangereuse (%s)",
    (value) => {
      expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: value, VERCEL_PROJECT_PRODUCTION_URL: "site.vercel.app" }).href).toBe(
        "https://site.vercel.app/",
      );
    },
  );

  it("revient à l'adresse locale sans aucune information", () => {
    expect(resolveSiteUrl({}).href).toBe("http://localhost:3000/");
  });

  it("construit des adresses complètes à partir d'un chemin", () => {
    expect(absoluteUrl("/projets/labo-stormshield")).toMatch(/^https?:\/\/[^/]+\/projets\/labo-stormshield$/);
  });
});

describe("Images d'aperçu versionnées", () => {
  it("ont la taille attendue par LinkedIn et X (1200 × 630)", () => {
    expect(OG_SIZE).toEqual({ width: 1200, height: 630 });
    expect(ogImage("/opengraph-image", "texte", ["a"])).toMatchObject({
      width: 1200,
      height: 630,
      type: "image/png",
      alt: "texte",
    });
  });

  it("gardent la même adresse tant que leur contenu ne change pas", () => {
    expect(ogImage("/opengraph-image", "x", ["Titre", 1]).url).toBe(ogImage("/opengraph-image", "x", ["Titre", 1]).url);
  });

  it("changent d'adresse dès que le texte affiché change (les réseaux rechargent l'image)", () => {
    const before = ogImage("/projets/a/opengraph-image", "x", ["Ancien titre"]).url;
    const after = ogImage("/projets/a/opengraph-image", "x", ["Nouveau titre"]).url;
    expect(before).not.toBe(after);
    expect(after).toMatch(/^\/projets\/a\/opengraph-image\?v=[0-9a-f]{10}$/);
  });

  it("l'aperçu de l'accueil reprend le titre et la description du site", () => {
    expect(homeOpenGraph).toMatchObject({ url: "/", title: site.title, description: site.description, locale: "fr_FR" });
    expect(homeOpenGraph.images[0].url).toMatch(/^\/opengraph-image\?v=/);
  });
});

describe("Fiche « Person » pour Google (données structurées)", () => {
  const person = buildPersonJsonLd("https://erhan-aslan.fr/");

  it("décrit l'auteur du site avec ses profils publics", () => {
    expect(person).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Person",
      name: site.name,
      url: "https://erhan-aslan.fr/",
      image: `https://erhan-aslan.fr${site.photo.src}`,
      sameAs: [site.contact.linkedin, site.contact.github],
    });
  });

  it("ne donne qu'une région, jamais d'adresse précise ni de téléphone", () => {
    expect(person.address).toEqual({ "@type": "PostalAddress", addressRegion: site.location, addressCountry: "FR" });
    expect(JSON.stringify(person)).not.toMatch(/telephone|streetAddress|postalCode/);
  });

  it("liste les compétences techniques (sans les qualités humaines)", () => {
    expect(person.knowsAbout).toContain("Wazuh (SIEM)");
    expect(person.knowsAbout).not.toContain("Autonomie et rigueur");
  });

  it("est écrite de façon sûre dans la page (impossible de fermer la balise <script>)", () => {
    const json = serializeJsonLd({ texte: "</script><script>alert(1)</script>" });
    expect(json).not.toContain("</script>");
    expect(JSON.parse(json)).toEqual({ texte: "</script><script>alert(1)</script>" });
  });
});

describe("Police des images d'aperçu", () => {
  it("si Google Fonts est injoignable, l'image est quand même produite (police par défaut)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("hors ligne")));
    await expect(loadOgFonts()).resolves.toBeUndefined();
  });

  it("si la réponse ne contient pas de police, pas d'erreur non plus", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("/* rien */")));
    await expect(loadOgFonts()).resolves.toBeUndefined();
  });

  it("charge Geist en deux graisses quand Google Fonts répond", async () => {
    const css = "@font-face { src: url(https://fonts.gstatic.com/geist.ttf) format('truetype'); }";
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => (url.endsWith(".ttf") ? new Response(new ArrayBuffer(8)) : new Response(css))),
    );
    const fonts = await loadOgFonts();
    expect(fonts?.map((font) => [font.name, font.weight])).toEqual([
      ["Geist", 400],
      ["Geist", 600],
    ]);
  });
});
