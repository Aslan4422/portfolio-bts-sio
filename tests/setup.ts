/*
 * Préparation commune à tous les tests.
 * - Ajoute des vérifications lisibles pour les pages (toBeInTheDocument, toHaveFocus…).
 * - Après chaque test, retire du faux navigateur ce qui a été affiché.
 */
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

afterEach(async () => {
  // Seulement dans les tests qui simulent un navigateur (jsdom).
  if (typeof document !== "undefined") {
    const { cleanup } = await import("@testing-library/react");
    cleanup();
  }
});
