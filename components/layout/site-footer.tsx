import { Mail } from "lucide-react";
import Link from "next/link";
import { navigation, site } from "@/content/site";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/brand-icons";
import { Container } from "@/components/ui/container";

const socialLinks = [
  { label: "LinkedIn", href: site.contact.linkedin, icon: LinkedInIcon, external: true },
  { label: "GitHub", href: site.contact.github, icon: GitHubIcon, external: true },
  { label: "E-mail", href: `mailto:${site.contact.email}`, icon: Mail, external: false },
];

/** Pied de page : nom et liens du menu, puis mentions et réseaux. */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <Container className="pt-16 pb-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-2xl font-semibold tracking-tight text-accent-light">{site.name}</p>

          <nav aria-label="Plan du site">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {navigation.map((item) => (
                <li key={item.id}>
                  {/* Hauteur minimale de 24 px : zone de clic confortable (WCAG 2.2). */}
                  <Link
                    href={`/#${item.id}`}
                    className="inline-flex min-h-6 items-center rounded-md text-fg transition-colors hover:text-accent-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1 text-sm text-fg-muted">
            <p>
              © {year} {site.name}. Tous droits réservés.
            </p>
            <p>
              Portfolio réalisé dans le cadre du BTS SIO SISR ·{" "}
              <a
                href={site.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-line-strong underline-offset-2 transition-colors hover:text-accent-light"
              >
                Code source du site
                <span className="sr-only"> (GitHub, nouvel onglet)</span>
              </a>{" "}
              ·{" "}
              <Link
                href="/mentions-legales"
                className="underline decoration-line-strong underline-offset-2 transition-colors hover:text-accent-light"
              >
                Mentions légales
              </Link>
            </p>
          </div>

          <ul className="-mr-2 flex items-center gap-1">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    aria-label={link.external ? `${link.label} (nouvel onglet)` : link.label}
                    className="inline-flex size-10 items-center justify-center rounded-lg text-fg transition-colors hover:text-accent-light"
                  >
                    <Icon aria-hidden="true" className="size-5" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
