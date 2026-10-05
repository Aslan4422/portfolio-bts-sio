import { clsx, type ClassValue } from "clsx";

/**
 * Assemble des classes CSS, dont certaines conditionnelles :
 * cn("p-4", actif && "text-accent-light") → "p-4 text-accent-light" si actif.
 * Les classes combinées ne doivent pas se contredire (ex. deux largeurs max) :
 * prévoir plutôt une option (variant, size…) dans le composant.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
