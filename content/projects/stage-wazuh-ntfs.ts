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
    "Stage de BTS SIO au sein de Lamy Liaisons (Karnov Group), à Saint-Ouen, de mai à juillet 2026. Missions d'administration et de sécurité sur un système d'information en production : projet d'assainissement du serveur de fichiers et de l'Active Directory, tableaux de bord de supervision de sécurité, maintenance du parc, automatisation et support aux utilisateurs.",

  sections: [
    {
      title: "Projet d'assainissement du serveur de fichiers et de l'Active Directory",
      intro: "Présent dès le lancement de ce projet, j'y ai tenu un rôle important.",
      items: [
        "Inventaire des partages avec TreeSize (taille, dates, propriétaires) pour décider, dossier par dossier, quoi conserver ou archiver.",
        "Export des droits NTFS avec DumpSec et repérage des groupes réellement utilisés dans ces droits.",
        "Cartographie des groupes Active Directory : export des appartenances, carte des groupes imbriqués et croisement avec les droits du serveur (Excel : RECHERCHEV, INDEX/EQUIV, tableaux croisés dynamiques).",
        "Repérage des groupes vides ou inutilisés (ADManager Plus) et décision groupe par groupe : vider, conserver ou supprimer.",
        "Préparation des commandes PowerShell (module Active Directory) de nettoyage, avec une sauvegarde préalable des appartenances pour pouvoir revenir en arrière.",
        "Contrôle des droits après archivage : gestion des SID orphelins et correction des droits utilisateurs.",
      ],
      highlight: true,
    },
    {
      title: "Tableaux de bord de sécurité sur le SIEM Wazuh",
      intro:
        "Je n'ai pas mis en place Wazuh moi-même : j'ai travaillé sur la plateforme de l'entreprise, principalement en concevant des tableaux de bord.",
      items: [
        "Conception de 5 tableaux de bord reliés entre eux : vue d'ensemble des alertes, tentatives de connexion (géolocalisation) et suivi des vulnérabilités (CVE) global, Windows et Linux.",
        "Filtres et requêtes DQL (par système d'exploitation, exclusion des paquets du noyau Linux) pour des vues plus lisibles.",
        "Analyse des alertes bruyantes, avec une méthode documentée sous Excel : le bruit venait surtout du pare-feu Windows et des annonces NetBIOS.",
        "Création de règles d'exclusion pare-feu (filtrage NetBIOS / EventLogs Windows) pour garder visibles les alertes utiles.",
      ],
    },
    {
      title: "Maintenance du parc et support",
      items: [
        "Démontage d'ordinateurs portables HP et remplacement de composants (stockage, écrans…).",
        "Maintien en conditions opérationnelles du parc et assistance technique aux utilisateurs.",
      ],
    },
    {
      title: "Automatisation et documentation",
      items: [
        "Automatisation de tâches administratives via scripts PowerShell.",
        "Documentation technique dans Obsidian : fonctionnement de Wazuh, parcours d'un journal (collecte, décodeur, règles, tableau de bord) et rôle des équipements de l'infrastructure.",
      ],
    },
  ],

  results: [
    "Serveur de fichiers assaini : dossiers inventoriés puis conservés ou archivés, groupes AD inutilisés repérés, SID orphelins traités et droits utilisateurs corrigés.",
    "5 tableaux de bord Wazuh pour surveiller les alertes, les connexions et les vulnérabilités (CVE) des systèmes Windows et Linux.",
    "Alertes bruyantes analysées et filtrées par des règles d'exclusion.",
    "Portables HP remis en état et tâches administratives automatisées en PowerShell.",
  ],

  tech: [
    "Active Directory",
    "Sécurité NTFS",
    "Wazuh (tableaux de bord)",
    "PowerShell",
    "TreeSize",
    "DumpSec",
    "ADManager Plus",
    "Excel (TCD)",
    "Windows Server",
    "Debian/Linux",
    "Obsidian",
    "Matériel HP",
  ],

  bts: [
    {
      competency: "b1-patrimoine",
      evidence: "Maintenance matérielle des portables HP (stockage, écrans) et maintien en conditions opérationnelles du parc.",
    },
    {
      competency: "b1-incidents",
      evidence: "Assistance technique aux utilisateurs.",
    },
    {
      competency: "b1-projet",
      evidence:
        "Projet d'assainissement du serveur de fichiers et de l'Active Directory, suivi depuis son lancement : inventaire, analyse, décisions groupe par groupe.",
    },
    {
      competency: "b2-exploiter",
      evidence: "Supervision via 5 tableaux de bord Wazuh et automatisation PowerShell.",
    },
    {
      competency: "b3-securiser",
      evidence: "Restructuration des droits NTFS, nettoyage des groupes AD inutilisés et correction des droits utilisateurs.",
    },
    {
      competency: "b3-dic",
      evidence: "Suivi des CVE par système d'exploitation pour prioriser les correctifs.",
    },
    {
      competency: "b3-infrastructure",
      evidence: "Analyse des alertes bruyantes et règles d'exclusion pour garder visibles les vraies menaces.",
    },
  ],
};

export default project;
