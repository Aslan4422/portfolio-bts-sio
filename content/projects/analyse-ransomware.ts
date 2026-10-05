import type { Project } from "../types";

/*
 * Projet DÉFENSIF et pédagogique (approche Blue Team).
 * Présentation au niveau « vitrine » : aucun code malveillant, aucune commande,
 * aucune instruction offensive. L'accent est mis sur la détection et les contre-mesures.
 */
const project: Project = {
  slug: "analyse-ransomware",
  title: "Analyse d'un ransomware et contre-mesures",
  domains: ["cybersecurite"],
  pitch:
    "Étude de la chaîne d'attaque d'un rançongiciel pour concevoir la défense (approche Blue Team).",
  setting: "Travail pratique · Laboratoire isolé",
  cover: {
    src: "https://images.unsplash.com/photo-1581725645226-92ad3b4c16d8",
    author: "Frank R",
    source: "Unsplash",
    url: "https://unsplash.com/photos/SaiJ_n1TvCU",
  },
  notice:
    "Projet défensif et pédagogique (approche Blue Team), réalisé dans un laboratoire isolé sans accès Internet. L'accent est mis sur la détection et les contre-mesures.",

  facts: [
    { label: "Cadre", value: "Travail pratique de cybersécurité" },
    { label: "Environnement", value: "Laboratoire isolé, sans accès Internet" },
    { label: "Approche", value: "Défensive (Blue Team)" },
  ],

  context:
    "Travail pratique de cybersécurité réalisé dans un environnement de laboratoire isolé : deux machines virtuelles sur un réseau cloisonné, sans accès Internet. Un projet défensif et pédagogique : comprendre la menace pour mieux la détecter et s'en protéger.",

  sections: [
    {
      title: "Objectif",
      items: [
        "Comprendre les étapes d'une attaque par rançongiciel : préparation, chiffrement des fichiers, persistance, note de rançon.",
        "Travailler dans un environnement de test cloisonné : deux machines virtuelles, réseau isolé sans accès Internet.",
      ],
    },
    {
      title: "Études de cas réelles",
      items: [
        "WannaCry (2017) : propagation via l'exploit EternalBlue, avec un fort impact sur le système de santé britannique.",
        "LockBit : modèle Ransomware-as-a-Service (RaaS) et vitesse de chiffrement.",
      ],
    },
    {
      title: "Contre-mesures",
      highlight: true,
      intro: "Le cœur du projet : détecter l'attaque au plus tôt et limiter ses dégâts.",
      items: [
        "Supervision centralisée avec surveillance d'intégrité des fichiers (FIM) via Wazuh, pour détecter la création massive de fichiers chiffrés.",
        "Alertes sur la modification des clés de démarrage, signe d'une tentative de persistance.",
        "Principe du moindre privilège.",
        "Filtrage des exécutables non signés.",
        "Stratégie de sauvegarde selon la règle 3-2-1 : 3 copies, sur 2 supports différents, dont 1 hors site.",
      ],
    },
    {
      title: "Indicateurs de compromission (IoC)",
      intro: "Des signaux utiles à une équipe de réponse à incident :",
      items: [
        "Type d'extension ajoutée aux fichiers chiffrés.",
        "Présence d'une note de rançon.",
        "Processus suspect.",
      ],
    },
  ],

  results: [
    "Chaîne d'attaque d'un rançongiciel comprise étape par étape, en environnement isolé.",
    "Contre-mesures de détection et de prévention définies, avec la supervision Wazuh (FIM) au centre.",
    "Indicateurs de compromission identifiés pour la réponse à incident.",
  ],

  tech: ["Wazuh (FIM)", "Analyse d'IoC", "VMware", "Python", "Environnement isolé"],

  bts: [
    {
      competency: "b3-securiser",
      evidence: "Moindre privilège et filtrage des exécutables non signés.",
    },
    {
      competency: "b3-dic",
      evidence: "Sauvegardes 3-2-1 et détection des fichiers chiffrés via Wazuh (FIM).",
    },
    {
      competency: "b3-infrastructure",
      evidence: "Supervision centralisée et identification d'indicateurs de compromission.",
    },
  ],
};

export default project;
