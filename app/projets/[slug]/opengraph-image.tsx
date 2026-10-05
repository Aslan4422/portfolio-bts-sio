import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "@/content/projects";
import { site } from "@/content/site";
import { loadOgFonts, OG_SIZE, ogColors, OgEyebrow, OgFrame, OgMonogram, projectOgContent } from "@/lib/og";

/*
 * Image d'aperçu d'un projet (lien /projets/<slug> partagé) : titre et résumé du projet,
 * en grand pour rester lisibles en miniature (voir lib/og.tsx).
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

  const { eyebrow, domains, title, pitch } = projectOgContent(project);
  const fonts = await loadOgFonts();

  return new ImageResponse(
    (
      <OgFrame>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <OgEyebrow>{eyebrow}</OgEyebrow>
          <OgMonogram size={92} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: ogColors.accentLight,
            }}
          >
            {domains}
          </div>
          <div style={{ marginTop: 14, fontSize: 66, fontWeight: 600, lineHeight: 1.08, letterSpacing: -1.5 }}>
            {title}
          </div>
          <div style={{ marginTop: 20, fontSize: 36, lineHeight: 1.3, color: ogColors.fgSecondary }}>{pitch}</div>
        </div>
      </OgFrame>
    ),
    { ...size, fonts },
  );
}
