import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "@/content/projects";
import { site } from "@/content/site";
import { loadOgFonts, OG_SIZE, ogColors, OgEyebrow, OgFrame, OgMonogram, projectOgContent } from "@/lib/og";

/*
 * Image d'aperçu d'un projet (lien /projets/<slug> partagé) : titre, résumé et outils du projet.
 * Son adresse (avec numéro de version) et son texte alternatif sont déclarés dans ../page.tsx.
 */

export const alt = `Projet du portfolio d'${site.name}, BTS SIO SISR`;
export const size = OG_SIZE;
export const contentType = "image/png";

/** Une image est préparée pour chaque projet au moment de la génération du site. */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const { eyebrow, domains, title, pitch, tools } = projectOgContent(project);
  const fonts = await loadOgFonts();

  return new ImageResponse(
    (
      <OgFrame>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <OgEyebrow>{eyebrow}</OgEyebrow>
          <OgMonogram size={96} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", paddingRight: 40 }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: ogColors.accentLight,
            }}
          >
            {domains}
          </div>
          <div style={{ marginTop: 16, fontSize: 64, fontWeight: 600, lineHeight: 1.08, letterSpacing: -1.5 }}>
            {title}
          </div>
          <div style={{ marginTop: 22, fontSize: 32, lineHeight: 1.35, color: ogColors.fgSecondary }}>
            {pitch}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {tools.map((tool) => (
            <div
              key={tool}
              style={{
                display: "flex",
                padding: "8px 18px",
                borderRadius: 10,
                border: `2px solid ${ogColors.lineStrong}`,
                backgroundColor: ogColors.surface,
                fontSize: 24,
                color: ogColors.fgSecondary,
              }}
            >
              {tool}
            </div>
          ))}
        </div>
      </OgFrame>
    ),
    { ...size, fonts },
  );
}
