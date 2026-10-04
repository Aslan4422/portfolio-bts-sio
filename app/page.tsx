import { ArrowRight, Download, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Monogram } from "@/components/ui/monogram";

/*
 * PAGE PROVISOIRE — Étape 1 (fondations).
 * Elle présente le thème (couleurs, polices, composants de base) pour validation.
 * Elle sera remplacée par la vraie page d'accueil à l'étape 2.
 */

const palette = [
  { name: "Fond principal", token: "canvas", hex: "#0D0A17", swatch: "bg-canvas" },
  { name: "Surfaces / cartes", token: "surface", hex: "#1B1730", swatch: "bg-surface" },
  { name: "Bordure discrète", token: "line", hex: "#26215C", swatch: "bg-line" },
  { name: "Bordure marquée", token: "line-strong", hex: "#3C3489", swatch: "bg-line-strong" },
  { name: "Violet accent", token: "accent", hex: "#534AB7", swatch: "bg-accent" },
  { name: "Violet survol bouton", token: "accent-hover", hex: "#5C53BF", swatch: "bg-accent-hover", derived: true },
  { name: "Violet clair", token: "accent-light", hex: "#7F77DD", swatch: "bg-accent-light" },
  { name: "Texte principal", token: "fg", hex: "#F5F3FF", swatch: "bg-fg" },
  { name: "Texte secondaire", token: "fg-secondary", hex: "#AFA9EC", swatch: "bg-fg-secondary" },
  { name: "Texte atténué", token: "fg-muted", hex: "#9089C4", swatch: "bg-fg-muted" },
];

const sampleTechs = ["Wazuh", "Active Directory", "PowerShell", "Debian"];

export default function ThemePreviewPage() {
  return (
    <main className="relative min-h-screen overflow-hidden py-16 sm:py-24">
      {/* Halo violet très discret en haut de page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-80 max-w-3xl rounded-full bg-accent/20 blur-3xl"
      />

      <Container className="relative space-y-20">
        <header className="space-y-6">
          <div className="flex items-center gap-3">
            <Monogram />
            <span className="font-medium">Erhan Aslan</span>
            <Badge className="ml-auto">étape 1 · fondations</Badge>
          </div>
          <div className="max-w-2xl space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Thème du portfolio</h1>
            <p className="text-fg-secondary">
              Page provisoire pour valider les couleurs, les polices et les composants de base. Elle sera
              remplacée par la page d&apos;accueil à l&apos;étape 2.
            </p>
          </div>
        </header>

        <section aria-labelledby="palette-title" className="space-y-6">
          <h2 id="palette-title" className="text-xl font-semibold tracking-tight">
            Palette de couleurs
          </h2>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {palette.map((color) => (
              <li key={color.token} className="overflow-hidden rounded-xl border border-line bg-surface">
                <div className={`h-20 border-b border-line ${color.swatch}`} />
                <div className="space-y-1 p-3">
                  <p className="text-sm font-medium">{color.name}</p>
                  <p className="font-mono text-xs text-fg-muted">{color.hex}</p>
                  <p className="font-mono text-xs text-accent-light">{color.token}</p>
                  {color.derived && <p className="text-xs text-fg-muted">Dérivé, pour le contraste</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="typo-title" className="space-y-6">
          <h2 id="typo-title" className="text-xl font-semibold tracking-tight">
            Typographie
          </h2>
          <div className="space-y-5 rounded-2xl border border-line bg-surface/50 p-6 sm:p-8">
            <p className="font-mono text-xs text-fg-muted">Geist Sans · titre</p>
            <p className="text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
              Administration systèmes, réseaux et sécurité des infrastructures
            </p>
            <p className="font-mono text-xs text-fg-muted">Geist Sans · texte secondaire</p>
            <p className="max-w-2xl text-lg text-fg-secondary">
              Cybersécurité défensive (Blue Team) : audit, durcissement et supervision des systèmes.
            </p>
            <p className="font-mono text-xs text-fg-muted">Geist Sans · texte atténué</p>
            <p className="text-sm text-fg-muted">Île-de-France · BTS SIO option SISR</p>
            <p className="font-mono text-xs text-fg-muted">Geist Mono · badges de technos</p>
            <div className="flex flex-wrap gap-2">
              {sampleTechs.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="components-title" className="space-y-6">
          <h2 id="components-title" className="text-xl font-semibold tracking-tight">
            Boutons et carte
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button size="lg">
              Voir mes projets
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button size="lg" variant="secondary">
              <Download aria-hidden="true" />
              Télécharger mon CV
            </Button>
            <Button size="lg" variant="ghost">
              Bouton discret
            </Button>
          </div>

          <Reveal>
            <article className="group max-w-xl rounded-2xl border border-line bg-surface p-6 transition-colors duration-200 hover:border-line-strong">
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg border border-line-strong bg-canvas text-accent-light">
                <ShieldCheck aria-hidden="true" className="size-5" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">Exemple de carte projet</h3>
              <p className="mt-2 text-fg-secondary">
                Cette carte apparaît en fondu au défilement (Framer Motion) et sa bordure s&apos;éclaire au
                survol.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge>Lynis</Badge>
                <Badge>ANSSI BP-028</Badge>
              </div>
            </article>
          </Reveal>
        </section>
      </Container>
    </main>
  );
}
