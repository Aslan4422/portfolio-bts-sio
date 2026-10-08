import type { VeilleSource, VeilleTheme } from "./types";

/* Section « Veille technologique » (notée à l'oral du BTS). */

export const veilleMethod =
  "Ma veille porte sur la sécurité des API, en lien avec mon domaine : l'administration d'infrastructures et la cybersécurité défensive. Je m'appuie sur cinq sources officielles et de référence : les référentiels et standards (OWASP, IETF) pour les bonnes pratiques de conception, les alertes institutionnelles (CERT-FR, CISA) pour les vulnérabilités réellement exploitées et leurs correctifs, et la CNIL pour le cadre réglementaire. Pour chaque source, j'identifie qui publie et quel intérêt il a à le faire. Je retiens surtout les correctifs et bonnes pratiques applicables à mes projets.";

/** Thèmes suivis (le premier est mon sujet de veille). */
export const veilleThemes: VeilleTheme[] = [
  {
    title: "Sécurité des API",
    description:
      "Mon sujet de veille : les failles propres aux API (authentification, jetons d'accès, exposition des données) et les bonnes pratiques pour les protéger, de l'OWASP API Top 10 aux recommandations de la CNIL.",
    tags: ["OWASP API Top 10", "OAuth 2.0", "RGPD"],
    icon: "plug",
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

/** Sources consultées sur la sécurité des API. */
export const veilleSources: VeilleSource[] = [
  {
    name: "OWASP API Security Top 10",
    publisher: "OWASP Foundation",
    frequency: "Pluriannuelle pour les éditions majeures, mises à jour continues sur GitHub",
    interest:
      "Organisation à but non lucratif : promouvoir les standards ouverts et sensibiliser, sans visée commerciale.",
    description:
      "Référence mondiale qui classe les 10 failles critiques propres aux API, avec les scénarios d'attaque rencontrés en production et les règles de conception défensives à appliquer.",
    icon: "plug",
    url: "https://owasp.org/API-Security/",
  },
  {
    name: "Recommandations de la CNIL sur les API",
    publisher: "CNIL (France)",
    frequency: "Périodique : textes réglementaires, délibérations et guides d'application",
    interest:
      "Autorité administrative indépendante : encadrer juridiquement et techniquement les échanges de données pour faire respecter le RGPD.",
    description:
      "Source institutionnelle française qui fixe les obligations concrètes de sécurité des API : gestion des clés et jetons d'authentification, journalisation des appels, limitation du débit et gestion des habilitations.",
    icon: "scale",
    url: "https://www.cnil.fr/fr/api-les-recommandations-de-la-cnil-sur-le-partage-de-donnees",
  },
  {
    name: "CERT-FR — Avis et alertes de sécurité",
    publisher: "ANSSI (France)",
    frequency: "Quotidienne à hebdomadaire, selon l'actualité des menaces",
    interest:
      "Mission régalienne de cyberdéfense : alerter l'écosystème français sur les vulnérabilités actives et prévenir les compromissions critiques.",
    description:
      "Source nationale de référence qui signale les vulnérabilités critiques visant des infrastructures réelles (passerelles d'API, reverse proxies), avec les correctifs officiels et les mesures de contournement d'urgence.",
    icon: "siren",
    url: "https://www.cert.ssi.gouv.fr/avis/",
  },
  {
    name: "CISA — Known Exploited Vulnerabilities (KEV)",
    publisher: "CISA (États-Unis)",
    frequency: "Continue : ajout dès qu'une exploitation réelle est constatée",
    interest:
      "Directive fédérale : obliger les administrations américaines à corriger, dans des délais imposés, les failles activement exploitées.",
    description:
      "Base opérationnelle qui laisse la théorie de côté : elle ne recense que les failles (dont celles des API) réellement exploitées dans des attaques en cours, avec des échéances de correction impératives.",
    icon: "bug",
    url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
  },
  {
    name: "IETF RFC 9700 — Sécurité d'OAuth 2.0",
    publisher: "IETF (Internet Engineering Task Force)",
    frequency: "Ponctuelle : à la publication ou à la mise à jour d'un standard",
    interest:
      "Organisme mondial de normalisation : garantir la robustesse, l'interopérabilité et la sécurité des protocoles du Web.",
    description:
      "Standard international des bonnes pratiques OAuth 2.0 : il détaille les faiblesses d'authentification et de jetons sur les API, et les configurations indispensables pour sécuriser les accès en production.",
    icon: "book-open",
    url: "https://datatracker.ietf.org/doc/rfc9700/",
  },
];
