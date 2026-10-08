/*
 * Modèles des données du portfolio.
 * Ces « types » décrivent la forme attendue de chaque contenu : si un champ
 * obligatoire manque dans un fichier de content/, l'éditeur le souligne en rouge
 * et le build échoue avant la mise en ligne.
 */

/** Icônes disponibles pour les projets et les compétences (voir components/ui/content-icon.tsx). */
export type IconName =
  | "briefcase"
  | "shield-check"
  | "network"
  | "brick-wall"
  | "flag"
  | "server"
  | "code"
  | "wrench"
  | "users"
  | "radar"
  | "plug"
  | "scale"
  | "siren"
  | "bug"
  | "book-open"
  | "layers"
  | "graduation-cap"
  | "mail";

/* ------------------------------------------------------------------ */
/* Référentiel BTS SIO                                                 */
/* ------------------------------------------------------------------ */

export type BtsBlockId = 1 | 2 | 3;

export type BtsCompetencyId =
  // Bloc 1 — Support et mise à disposition de services informatiques
  | "b1-patrimoine"
  | "b1-incidents"
  | "b1-service"
  | "b1-projet"
  // Bloc 2 — Administration des systèmes et des réseaux
  | "b2-concevoir"
  | "b2-installer"
  | "b2-exploiter"
  // Bloc 3 — Cybersécurité des services informatiques
  | "b3-securiser"
  | "b3-dic"
  | "b3-infrastructure";

export type BtsBlock = {
  id: BtsBlockId;
  title: string;
  competencies: { id: BtsCompetencyId; label: string }[];
};

/** Une compétence du référentiel mobilisée par un projet, avec la preuve concrète. */
export type BtsEvidence = {
  competency: BtsCompetencyId;
  /** Ce qui, dans le projet, démontre cette compétence (une phrase). */
  evidence: string;
};

/* ------------------------------------------------------------------ */
/* Projets                                                             */
/* ------------------------------------------------------------------ */

/** Domaines = onglets de la section Projets (voir content/projects/index.ts). */
export type ProjectDomain = "systemes-reseaux" | "cybersecurite";

/** Une information clé affichée dans la fiche projet (ex. Entreprise, Période). */
export type ProjectFact = { label: string; value: string };

/** Un bloc de la fiche détaillée : un titre, une phrase d'introduction facultative et une liste. */
export type ProjectSection = {
  title: string;
  intro?: string;
  items: string[];
  /** true pour mettre ce bloc en valeur (encadré), ex. le cœur du projet. */
  highlight?: boolean;
};

/**
 * Photo d'en-tête de la carte et de la fiche : image générique d'illustration
 * (photo libre de droits), purement décorative. Elle est créditée dans la fiche projet.
 */
export type ProjectCover = {
  /**
   * Adresse de l'image : sur images.unsplash.com (voir next.config.ts),
   * ou fichier rangé dans public/, ex. "/images/projets/photo.jpg".
   */
  src: string;
  /** Photographe. */
  author: string;
  /** Site d'origine de la photo, ex. « Unsplash » ou « Wikimedia Commons ». */
  source: string;
  /** Page de la photo sur son site d'origine. */
  url: string;
  /** Licence à citer quand elle l'exige (ex. CC BY-SA). Inutile pour Unsplash. */
  license?: { name: string; url: string };
};

export type Project = {
  /** Identifiant dans l'adresse : /projets/<slug>. Minuscules, chiffres et tirets uniquement. */
  slug: string;
  title: string;
  /** Onglet(s) où le projet apparaît. */
  domains: ProjectDomain[];
  /** Phrase courte affichée sur la carte. */
  pitch: string;
  /** Ligne de contexte courte affichée dans la fiche, ex. « Stage en entreprise · Mai – juillet 2026 ». */
  setting: string;
  cover: ProjectCover;
  /** Informations clés : cadre, rôle, entreprise, période… */
  facts: ProjectFact[];
  /** Encadré facultatif affiché en tête de la fiche. */
  notice?: string;
  /** Paragraphe « Contexte » de la fiche. */
  context: string;
  /** Démarche, réalisations, notions… dans l'ordre d'affichage. */
  sections: ProjectSection[];
  results: string[];
  /** Technologies et outils (badges). Les 4 premiers sont affichés sur la carte. */
  tech: string[];
  /** Compétences du référentiel BTS SIO couvertes (bloc replié dans la fiche). */
  bts: BtsEvidence[];
};

/* ------------------------------------------------------------------ */
/* Compétences, parcours, veille                                       */
/* ------------------------------------------------------------------ */

export type SkillFamily = {
  title: string;
  icon: IconName;
  items: string[];
  /** true pour les qualités humaines (affichées sans style « techno »). */
  soft?: boolean;
};

export type TimelineItem = {
  period: string;
  kind: "formation" | "stage" | "certification";
  title: string;
  organization?: string;
  place?: string;
  description?: string;
  current?: boolean;
  /** Projet associé (son slug) : un lien ouvre sa fiche, ex. "stage-wazuh-ntfs". */
  project?: string;
};

export type VeilleTheme = {
  title: string;
  description: string;
  tags: string[];
  icon: IconName;
  /** Projet en lien avec ce thème (slug). */
  relatedProject?: string;
};

export type VeilleSource = {
  name: string;
  /** Qui publie. */
  publisher: string;
  /** Pourquoi je l'ai retenue. */
  description: string;
  icon: IconName;
  url: string;
};
