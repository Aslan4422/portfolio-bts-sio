import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

type StyleOptions = {
  variant?: Variant;
  size?: Size;
  className?: string;
};

// La bordure transparente devient visible en mode « contraste élevé » de Windows.
const base =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-transparent font-medium whitespace-nowrap transition-colors duration-200 disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-4 [&_svg]:shrink-0";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-fg shadow-lg shadow-accent/25 ring-1 ring-inset ring-accent-light/30 hover:bg-accent-hover",
  secondary:
    "border-line-strong bg-surface/60 text-fg hover:border-accent-light/70 hover:bg-surface",
  ghost: "text-fg-secondary hover:bg-surface/70 hover:text-fg",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[0.95rem]",
};

export function buttonStyles({ variant = "primary", size = "md", className }: StyleOptions = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

/** Lien qui a l'apparence d'un bouton (navigation interne ou externe). */
export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & StyleOptions) {
  return <Link className={buttonStyles({ variant, size, className })} {...props} />;
}

/** Vrai bouton HTML (actions : envoyer un formulaire, ouvrir un menu…). */
export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & StyleOptions) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}
