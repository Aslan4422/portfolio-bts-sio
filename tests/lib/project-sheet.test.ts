// @vitest-environment jsdom
/*
 * Ouverture d'une fiche projet depuis une autre section (parcours, veille) :
 * un lien envoie un signal, la section Projets le reçoit et ouvre la bonne fiche.
 */
import { expect, it, vi } from "vitest";
import { onOpenProjectSheet, openProjectSheet } from "@/lib/project-sheet";

it("transmet le projet demandé à la section Projets", () => {
  const open = vi.fn();
  const stop = onOpenProjectSheet(open);
  openProjectSheet("labo-stormshield");
  expect(open).toHaveBeenCalledWith("labo-stormshield");
  stop();
});

it("n'ouvre plus rien une fois l'écoute arrêtée (pas de fuite de mémoire)", () => {
  const open = vi.fn();
  const stop = onOpenProjectSheet(open);
  stop();
  openProjectSheet("labo-stormshield");
  expect(open).not.toHaveBeenCalled();
});
