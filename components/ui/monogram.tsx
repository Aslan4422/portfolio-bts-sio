import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "xl";

const sizes: Record<Size, string> = {
  sm: "size-8 rounded-lg text-[0.8rem]",
  md: "size-10 rounded-xl text-sm",
  xl: "size-24 rounded-3xl text-4xl",
};

/**
 * Initiales « EA » dans un carré aux bords arrondis.
 * Décoratif : le texte accessible est porté par l'élément parent (ex. le lien du logo).
 */
export function Monogram({ size = "md", className }: { size?: Size; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center border border-line-strong",
        "bg-linear-to-br from-accent/35 via-surface to-canvas",
        "font-semibold tracking-tight text-fg shadow-[inset_0_1px_0_0_rgb(245_243_255/0.08)]",
        sizes[size],
        className,
      )}
    >
      EA
    </span>
  );
}
