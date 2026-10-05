/*
 * Données des projets (content/projects/) : chaque fiche doit être complète et cohérente.
 * Ces tests échouent si, en ajoutant ou modifiant un projet, un champ est oublié
 * ou mal rempli (slug en double, photo manquante, compétence BTS inconnue…).
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { findBtsCompetency } from "@/content/bts";
import { getProjectBySlug, getProjectsByDomain, projectDomains, projects } from "@/content/projects";

const SLUG_FORMAT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const filled = (value: string) => value.trim().length > 0;

describe("Liste des projets", () => {
  it("contient au moins un projet", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("n'a aucun slug en double", () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("n'a aucun titre en double", () => {
    const titles = projects.map((project) => project.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("n'utilise que des onglets connus, et chaque onglet affiche au moins un projet", () => {
    const domainIds = projectDomains.map((domain) => domain.id);
    expect(new Set(domainIds).size).toBe(domainIds.length);
    for (const domain of domainIds) {
      expect(getProjectsByDomain(domain).length, `onglet « ${domain} » vide`).toBeGreaterThan(0);
    }
  });

  it("affiche chaque projet dans au moins un onglet", () => {
    const shown = new Set(projectDomains.flatMap((domain) => getProjectsByDomain(domain.id)));
    expect(shown.size).toBe(projects.length);
  });
});

describe.each(projects.map((project) => [project.slug, project] as const))("Projet « %s »", (_slug, project) => {
  it("a un slug valide pour une adresse web (minuscules, chiffres, tirets)", () => {
    expect(project.slug).toMatch(SLUG_FORMAT);
  });

  it("a un titre, une accroche, un contexte et une ligne de cadre remplis", () => {
    for (const field of [project.title, project.pitch, project.context, project.setting]) {
      expect(filled(field)).toBe(true);
    }
  });

  it("a une accroche assez courte pour une carte et pour Google (160 caractères max)", () => {
    expect(project.pitch.length).toBeLessThanOrEqual(160);
  });

  it("a au moins un outil, sans doublon ni texte vide", () => {
    expect(project.tech.length).toBeGreaterThan(0);
    expect(project.tech.every(filled)).toBe(true);
    expect(new Set(project.tech).size).toBe(project.tech.length);
  });

  it("appartient à un ou plusieurs onglets, sans doublon", () => {
    const known = projectDomains.map((domain) => domain.id);
    expect(project.domains.length).toBeGreaterThan(0);
    expect(new Set(project.domains).size).toBe(project.domains.length);
    for (const domain of project.domains) expect(known).toContain(domain);
  });

  it("a des informations clés (libellé + valeur) remplies", () => {
    expect(project.facts.length).toBeGreaterThan(0);
    for (const fact of project.facts) {
      expect(filled(fact.label) && filled(fact.value)).toBe(true);
    }
  });

  it("a des parties de fiche complètes (titre + au moins un élément)", () => {
    expect(project.sections.length).toBeGreaterThan(0);
    for (const section of project.sections) {
      expect(filled(section.title)).toBe(true);
      expect(section.items.length).toBeGreaterThan(0);
      expect(section.items.every(filled)).toBe(true);
    }
    expect(project.results.every(filled)).toBe(true);
  });

  it("a une photo d'illustration valide et créditée", () => {
    const { cover } = project;
    const isUnsplash = cover.src.startsWith("https://images.unsplash.com/photo-");
    const isLocal = cover.src.startsWith("/images/projets/");
    expect(isUnsplash || isLocal, `adresse de photo inattendue : ${cover.src}`).toBe(true);
    if (isLocal) {
      // La photo rangée dans le site doit exister vraiment dans public/.
      expect(fs.existsSync(path.join(process.cwd(), "public", cover.src))).toBe(true);
    }
    expect(filled(cover.author) && filled(cover.source)).toBe(true);
    expect(cover.url).toMatch(/^https:\/\//);
    // Hors Unsplash (ex. Creative Commons), la licence doit être citée avec son lien.
    if (cover.source !== "Unsplash") {
      expect(cover.license, "licence manquante").toBeDefined();
      expect(cover.license?.url).toMatch(/^https:\/\//);
    }
  });

  it("ne cite que des compétences du référentiel BTS SIO, sans doublon, avec une preuve", () => {
    expect(project.bts.length).toBeGreaterThan(0);
    const ids = project.bts.map((item) => item.competency);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of project.bts) {
      expect(findBtsCompetency(item.competency), `compétence inconnue : ${item.competency}`).toBeDefined();
      expect(filled(item.evidence)).toBe(true);
    }
  });

  it("est retrouvé par son slug", () => {
    expect(getProjectBySlug(project.slug)).toBe(project);
  });
});

describe("Recherche d'un projet par son slug (cas limites)", () => {
  it.each(["inexistant", "", " ", "LABO-STORMSHIELD", "labo-stormshield/", "../labo-stormshield", "projets/labo-stormshield"])(
    "ne trouve rien pour « %s »",
    (slug) => {
      expect(getProjectBySlug(slug)).toBeUndefined();
    },
  );
});
