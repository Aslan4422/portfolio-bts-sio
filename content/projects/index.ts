import type { Project, ProjectDomain } from "../types";

import stageWazuhNtfs from "./stage-wazuh-ntfs";
import durcissementAnssi from "./durcissement-anssi";
import infrastructureReseau from "./infrastructure-reseau";
import analyseRansomware from "./analyse-ransomware";
import laboStormshield from "./labo-stormshield";
import ctfCybersecurite from "./ctf-cybersecurite";

/*
 * AJOUTER UN PROJET :
 * 1. Dupliquez un fichier de ce dossier (ex. labo-stormshield.ts) et renommez-le.
 * 2. Remplissez ses champs (le slug doit être unique ; choisissez son ou ses onglets dans « domains »).
 * 3. Importez-le en haut de ce fichier, puis ajoutez-le dans la liste ci-dessous.
 *
 * L'ordre de la liste = l'ordre d'affichage dans chaque onglet.
 */
export const projects: Project[] = [
  stageWazuhNtfs,
  durcissementAnssi,
  infrastructureReseau,
  analyseRansomware,
  laboStormshield,
  ctfCybersecurite,
];

/** Onglets de la section Projets, dans l'ordre d'affichage (le premier est ouvert par défaut). */
export const projectDomains: { id: ProjectDomain; label: string }[] = [
  { id: "systemes-reseaux", label: "Systèmes & réseaux" },
  { id: "cybersecurite", label: "Cybersécurité" },
];

export function getProjectsByDomain(domain: ProjectDomain): Project[] {
  return projects.filter((p) => p.domains.includes(domain));
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
