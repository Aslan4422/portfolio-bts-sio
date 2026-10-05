import type { VeilleSource, VeilleTheme } from "./types";

/* Section « Veille technologique » (notée à l'oral du BTS). */

export const veilleMethod =
  "Je consulte régulièrement un socle de sources officielles et spécialisées, en priorité celles liées à mon domaine (administration d'infrastructures et cybersécurité défensive). Je pars des sources institutionnelles pour les alertes qui touchent directement les systèmes que j'administre, je suis les vulnérabilités (CVE) pour évaluer leur criticité sur mes environnements Windows et Linux, et je complète avec des médias spécialisés pour rester à jour sur les menaces émergentes, en particulier les rançongiciels. Je retiens surtout les correctifs et bonnes pratiques applicables à mes projets.";

/** Thèmes suivis. */
export const veilleThemes: VeilleTheme[] = [
  {
    title: "La menace rançongiciel en 2026",
    description:
      "De WannaCry (2017) au modèle Ransomware-as-a-Service de LockBit : comprendre l'évolution des attaques pour adapter la défense.",
    tags: ["WannaCry", "LockBit", "RaaS"],
    icon: "shield-alert",
    relatedProject: "analyse-ransomware",
  },
  {
    title: "Suivi des vulnérabilités (CVE)",
    description:
      "Suivre les vulnérabilités publiées et leur criticité, système par système (Linux, Windows), pour prioriser les correctifs.",
    tags: ["CVE", "Criticité", "Linux / Windows"],
    icon: "radar",
    relatedProject: "stage-wazuh-ntfs",
  },
  {
    title: "Guides de durcissement de l'ANSSI",
    description:
      "Les recommandations et guides de l'ANSSI, comme le guide BP-028 pour les systèmes GNU/Linux, appliqués à mes projets d'audit et de durcissement.",
    tags: ["ANSSI", "BP-028", "Durcissement"],
    icon: "shield-check",
    relatedProject: "durcissement-anssi",
  },
];

/** Sources consultées. */
export const veilleSources: VeilleSource[] = [
  {
    name: "CERT-FR (ANSSI)",
    category: "Cybersécurité générale",
    description:
      "Les alertes et bulletins officiels de l'ANSSI. Ma source de référence pour les vulnérabilités critiques et l'état de la menace, directement en lien avec mon travail de durcissement selon l'ANSSI.",
    icon: "shield-check",
    url: "https://www.cert.ssi.gouv.fr/",
  },
  {
    name: "CVE / NVD",
    category: "Suivi des vulnérabilités",
    description:
      "La base de référence des vulnérabilités connues. Je l'utilise pour évaluer la criticité d'une faille sur mes systèmes Windows et Linux, dans la continuité du suivi des CVE réalisé en stage.",
    icon: "radar",
    url: "https://nvd.nist.gov/",
  },
  {
    name: "Bleeping Computer",
    category: "Actualité et rançongiciels",
    description:
      "Média spécialisé anglophone mis à jour quotidiennement. Je le suis pour l'actualité des menaces et le suivi des groupes de rançongiciels (LockBit et autres).",
    icon: "newspaper",
    url: "https://www.bleepingcomputer.com/",
  },
  {
    name: "No More Ransom",
    category: "Lutte contre les rançongiciels",
    description:
      "Initiative d'Europol qui recense des outils de déchiffrement et des conseils de prévention. Une ressource 100 % défensive, en prolongement de mon projet d'analyse de ransomware.",
    icon: "life-buoy",
    url: "https://www.nomoreransom.org/fr/index.html",
  },
  {
    name: "OWASP API Security Top 10",
    category: "Sécurité des API",
    description:
      "La référence sur les principaux risques de sécurité des API. Utile dès qu'une infrastructure expose des services, pour comprendre comment les protéger côté défense.",
    icon: "plug",
    url: "https://owasp.org/API-Security/",
  },
];
