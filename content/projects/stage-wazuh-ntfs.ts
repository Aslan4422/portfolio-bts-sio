import type { Project } from "../types";

const project: Project = {
  slug: "stage-wazuh-ntfs",
  title: "Stage — Technicien Systèmes, Réseaux & Sécurité",
  domains: ["systemes-reseaux", "cybersecurite"],
  pitch: "Déploiement d'un SIEM et audit des droits d'accès en entreprise réelle.",
  setting: "Stage en entreprise · Mai – juillet 2026",
  cover: {
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    author: "Luke Chesser",
    source: "Unsplash",
    url: "https://unsplash.com/photos/JKUTrJ4vK00",
  },

  facts: [
    { label: "Entreprise", value: "Lamy Liaisons (Karnov Group)" },
    { label: "Lieu", value: "Saint-Ouen" },
    { label: "Période", value: "Mai – juillet 2026" },
    { label: "Poste", value: "Technicien systèmes, réseaux & sécurité" },
  ],

  context:
    "Stage de BTS SIO au sein de Lamy Liaisons (Karnov Group), à Saint-Ouen, de mai à juillet 2026. Missions d'administration et de sécurité sur un système d'information en production : droits d'accès aux serveurs de fichiers, supervision de sécurité, automatisation et support aux utilisateurs.",

  sections: [
    {
      title: "Audit des droits d'accès NTFS",
      items: [
        "Audit, restructuration et nettoyage des autorisations d'accès NTFS sur les serveurs de fichiers.",
        "Gestion des SID orphelins et correction des droits utilisateurs.",
      ],
    },
    {
      title: "Intégration du SIEM Wazuh",
      items: [
        "Intégration et configuration du SIEM Wazuh : collecte d'événements.",
        "Création de règles d'exclusion pare-feu (filtrage NetBIOS / EventLogs Windows).",
        "Conception de tableaux de bord de suivi des CVE par système d'exploitation (Linux / Windows).",
      ],
    },
    {
      title: "Automatisation et support",
      items: [
        "Automatisation de tâches administratives via scripts PowerShell.",
        "Maintien en conditions opérationnelles du parc et assistance technique aux utilisateurs.",
      ],
    },
  ],

  results: [
    "Droits d'accès NTFS assainis : SID orphelins traités et droits utilisateurs corrigés.",
    "SIEM Wazuh intégré, avec des tableaux de bord de suivi des CVE par système d'exploitation.",
    "Tâches administratives automatisées en PowerShell.",
  ],

  tech: [
    "Wazuh (SIEM)",
    "Active Directory",
    "PowerShell",
    "Windows Server",
    "Debian/Linux",
    "Sécurité NTFS",
    "Suivi CVE",
  ],

  bts: [
    {
      competency: "b1-patrimoine",
      evidence: "Maintien en conditions opérationnelles du parc informatique.",
    },
    {
      competency: "b1-incidents",
      evidence: "Assistance technique aux utilisateurs.",
    },
    {
      competency: "b2-installer",
      evidence: "Intégration et configuration du SIEM Wazuh (collecte d'événements).",
    },
    {
      competency: "b2-exploiter",
      evidence: "Supervision via des tableaux de bord Wazuh et automatisation PowerShell.",
    },
    {
      competency: "b3-securiser",
      evidence: "Restructuration des droits NTFS et correction des droits utilisateurs.",
    },
    {
      competency: "b3-dic",
      evidence: "Suivi des CVE par système d'exploitation pour prioriser les correctifs.",
    },
    {
      competency: "b3-infrastructure",
      evidence: "Règles d'exclusion pare-feu et détection centralisée avec le SIEM.",
    },
  ],
};

export default project;
