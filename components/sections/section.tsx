import type { ReactNode } from "react";
import type { SectionId } from "@/content/site";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

type SectionProps = {
  id: SectionId;
  title: string;
  /** Phrase d'introduction sous le titre. */
  description?: string;
  children: ReactNode;
  className?: string;
};

/** Section de la page d'accueil : ancre pour le menu, titre et éventuelle phrase d'introduction. */
export function Section({ id, title, description, children, className }: SectionProps) {
  const titleId = `${id}-titre`;
  return (
    <section id={id} aria-labelledby={titleId} className={cn("py-20 sm:py-24", className)}>
      <Container>
        <header>
          {/* tabIndex -1 : reçoit le focus quand on arrive par un lien du menu (voir SiteHeader). */}
          <h2
            id={titleId}
            tabIndex={-1}
            className="text-2xl font-semibold tracking-tight outline-none sm:text-3xl"
          >
            {title}
          </h2>
          {/* Petite barre dorée sous le titre. */}
          <span aria-hidden="true" className="mt-3 block h-1 w-14 rounded-full bg-linear-to-r from-accent to-accent-light" />
          {description && <p className="mt-3 max-w-2xl text-fg-secondary">{description}</p>}
        </header>
        <div className="mt-10">{children}</div>
      </Container>
    </section>
  );
}
