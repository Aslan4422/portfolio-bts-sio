import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { loadOgFonts, OG_SIZE, ogColors, OgEyebrow, OgFrame, ogHomeText, OgMonogram } from "@/lib/og";

/*
 * Image d'aperçu du site (lien de la page d'accueil partagé).
 * Son adresse (avec numéro de version) est déclarée dans lib/seo.ts.
 */

export const alt = `${site.name} — ${site.role}`;
export const size = OG_SIZE;
export const contentType = "image/png";

const { eyebrow, keywords } = ogHomeText;

export default async function OpenGraphImage() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    (
      <OgFrame>
        <OgEyebrow>{eyebrow}</OgEyebrow>

        <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 56 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ fontSize: 48, fontWeight: 600, color: ogColors.accentLight }}>{site.name}</div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 18,
                fontSize: 62,
                fontWeight: 600,
                lineHeight: 1.1,
                letterSpacing: -1.5,
              }}
            >
              <span>{site.roleLead}</span>
              <span style={{ color: ogColors.accentLight }}>{site.roleAccent}</span>
            </div>
          </div>
          <OgMonogram size={250} />
        </div>

        <div style={{ fontSize: 28, color: ogColors.fgSecondary }}>{keywords}</div>
      </OgFrame>
    ),
    { ...size, fonts },
  );
}
