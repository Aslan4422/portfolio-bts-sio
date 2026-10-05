/*
 * Images d'aperçu (partage sur LinkedIn, Discord…) et icône iPhone : chacune doit
 * être réellement dessinée, au bon format, même si Google Fonts est injoignable.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import AppleIcon, { size as appleIconSize } from "@/app/apple-icon";
import OpenGraphImage, { size as homeSize } from "@/app/opengraph-image";
import ProjectOpenGraphImage, { generateStaticParams } from "@/app/projets/[slug]/opengraph-image";
import { projects } from "@/content/projects";

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47];
// Tailles attendues, écrites en clair (format recommandé par LinkedIn / X, et icône iPhone).
const OG = { width: 1200, height: 630 };
const APPLE = { width: 180, height: 180 };

/** Vérifie qu'une réponse contient bien une image PNG, et renvoie ses dimensions. */
async function readPng(response: Response) {
  expect(response.headers.get("content-type")).toBe("image/png");
  const bytes = new Uint8Array(await response.arrayBuffer());
  expect([...bytes.subarray(0, 4)]).toEqual(PNG_SIGNATURE);
  const view = new DataView(bytes.buffer);
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

beforeEach(() => {
  // Pas d'accès au réseau pendant les tests : la police par défaut est utilisée.
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("hors ligne")));
});

describe("Images d'aperçu", () => {
  it("l'image de l'accueil est un PNG de 1200 × 630", async () => {
    expect(homeSize).toEqual(OG);
    expect(await readPng(await OpenGraphImage())).toEqual(OG);
  }, 30_000);

  it("une image est préparée pour chaque projet", () => {
    expect(generateStaticParams()).toEqual(projects.map((project) => ({ slug: project.slug })));
  });

  it.each(projects.map((project) => project.slug))(
    "l'image du projet « %s » est dessinée sans erreur (1200 × 630)",
    async (slug) => {
      const response = await ProjectOpenGraphImage({ params: Promise.resolve({ slug }) });
      expect(await readPng(response)).toEqual(OG);
    },
    30_000,
  );

  it("un projet inconnu n'a pas d'image (page 404)", async () => {
    await expect(ProjectOpenGraphImage({ params: Promise.resolve({ slug: "inexistant" }) })).rejects.toMatchObject({
      digest: expect.stringMatching(/404/),
    });
  });

  it("l'icône pour l'écran d'accueil iPhone est un PNG de 180 × 180", async () => {
    expect(appleIconSize).toEqual(APPLE);
    expect(await readPng(await AppleIcon())).toEqual(APPLE);
  }, 30_000);
});
