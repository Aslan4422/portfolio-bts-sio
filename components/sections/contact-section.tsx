import { Mail, MapPin } from "lucide-react";
import { site } from "@/content/site";
import { ContactForm } from "@/components/contact/contact-form";
import { Reveal } from "@/components/motion/reveal";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/brand-icons";

const socialLinks = [
  { label: "LinkedIn", href: site.contact.linkedin, icon: LinkedInIcon },
  { label: "GitHub", href: site.contact.github, icon: GitHubIcon },
];

/** Contenu de la section « Contact » : présentation et coordonnées à gauche, formulaire à droite. */
export function ContactSection() {
  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
      <div>
        <h3 className="text-2xl font-semibold tracking-tight text-fg">Pour toute question ou opportunité</h3>
        <p className="mt-4 max-w-lg leading-relaxed text-fg-secondary">
          N&apos;hésitez pas à me contacter pour échanger sur mes projets en administration systèmes, réseaux et
          cybersécurité, ou pour toute opportunité professionnelle.
        </p>

        <ul className="mt-8 space-y-6">
          <li className="flex items-start gap-4">
            <Mail aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent-light" />
            <div className="min-w-0">
              <p className="font-semibold text-fg">E-mail</p>
              <a
                href={`mailto:${site.contact.email}`}
                className="mt-0.5 block break-all text-fg-secondary transition-colors hover:text-accent-light"
              >
                {site.contact.email}
              </a>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent-light" />
            <div>
              <p className="font-semibold text-fg">Localisation</p>
              <p className="mt-0.5 text-fg-secondary">{site.location}</p>
            </div>
          </li>
        </ul>

        <p className="mt-10 font-semibold text-fg">Retrouvez-moi sur</p>
        <ul className="mt-3 flex items-center gap-2">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${link.label} (nouvel onglet)`}
                  className="-ml-1 inline-flex size-10 items-center justify-center rounded-lg text-fg transition-colors hover:text-accent-light"
                >
                  <Icon aria-hidden="true" className="size-6" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <Reveal>
        <ContactForm />
      </Reveal>
    </div>
  );
}
