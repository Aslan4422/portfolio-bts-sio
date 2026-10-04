import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Centre le contenu et limite sa largeur, avec des marges latérales adaptées à l'écran. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)} {...props} />;
}
