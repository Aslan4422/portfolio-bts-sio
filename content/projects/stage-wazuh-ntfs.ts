import type { Project } from "../types";

const project: Project = {
  slug: "stage-wazuh-ntfs",
  title: "Stage — Technicien Systèmes, Réseaux & Sécurité",
  domains: ["systemes-reseaux", "cybersecurite"],
  pitch: "Assainissement d'un serveur de fichiers et de l'Active Directory, et tableaux de bord de sécurité Wazuh.",
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
    "Stage de BTS SIO au sein de Lamy Liaisons (Karnov Group), à Saint-Ouen, de mai à juillet 2026. Missions d'administration et de sécurité sur un système d'information en production : projet d'assainissement du serveur de fichiers et de l'Active Directory, tableaux de bord de supervision de sécurité, automatisation et support aux utilisateurs.",

  sections: [
    {
      title: "Projet d'assainissement du serveur de fichiers et de l'Active Directory",
      intro: "Présent dès le lancement de ce projet, j'y ai tenu un rôle important.",
      items: [
        "Audit, restructuration et nettoyage des autorisations d'accès NTFS sur les serveurs de fichiers.",
        "Gestion des SID orphelins et correction des droits utilisateurs.",
      ],
      highlight: true,
    },
    {
      title: "Tableaux de bord de sécurité sur le SIEM Wazuh",
      intro:
        "Je n'ai pas mis en place Wazuh moi-même : j'ai travaillé sur la plateforme de l'entreprise, principalement en concevant des tableaux de bord.",
      items: [
        "Conception de tableaux de bord détaillés sur l'infrastructure de l'entreprise, pour surveiller son trafic.",
        "Suivi des menaces auxquelles l'infrastructure fait face, dont les vulnérabilités (CVE) par système d'exploitation (Linux / Windows).",
        "Création de règles d'exclusion pare-feu (filtrage NetBIOS / EventLogs Windows).",
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
    "Serveur de fichiers assaini : SID orphelins traités et droits utilisateurs corrigés.",
    "Tableaux de bord Wazuh détaillés pour surveiller le trafic de l'entreprise et les menaces qui la visent (CVE par système d'exploitation).",
    "Tâches administratives automatisées en PowerShell.",
  ],

  tech: [
    "Active Directory",
    "Sécurité NTFS",
    "Wazuh (tableaux de bord)",
    "PowerShell",
    "Windows Server",
    "Debian/Linux",
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
      competency: "b1-projet",
      evidence: "Projet d'assainissement du serveur de fichiers et de l'Active Directory, suivi depuis son lancement.",
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
      evidence: "Règles d'exclusion pare-feu et surveillance du trafic grâce aux tableaux de bord du SIEM.",
    },
  ],
};

export default project;
