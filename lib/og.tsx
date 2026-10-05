/*
 * Images d'aperçu des liens partagés (LinkedIn, Discord, WhatsApp…), 1200 × 630 px.
 * Elles sont dessinées au moment de la génération du site par next/og,
 * avec les couleurs du thème (voir app/globals.css).
 */
import type { ReactNode } from "react";
import { projectDomains } from "@/content/projects";
import { site } from "@/content/site";
import type { Project } from "@/content/types";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Version du dessin des images d'aperçu. À augmenter (2, 3…) après avoir modifié
 * ce fichier ou un fichier opengraph-image.tsx : l'adresse des images change,
 * et LinkedIn, Discord… affichent la nouvelle image au lieu de l'ancienne gardée en mémoire.
 * (Les changements de textes dans content/ sont pris en compte automatiquement.)
 */
export const OG_DESIGN_VERSION = 1;

/** Textes de l'image d'aperçu de la page d'accueil. */
export const ogHomeText = {
  eyebrow: "Portfolio · BTS SIO option SISR",
  keywords: "Active Directory · Durcissement ANSSI · Supervision Wazuh",
};

/**
 * Textes affichés sur l'image d'aperçu d'un projet. Source unique : ils servent
 * à dessiner l'image ET à calculer sa version (voir ogImage dans lib/seo.ts).
 */
export function projectOgContent(project: Project) {
  return {
    eyebrow: `${site.name} · Portfolio BTS SIO SISR`,
    domains: projectDomains
      .filter((domain) => project.domains.includes(domain.id))
      .map((domain) => domain.label)
      .join(" · "),
    title: project.title,
    pitch: project.pitch,
    tools: project.tech.slice(0, 4),
  };
}

/** Couleurs du thème (mêmes valeurs que app/globals.css). */
export const ogColors = {
  canvas: "#043a2c",
  canvasLight: "#064b38",
  canvasDeep: "#032e23",
  surface: "#114c3b",
  lineStrong: "#2b7561",
  accent: "#d4af37",
  accentLight: "#e2c35e",
  fg: "#f5f1e6",
  fgSecondary: "#b5d9ca",
};

type OgFont = { name: string; data: ArrayBuffer; weight: 400 | 600; style: "normal" };

/**
 * Télécharge la police Geist (la même que le site) depuis Google Fonts, au moment
 * de la génération du site uniquement (les visiteurs ne contactent jamais Google).
 * En cas d'échec (pas de réseau), renvoie undefined : l'image est alors produite avec
 * la police par défaut de next/og (une liste vide, elle, ferait échouer le dessin).
 */
export async function loadOgFonts(): Promise<OgFont[] | undefined> {
  const load = async (weight: 400 | 600): Promise<OgFont> => {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Geist:wght@${weight}`)).text();
    const fontUrl = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!fontUrl) throw new Error("Police introuvable");
    const response = await fetch(fontUrl);
    if (!response.ok) throw new Error("Police indisponible");
    return { name: "Geist", data: await response.arrayBuffer(), weight, style: "normal" };
  };
  try {
    return await Promise.all([load(400), load(600)]);
  } catch {
    return undefined;
  }
}

/** Fond commun : dégradé vert du site, deux halos de lumière et un liseré doré en bas. */
export function OgFrame({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: ogColors.canvas,
        backgroundImage: `linear-gradient(160deg, ${ogColors.canvasLight} 0%, ${ogColors.canvas} 45%, ${ogColors.canvasDeep} 100%)`,
        fontFamily: "Geist",
        color: ogColors.fg,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -330,
          top: -170,
          width: 760,
          height: 760,
          borderRadius: 9999,
          backgroundImage: "radial-gradient(circle, rgba(36,150,112,0.55) 0%, rgba(36,150,112,0.2) 38%, rgba(36,150,112,0) 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -300,
          bottom: -260,
          width: 720,
          height: 720,
          borderRadius: 9999,
          backgroundImage: "radial-gradient(circle, rgba(36,150,112,0.5) 0%, rgba(36,150,112,0.18) 38%, rgba(36,150,112,0) 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 8,
          backgroundImage: `linear-gradient(90deg, ${ogColors.accent}, ${ogColors.accentLight})`,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", padding: "64px 72px 72px" }}>
        {children}
      </div>
    </div>
  );
}

/** Ligne du haut : petite barre dorée + nom du site. */
export function OgEyebrow({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 28, color: ogColors.fgSecondary }}>
      <div style={{ width: 56, height: 6, borderRadius: 3, backgroundColor: ogColors.accent }} />
      {children}
    </div>
  );
}

/** Monogramme « EA » dans sa forme arrondie, comme en haut du site. */
export function OgMonogram({ size }: { size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: ogColors.surface,
        border: `2px solid ${ogColors.lineStrong}`,
        borderRadius: "58% 42% 33% 67% / 58% 33% 67% 42%",
        color: ogColors.accentLight,
        fontSize: Math.round(size * 0.34),
        fontWeight: 600,
        letterSpacing: -2,
      }}
    >
      EA
    </div>
  );
}
