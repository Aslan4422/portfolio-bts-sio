import type { Project } from "../types";

/*
 * Confidentialité : aucune adresse IP, aucun nom de machine ou de domaine réel,
 * aucun identifiant. Les machines sont décrites par leur rôle.
 */
const project: Project = {
  slug: "durcissement-anssi",
  title: "Durcissement et audit d'infrastructure selon l'ANSSI",
  domains: ["cybersecurite"],
  pitch:
    "Audit, mesure et durcissement d'un parc de 6 machines, avec démarche avant/après et retour arrière maîtrisé.",
  setting: "Atelier de Professionnalisation · Référent sécurité",
  cover: {
    src: "https://images.unsplash.com/photo-1633265486064-086b219458ec",
    author: "Towfiqu barbhuiya",
    source: "Unsplash",
    url: "https://unsplash.com/photos/FnA5pAzqhMM",
  },

  facts: [
    { label: "Cadre", value: "Atelier de Professionnalisation" },
    { label: "Rôle", value: "Référent sécurité" },
    { label: "Périmètre", value: "6 machines Linux et Windows" },
    { label: "Référentiel", value: "ANSSI BP-028" },
  ],

  context:
    "Projet mené dans le cadre de l'Atelier de Professionnalisation, en tant que référent sécurité. Objectif : auditer, mesurer et durcir un parc de 6 machines Linux et Windows, en suivant le référentiel de l'ANSSI, sans jamais interrompre l'exploitation.",

  sections: [
    {
      title: "Parc audité",
      items: [
        "Serveurs Linux : serveur web et serveur de base de données.",
        "Poste d'administration.",
        "Contrôleur de domaine Windows.",
        "Postes clients Windows.",
      ],
    },
    {
      title: "Durcissement Linux",
      items: [
        "Audit Lynis avant et après durcissement.",
        "Application du référentiel ANSSI BP-028.",
        "Fermeture des services superflus.",
        "Durcissement SSH : désactivation de la connexion root, restriction des utilisateurs autorisés, limitation des tentatives.",
        "Vérification du maintien des services critiques.",
      ],
    },
    {
      title: "Analyse Windows et Active Directory",
      items: [
        "Analyse de configuration avec Hardening Kitty.",
        "Détection des faiblesses de l'annuaire Active Directory avec Purple Knight.",
      ],
    },
    {
      title: "Méthode : ne jamais casser l'exploitation",
      highlight: true,
      items: [
        "Instantanés (snapshots) avant toute modification.",
        "Corrections appliquées une par une, avec test du service à chaque étape.",
        "Recommandations écartées documentées et justifiées.",
      ],
    },
  ],

  results: [
    "Score de durcissement Lynis mesuré avant et après, et amélioré.",
    "Services critiques maintenus en fonctionnement pendant tout le durcissement.",
    "Recommandations non appliquées documentées et justifiées.",
  ],

  tech: [
    "Lynis",
    "ANSSI BP-028",
    "Durcissement SSH",
    "Linux (Debian/Ubuntu)",
    "Bash",
    "Proxmox",
    "Hardening Kitty",
    "Purple Knight",
  ],

  bts: [
    {
      competency: "b2-installer",
      evidence: "Corrections appliquées une par une, avec test du service à chaque étape.",
    },
    {
      competency: "b2-exploiter",
      evidence: "Instantanés avant modification et vérification du maintien des services critiques.",
    },
    {
      competency: "b3-securiser",
      evidence: "Durcissement SSH et fermeture des services superflus.",
    },
    {
      competency: "b3-dic",
      evidence: "Détection des faiblesses de l'annuaire Active Directory avec Purple Knight.",
    },
    {
      competency: "b3-infrastructure",
      evidence: "Audit Lynis avant/après et application du référentiel ANSSI BP-028.",
    },
  ],
};

export default project;
