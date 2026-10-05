import {
  BrickWall,
  Briefcase,
  Code,
  Flag,
  GraduationCap,
  Layers,
  LifeBuoy,
  Mail,
  Network,
  Newspaper,
  Plug,
  Radar,
  Server,
  ShieldAlert,
  ShieldCheck,
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
  "shield-alert": ShieldAlert,
  "brick-wall": BrickWall,
  flag: Flag,
  server: Server,
  code: Code,
  wrench: Wrench,
  users: Users,
  radar: Radar,
  newspaper: Newspaper,
  "life-buoy": LifeBuoy,
  plug: Plug,
  layers: Layers,
  "graduation-cap": GraduationCap,
  mail: Mail,
};

/** Icône décorative (masquée aux lecteurs d'écran). */
export function ContentIcon({ name, ...props }: { name: IconName } & LucideProps) {
  const Icon = icons[name];
  return <Icon aria-hidden="true" {...props} />;
}
