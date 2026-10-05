import Image from "next/image";
import { cn } from "@/lib/utils";

type ProjectCoverProps = {
  src: string;
  /** Largeur d'affichage (attribut sizes) : le navigateur choisit la bonne résolution. */
  sizes: string;
  className?: string;
  /** true pour l'image visible dès l'ouverture (fiche projet) : chargement prioritaire. */
  priority?: boolean;
};

/**
 * Photo d'illustration d'un projet, affichée avec ses couleurs d'origine.
 * Purement décorative (alt vide) : elle n'est pas annoncée par les lecteurs d'écran.
 */
export function ProjectCover({ src, sizes, className, priority }: ProjectCoverProps) {
  return (
    <div className={cn("relative overflow-hidden bg-canvas-deep", className)}>
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
      />
    </div>
  );
}
