import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { loadOgFonts, OG_SIZE, ogColors, OgEyebrow, OgFrame, ogHomeText, OgMonogram } from "@/lib/og";

/*
 * Image d'aperçu du site (lien de la page d'accueil partagé).
 * Dessin « gros et simple » pour rester lisible en miniature (voir lib/og.tsx).
 * Son adresse (avec numéro de version) est déclarée dans lib/seo.ts.
 */

export const alt = `${site.name} — ${site.role}`;
export const size = OG_SIZE;
export const contentType = "image/png";

const { eyebrow, headlineLead, headlineAccent } = ogHomeText;

export default async function OpenGraphImage() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    (
      <OgFrame>
        <OgEyebrow>{eyebrow}</OgEyebrow>

        <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ fontSize: 66, fontWeight: 600, letterSpacing: -1, color: ogColors.accentLight }}>
              {site.name}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 14,
                fontSize: 76,
                fontWeight: 600,
                lineHeight: 1.08,
                letterSpacing: -2,
              }}
            >
              <span>{headlineLead}</span>
              <span style={{ color: ogColors.accentLight }}>{headlineAccent}</span>
            </div>
          </div>
          <OgMonogram size={270} />
        </div>
      </OgFrame>
    ),
    { ...size, fonts },
  );
}
