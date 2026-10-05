/*
 * Informations générales du site : identité, accroche, contact, menu.
 * Modifiez les textes entre guillemets ; ne changez pas les noms à gauche des « : ».
 */

/** Titre principal du haut de page, en deux morceaux : le second est affiché en or. */
const roleLead = "Administration systèmes, réseaux";
const roleAccent = "et sécurité des infrastructures";

export const site = {
  name: "Erhan Aslan",
  /** Titre de l'onglet du navigateur sur la page d'accueil. */
  title: "Erhan Aslan — Portfolio BTS SIO SISR",
  /** Initiales des images d'aperçu (liens partagés) et de l'icône d'écran d'accueil. */
  initials: "EA",
  /**
   * Photo de la bulle du haut de page : carrée, visage au centre, sans métadonnées
   * (ni date, ni appareil, ni position GPS). Pour la changer, voir GUIDE.md.
   */
  photo: { src: "/images/photo-erhan.jpg", alt: "Portrait d'Erhan Aslan" },
  roleLead,
  roleAccent,
  /** Titre complet (référencement, aperçus de liens). */
  role: `${roleLead} ${roleAccent}`,
  /** Présentation affichée en tête de la section « À propos ». */
  tagline:
    "Passionné par l'administration système et la cybersécurité, j'aime comprendre comment une infrastructure fonctionne pour mieux la protéger. En BTS SIO option SISR, j'administre des environnements Windows Server, Active Directory et Linux ; en stage, j'ai mis en place le SIEM Wazuh et remis de l'ordre dans les droits d'accès d'un serveur de fichiers. Ce qui m'attire le plus : la cybersécurité défensive, repérer une attaque et la contenir avant qu'elle ne fasse des dégâts.",
  /**
   * Description courte du site (environ 160 caractères) : texte sous le titre
   * dans les résultats Google et dans les aperçus de liens partagés.
   */
  description:
    "Portfolio d'Erhan Aslan, étudiant en BTS SIO SISR : systèmes et réseaux, Active Directory, durcissement ANSSI, supervision Wazuh et cybersécurité défensive.",
  /** Localisation affichée dans la section Contact (jamais d'adresse précise). */
  location: "Île-de-France",

  contact: {
    email: "erhan.aslan.sio442@gmail.com",
    linkedin: "https://linkedin.com/in/erhan-aslan-028546382",
    github: "https://github.com/Aslan4422",
  },

  /** Code source de ce site (lien du pied de page). */
  repository: "https://github.com/Aslan4422/portfolio-bts-sio",

  /** CV : déposer le fichier PDF sous ce nom dans le dossier public/. */
  cvFile: "cv-erhan-aslan.pdf",
} as const;

/** Liens du menu (l'identifiant après # doit correspondre à l'id de la section). */
export const navigation = [
  { label: "À propos", id: "a-propos" },
  { label: "Compétences", id: "competences" },
  { label: "Projets", id: "projets" },
  { label: "Veille", id: "veille" },
  { label: "Contact", id: "contact" },
] as const;

export type SectionId = (typeof navigation)[number]["id"];
