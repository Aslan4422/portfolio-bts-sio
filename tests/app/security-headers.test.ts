/*
 * En-têtes de sécurité et réglages des images (next.config.ts).
 * Ils sont calculés au chargement de la configuration, selon l'environnement :
 * développement, production, ou prévisualisation Vercel.
 */
import { describe, expect, it, vi } from "vitest";
import { projects } from "@/content/projects";
import { getFormspreeEndpoint } from "@/lib/contact";

type Env = { NODE_ENV: string; VERCEL_ENV?: string };

/** Charge la configuration pour un environnement donné. */
async function loadConfig(env: Env) {
  vi.stubEnv("NODE_ENV", env.NODE_ENV);
  vi.stubEnv("VERCEL_ENV", env.VERCEL_ENV ?? "");
  vi.resetModules();
  return (await import("@/next.config")).default;
}

/** En-têtes envoyés avec chaque page, sous forme { nom: valeur }. */
async function headersFor(env: Env) {
  const config = await loadConfig(env);
  const rules = await config.headers!();
  expect(rules).toHaveLength(1);
  expect(rules[0].source).toBe("/:path*");
  return Object.fromEntries(rules[0].headers.map((header) => [header.key, header.value]));
}

/** Politique CSP découpée en directives : { "connect-src": ["'self'", …], … }. */
async function cspFor(env: Env) {
  const csp = (await headersFor(env))["Content-Security-Policy"];
  return Object.fromEntries(
    csp.split("; ").map((directive) => {
      const [name, ...values] = directive.split(" ");
      return [name, values];
    }),
  ) as Record<string, string[]>;
}

const formspreeOrigin = new URL(getFormspreeEndpoint("abc")!).origin;

describe("Politique de sécurité du contenu (CSP) en production", () => {
  it.each([{ NODE_ENV: "production", VERCEL_ENV: "production" }, { NODE_ENV: "production", VERCEL_ENV: "preview" }])(
    "laisse le formulaire joindre Formspree, avec et sans JavaScript (%o)",
    async (env) => {
      const csp = await cspFor(env);
      expect(csp["connect-src"]).toContain(formspreeOrigin); // envoi avec JavaScript
      expect(csp["form-action"]).toContain(formspreeOrigin); // envoi sans JavaScript
    },
  );

  it("bloque tout le reste : cadres, plugins, balise <base>, scripts externes", async () => {
    const csp = await cspFor({ NODE_ENV: "production", VERCEL_ENV: "production" });
    expect(csp["default-src"]).toEqual(["'self'"]);
    expect(csp["frame-ancestors"]).toEqual(["'none'"]);
    expect(csp["frame-src"]).toEqual(["'none'"]);
    expect(csp["object-src"]).toEqual(["'none'"]);
    expect(csp["base-uri"]).toEqual(["'self'"]);
    expect(csp["script-src"]).toEqual(["'self'", "'unsafe-inline'"]);
    expect(csp["form-action"]).toEqual(["'self'", formspreeOrigin]);
  });

  it("n'autorise jamais 'unsafe-eval' ni les WebSockets en production", async () => {
    const csp = await cspFor({ NODE_ENV: "production", VERCEL_ENV: "production" });
    expect(csp["script-src"]).not.toContain("'unsafe-eval'");
    expect(csp["connect-src"].join(" ")).not.toMatch(/ws:|wss:/);
  });

  it("n'ouvre la barre d'outils Vercel que sur les prévisualisations", async () => {
    const production = await cspFor({ NODE_ENV: "production", VERCEL_ENV: "production" });
    const preview = await cspFor({ NODE_ENV: "production", VERCEL_ENV: "preview" });
    expect(Object.values(production).flat().join(" ")).not.toContain("vercel.live");
    expect(preview["script-src"]).toContain("https://vercel.live");
    expect(preview["frame-src"]).toEqual(["https://vercel.live"]);
  });

  it("en développement, autorise le rechargement à chaud (unsafe-eval, WebSockets)", async () => {
    const csp = await cspFor({ NODE_ENV: "development" });
    expect(csp["script-src"]).toContain("'unsafe-eval'");
    expect(csp["connect-src"]).toEqual(expect.arrayContaining(["ws:", "wss:"]));
  });
});

describe("Autres en-têtes de sécurité", () => {
  it("sont tous présents, avec les valeurs attendues", async () => {
    const headers = await headersFor({ NODE_ENV: "production", VERCEL_ENV: "production" });
    expect(headers).toMatchObject({
      "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
      "Cross-Origin-Opener-Policy": "same-origin",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Frame-Options": "DENY",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    });
  });

  it("ne révèlent pas la technologie du serveur (pas d'en-tête X-Powered-By)", async () => {
    expect((await loadConfig({ NODE_ENV: "production" })).poweredByHeader).toBe(false);
  });
});

describe("Optimisation des images", () => {
  it("n'accepte que les photos Unsplash réellement utilisées par les projets", async () => {
    const { images } = await loadConfig({ NODE_ENV: "production" });
    const allowed = (images?.remotePatterns ?? []).map((pattern) =>
      pattern instanceof URL ? pattern.pathname : `${pattern.hostname}${pattern.pathname}`,
    );
    const used = projects
      .map((project) => project.cover.src)
      .filter((src) => src.startsWith("https://images.unsplash.com/"))
      .map((src) => src.replace("https://", ""));
    expect(allowed.sort()).toEqual(used.sort());
    expect(allowed.some((pattern) => pattern.includes("*"))).toBe(false);
  });

  it("n'accepte qu'une qualité et seulement les photos rangées dans images/projets", async () => {
    const { images } = await loadConfig({ NODE_ENV: "production" });
    expect(images?.qualities).toEqual([75]);
    expect(images?.localPatterns).toEqual([{ pathname: "/images/projets/**", search: "" }]);
    expect(images?.minimumCacheTTL).toBe(2_678_400);
  });
});
