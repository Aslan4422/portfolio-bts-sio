import type { Project } from "../types";

const project: Project = {
  slug: "ctf-cybersecurite",
  title: "Challenges Capture The Flag",
  domains: ["cybersecurite"],
  pitch: "Investigation et audit technique en conditions de défi.",
  setting: "Badge « Passe ton Hack d'Abord » · 2026",
  cover: {
    src: "https://images.unsplash.com/photo-1586165368502-1bad197a6461",
    author: "Hassan Pasha",
    source: "Unsplash",
    url: "https://unsplash.com/photos/7SjEuEF06Zw",
  },

  facts: [
    { label: "Distinction", value: "Badge « Passe ton Hack d'Abord » (2026)" },
    { label: "Délivré par", value: "Éducation nationale (DGESCO) et COMCYBER" },
  ],

  context:
    "Challenges Capture The Flag (CTF) et obtention en 2026 du badge « Passe ton Hack d'Abord », délivré par le Ministère de l'Éducation nationale (DGESCO) en partenariat avec le COMCYBER (Ministère des Armées). Objectif : comprendre les techniques d'attaque au service de l'audit et de la défense.",

  sections: [
    {
      title: "Travaux pratiques",
      items: [
        "Scripts Bash.",
        "Reconnaissance réseau (Nmap).",
        "Analyse de configuration système.",
        "Élévation de privilèges sous Linux.",
        "Exploitation de vulnérabilités connues (CVE).",
      ],
    },
    {
      title: "Angle défensif",
      items: [
        "Comprendre les techniques d'attaque pour mieux auditer un système et le défendre.",
      ],
    },
  ],

  results: [
    "Badge « Passe ton Hack d'Abord » obtenu en 2026 (Éducation nationale / COMCYBER).",
  ],

  tech: ["Kali Linux", "Bash", "Nmap", "Analyse système", "CVE"],

  bts: [
    {
      competency: "b3-dic",
      evidence: "Compréhension des techniques d'attaque pour mieux s'en protéger.",
    },
    {
      competency: "b3-infrastructure",
      evidence: "Audit technique : reconnaissance réseau, analyse de configuration, CVE.",
    },
  ],
};

export default project;
