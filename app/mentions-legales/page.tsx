import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { homeOpenGraph, openGraphBase } from "@/lib/seo";

/*
 * Mentions légales (obligatoires pour tout site publié en France, loi LCEN)
 * et informations sur les données personnelles (RGPD).
 * À relire après chaque changement d'hébergeur, de formulaire ou d'outil.
 */

const UPDATED_ON = "5 octobre 2026";
const description = `Mentions légales et données personnelles du portfolio d'${site.name}.`;

export const metadata: Metadata = {
  title: "Mentions légales",
  description,
  alternates: { canonical: "/mentions-legales" },
  openGraph: {
    ...openGraphBase,
    url: "/mentions-legales",
    title: `Mentions légales · ${site.name}`,
    description,
    images: homeOpenGraph.images,
  },
  // Page utile mais sans intérêt dans les résultats de recherche.
  robots: { index: false, follow: true },
};

function LegalSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`${id}-titre`} id={id} className="space-y-3">
      <h2 id={`${id}-titre`} className="flex items-center gap-3 text-xl font-semibold tracking-tight text-fg">
        <span aria-hidden="true" className="h-5 w-1 shrink-0 rounded-full bg-accent" />
        {title}
      </h2>
      <div className="space-y-3 leading-relaxed text-fg-secondary">{children}</div>
    </section>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-fg underline decoration-line-strong underline-offset-2 transition-colors hover:text-accent-light"
    >
      {children}
      <span className="sr-only"> (nouvel onglet)</span>
    </a>
  );
}

const mailLink = (
  <a
    href={`mailto:${site.contact.email}`}
    className="text-fg underline decoration-line-strong underline-offset-2 transition-colors hover:text-accent-light"
  >
    {site.contact.email}
  </a>
);

export default function LegalNoticePage() {
  return (
    <article aria-labelledby="mentions-titre" className="pt-28 pb-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="inline-flex min-h-6 items-center gap-1.5 rounded-md text-sm font-medium text-accent-light"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Retour à l&apos;accueil
          </Link>

          <h1 id="mentions-titre" className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            Mentions légales
          </h1>
          <span aria-hidden="true" className="mt-3 block h-1 w-14 rounded-full bg-linear-to-r from-accent to-accent-light" />
          <p className="mt-4 text-sm text-fg-muted">Dernière mise à jour : {UPDATED_ON}</p>

          <div className="mt-12 space-y-12">
            <LegalSection id="editeur" title="Éditeur du site">
              <p>
                Ce site est le portfolio personnel d&apos;{site.name}, particulier, étudiant en BTS SIO option SISR
                ({site.location}). Il est aussi le directeur de la publication.
              </p>
              <p>Contact : {mailLink}</p>
            </LegalSection>

            <LegalSection id="hebergeur" title="Hébergeur">
              <p>
                Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis —{" "}
                <ExternalLink href="https://vercel.com">vercel.com</ExternalLink>.
              </p>
            </LegalSection>

            <LegalSection id="donnees-personnelles" title="Données personnelles">
              <p>
                Le site ne collecte des données personnelles que par le formulaire de contact : votre nom, votre
                adresse e-mail, le sujet et le message que vous saisissez.
              </p>
              <ul className="list-disc space-y-2 pl-5 marker:text-accent">
                <li>
                  <strong className="font-medium text-fg">Responsable du traitement :</strong> {site.name},{" "}
                  {mailLink}.
                </li>
                <li>
                  <strong className="font-medium text-fg">Finalité :</strong> uniquement vous répondre. Vos données
                  ne sont ni vendues, ni cédées, ni utilisées à d&apos;autres fins.
                </li>
                <li>
                  <strong className="font-medium text-fg">Base légale :</strong> votre consentement, exprimé en
                  envoyant le formulaire.
                </li>
                <li>
                  <strong className="font-medium text-fg">Destinataires :</strong> {site.name} uniquement. Le
                  message est acheminé par le service Formspree, Inc., situé aux États-Unis, qui le transmet par
                  e-mail : vos données peuvent donc être traitées hors de l&apos;Union européenne (voir la{" "}
                  <ExternalLink href="https://formspree.io/legal/privacy-policy/">
                    politique de confidentialité de Formspree
                  </ExternalLink>
                  ).
                </li>
                <li>
                  <strong className="font-medium text-fg">Durée de conservation :</strong> le temps de notre
                  échange, puis au plus 12 mois après le dernier message.
                </li>
              </ul>
              <p>
                Vous pouvez à tout moment demander l&apos;accès à vos données, leur rectification ou leur
                suppression, ou vous opposer à leur traitement, en écrivant à {mailLink}. Vous pouvez aussi
                adresser une réclamation à la CNIL (<ExternalLink href="https://www.cnil.fr">cnil.fr</ExternalLink>).
              </p>
              <p>
                Comme tout hébergeur, Vercel enregistre des journaux techniques (adresse IP, date, page demandée)
                nécessaires au fonctionnement et à la sécurité du service.
              </p>
            </LegalSection>

            <LegalSection id="cookies" title="Cookies">
              <p>
                Ce site ne dépose aucun cookie et n&apos;utilise aucun outil de mesure d&apos;audience ni de
                publicité. Aucun bandeau de consentement n&apos;est donc nécessaire.
              </p>
            </LegalSection>

            <LegalSection id="credits" title="Propriété intellectuelle et crédits">
              <p>
                Les textes et le code du site sont la propriété d&apos;{site.name}. Le code source est consultable sur{" "}
                <ExternalLink href={site.repository}>GitHub</ExternalLink>.
              </p>
              <p>Photos d&apos;illustration des projets :</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-accent">
                {projects.map(({ slug, title, cover }) => (
                  <li key={slug}>
                    {title} : <ExternalLink href={cover.url}>{cover.author}</ExternalLink> / {cover.source}
                    {cover.license ? (
                      <>
                        {" "}
                        (licence <ExternalLink href={cover.license.url}>{cover.license.name}</ExternalLink>)
                      </>
                    ) : (
                      cover.source === "Unsplash" && " (licence Unsplash)"
                    )}
                  </li>
                ))}
              </ul>
              <p>
                Police de caractères Geist (licence SIL Open Font License) et icônes Lucide (licence ISC).
              </p>
            </LegalSection>

            <LegalSection id="liens" title="Liens externes">
              <p>
                Le site contient des liens vers d&apos;autres sites (LinkedIn, GitHub, sources de veille…). Leur
                contenu n&apos;engage pas l&apos;éditeur de ce site.
              </p>
            </LegalSection>
          </div>
        </div>
      </Container>
    </article>
  );
}
