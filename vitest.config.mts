import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/*
 * Configuration des tests automatiques (Vitest).
 * Lancer tous les tests : npm test   ·   en continu pendant le travail : npm run test:watch
 * Par défaut les tests tournent dans Node.js ; un fichier qui commence par
 * « // @vitest-environment jsdom » est exécuté dans un faux navigateur (jsdom).
 */
export default defineConfig({
  resolve: {
    // Même raccourci que tsconfig.json : « @/lib/contact » = « ./lib/contact ».
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  // Les composants React (.tsx) sont compilés avec le JSX automatique de React 19.
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    environment: "node",
    include: ["tests/**/*.test.{ts,tsx}"],
    setupFiles: ["tests/setup.ts"],
    // Chaque test repart de zéro : faux objets et variables d'environnement remis à l'état initial.
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    coverage: {
      provider: "v8",
      include: ["lib/**/*.{ts,tsx}", "content/**/*.ts", "app/**/*.{ts,tsx}", "components/contact/**/*.tsx"],
      reporter: ["text", "html"],
    },
  },
});
