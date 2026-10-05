import { ImageResponse } from "next/og";
import { loadOgFonts, ogColors } from "@/lib/og";

/* Icône utilisée quand le site est ajouté à l'écran d'accueil d'un iPhone / iPad (180 × 180 px). */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const fonts = await loadOgFonts();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: ogColors.canvas,
          color: ogColors.accentLight,
          fontFamily: "Geist",
          fontSize: 76,
          fontWeight: 600,
          letterSpacing: -3,
        }}
      >
        EA
      </div>
    ),
    { ...size, fonts },
  );
}
