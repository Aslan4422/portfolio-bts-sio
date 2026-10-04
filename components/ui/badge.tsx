import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Petite étiquette technique (techno, outil) en police mono. */
export function Badge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-line bg-surface/70 px-2 py-0.5 font-mono text-xs text-fg-secondary",
        className,
      )}
      {...props}
    />
  );
}
