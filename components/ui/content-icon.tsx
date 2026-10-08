import {
  BookOpen,
  BrickWall,
  Briefcase,
  Bug,
  Code,
  Flag,
  GraduationCap,
  Layers,
  Mail,
  Network,
  Plug,
  Radar,
  Scale,
  Server,
  ShieldCheck,
  Siren,
  Users,
  Wrench,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/content/types";

/** Correspondance entre les noms d'icônes utilisés dans content/ et les icônes lucide. */
const icons: Record<IconName, React.ComponentType<LucideProps>> = {
  briefcase: Briefcase,
  "shield-check": ShieldCheck,
  network: Network,
  "brick-wall": BrickWall,
  flag: Flag,
  server: Server,
  code: Code,
  wrench: Wrench,
  users: Users,
  radar: Radar,
  plug: Plug,
  scale: Scale,
  siren: Siren,
  bug: Bug,
  "book-open": BookOpen,
  layers: Layers,
  "graduation-cap": GraduationCap,
  mail: Mail,
};

/** Icône décorative (masquée aux lecteurs d'écran). */
export function ContentIcon({ name, ...props }: { name: IconName } & LucideProps) {
  const Icon = icons[name];
  return <Icon aria-hidden="true" {...props} />;
}
