import type { Project } from "../types";

const project: Project = {
  slug: "labo-stormshield",
  title: "Laboratoire pare-feu Stormshield",
  domains: ["systemes-reseaux"],
  pitch: "Configuration d'un pare-feu professionnel de bout en bout (8 fiches pratiques).",
  setting: "Stormshield SNS · 8 fiches pratiques",
  // Aucune photo libre de Stormshield n'existe : pare-feu Fortinet FortiGate en illustration.
  cover: {
    src: "/images/projets/pare-feu-fortigate.jpg",
    author: "Johannes Weber",
    source: "Flickr",
    url: "https://www.flickr.com/photos/webernetz/37855201782/",
    license: { name: "CC BY 2.0", url: "https://creativecommons.org/licenses/by/2.0/deed.fr" },
  },

  facts: [
    { label: "Équipement", value: "Pare-feu Stormshield SNS" },
    { label: "Format", value: "8 fiches pratiques" },
  ],

  context:
    "Laboratoire de configuration d'un pare-feu professionnel Stormshield, de bout en bout, à travers 8 fiches pratiques : de la configuration de base jusqu'au VPN site-à-site.",

  sections: [
    {
      title: "Les 8 fiches pratiques",
      items: [
        "Configuration de base et accès Internet par NAT/PAT.",
        "Plan d'adressage réseau.",
        "Objets réseau.",
        "Traduction d'adresses NAT/PAT.",
        "Filtrage protocolaire.",
        "Filtrage applicatif.",
        "Utilisateurs, authentification et portail captif.",
        "VPN site-à-site IPSec.",
      ],
    },
  ],

  results: [
    "Pare-feu configuré de bout en bout, de l'accès Internet au VPN site-à-site IPSec.",
    "Filtrage protocolaire et applicatif, authentification des utilisateurs par portail captif.",
  ],

  tech: ["Stormshield SNS", "NAT/PAT", "Filtrage", "Portail captif", "VPN IPSec"],

  bts: [
    {
      competency: "b2-concevoir",
      evidence: "Élaboration du plan d'adressage réseau et des objets réseau.",
    },
    {
      competency: "b2-installer",
      evidence: "Configuration du pare-feu de bout en bout, de l'accès Internet au VPN.",
    },
    {
      competency: "b3-securiser",
      evidence: "Authentification des utilisateurs et portail captif.",
    },
    {
      competency: "b3-dic",
      evidence: "VPN site-à-site IPSec pour protéger la confidentialité des échanges.",
    },
    {
      competency: "b3-infrastructure",
      evidence: "Filtrage protocolaire et applicatif du trafic.",
    },
  ],
};

export default project;
