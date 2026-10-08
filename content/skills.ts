import type { SkillFamily } from "./types";

/* Compétences regroupées par familles (section « Compétences »). */
export const skillFamilies: SkillFamily[] = [
  {
    title: "Systèmes",
    icon: "server",
    items: [
      "Windows Server",
      "Active Directory & GPO",
      "Droits NTFS",
      "Linux (Debian, Ubuntu)",
      "Proxmox VE",
      "VMware",
    ],
  },
  {
    title: "Réseau",
    icon: "network",
    items: [
      "Cisco (VLAN, routage)",
      "Pare-feu Stormshield",
      "NAT/PAT",
      "VPN IPSec",
      "DNS/DNSSEC",
      "NTP",
    ],
  },
  {
    title: "Sécurité & supervision",
    icon: "shield-check",
    items: [
      "Wazuh (tableaux de bord SIEM)",
      "Analyse de logs",
      "Durcissement ANSSI",
      "Lynis",
      "Hardening Kitty",
      "Purple Knight",
      "Suivi des CVE",
      "Kerberos",
    ],
  },
  {
    title: "Scripting & automatisation",
    icon: "code",
    items: ["PowerShell", "Bash", "Python"],
  },
  {
    title: "Outils",
    icon: "wrench",
    items: ["Kali Linux", "Nmap", "Pare-feu Windows", "Microsoft Excel"],
  },
  {
    title: "Qualités",
    icon: "users",
    soft: true,
    items: [
      "Autonomie et rigueur",
      "Gestion des priorités et résolution de problèmes",
      "Travail d'équipe et communication technique",
      "Documentation et veille",
    ],
  },
];
