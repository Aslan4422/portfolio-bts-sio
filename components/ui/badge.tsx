import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variants = {
  /** Étiquette technique neutre (techno, outil). */
  default: "border-line bg-surface/70 text-fg-secondary",
  /** Badge « actif » doré, à utiliser avec parcimonie (ex. Projet phare). */
  accent: "border-accent/40 bg-accent/10 text-accent-light",
};

const sizes = {
  /** Taille courante (cartes, fiches). */
  sm: "px-2 py-0.5 text-xs",
  /** Un peu plus grand (section Compétences). */
  md: "px-2.5 py-1 text-[0.8rem]",
};

type BadgeProps = ComponentProps<"span"> & { variant?: keyof typeof variants; size?: keyof typeof sizes };

/** Petite étiquette en police mono. */
export function Badge({ className, variant = "default", size = "sm", ...props }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center rounded-md border font-mono", sizes[size], variants[variant], className)}
      {...props}
    />
  );
}
