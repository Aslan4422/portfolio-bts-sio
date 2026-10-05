import type { TimelineItem } from "./types";

/*
 * Frise du parcours : formation, stage, certifications.
 * Ordre chronologique (du plus ancien au plus récent), et la formation en cours
 * en dernier : la frise se lit de gauche à droite sur grand écran, de haut en bas
 * sur mobile, et se termine sur « En cours ».
 * Dates : mois d'obtention officiels (résultats du bac le 4 juillet 2025,
 * résultats du Cambridge English Certificate envoyés en juin 2025).
 */
export const timeline: TimelineItem[] = [
  {
    period: "Juin 2025",
    kind: "certification",
    title: "Cambridge English Certificate, niveau C1",
    organization: "Lycée Alfred Nobel",
    place: "Clichy-sous-Bois",
    description:
      "Niveau « utilisateur expérimenté » : un vrai atout pour lire la documentation technique et suivre l'actualité cyber en anglais.",
  },
  {
    period: "Juillet 2025",
    kind: "formation",
    title: "Baccalauréat Général",
    organization: "Lycée Alfred Nobel",
    place: "Clichy-sous-Bois",
    description: "Obtenu avec la mention Assez Bien, avant mon entrée en BTS SIO.",
  },
  {
    period: "Février 2026",
    kind: "certification",
    title: "Badge CTF « Passe ton Hack d'Abord »",
    organization: "Éducation nationale / COMCYBER",
    project: "ctf-cybersecurite",
  },
  {
    period: "Mai – juillet 2026",
    kind: "stage",
    title: "Stage Technicien Systèmes, Réseaux & Sécurité",
    organization: "Lamy Liaisons (Karnov Group)",
    place: "Saint-Ouen",
    project: "stage-wazuh-ntfs",
  },
  {
    period: "2025 – 2027",
    kind: "formation",
    title: "BTS SIO option SISR",
    organization: "Lycée Louis Armand",
    place: "Nogent-sur-Marne",
    description:
      "Spécialisation : administration réseau, durcissement système, supervision SIEM, virtualisation.",
    current: true,
  },
];
