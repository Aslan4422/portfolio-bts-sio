import type { Project } from "../types";

/*
 * Confidentialité : aucune adresse IP, aucun nom de domaine réel,
 * aucun identifiant ni mot de passe.
 */
const project: Project = {
  slug: "infrastructure-reseau",
  title: "Conception d'une infrastructure réseau complète",
  domains: ["systemes-reseaux"],
  pitch:
    "Montage de bout en bout d'une infrastructure : serveurs, annuaire, services réseau et sécurité.",
  setting: "Atelier de Professionnalisation · Hébergement web",
  cover: {
    src: "https://images.unsplash.com/photo-1594915440248-1e419eba6611",
    author: "Kirill Sh",
    source: "Unsplash",
    url: "https://unsplash.com/photos/eVWWr6nmDf8",
  },

  facts: [
    { label: "Cadre", value: "Atelier de Professionnalisation" },
    { label: "Objectif", value: "Héberger une application web" },
  ],

  context:
    "Projet d'Atelier de Professionnalisation consacré à l'hébergement d'une application web. Il s'agit de monter de bout en bout l'infrastructure nécessaire : serveurs, annuaire, services réseau et sécurité.",

  sections: [
    {
      title: "Serveurs Linux",
      items: [
        "Serveur web (Apache/PHP) et serveur de base de données (MariaDB), avec communication inter-serveurs.",
        "Administration à distance sécurisée par SSH durci (clés, restriction des accès).",
      ],
    },
    {
      title: "Annuaire Active Directory",
      items: [
        "Domaine Active Directory sous Windows Server : unités d'organisation et comptes utilisateurs.",
        "Gestion des droits selon la méthode AGDLP.",
        "Intégration des machines Linux au domaine.",
      ],
    },
    {
      title: "Services réseau",
      items: [
        "DNS : zones directe et inverse, enregistrements A, CNAME, SRV et PTR, sécurisé par DNSSEC.",
        "Synchronisation de temps NTP.",
        "Authentification Kerberos, qui dépend du NTP pour la validité des tickets.",
      ],
    },
    {
      title: "Supervision",
      items: [
        "Script Python de scan réseau, avec affichage des résultats sur une page web et exécution planifiée.",
      ],
    },
    {
      title: "Notions maîtrisées",
      highlight: true,
      items: [
        "SSH garantit la confidentialité, l'intégrité et l'authenticité des échanges.",
        "Le NTP est indispensable à Kerberos : sans horloges synchronisées, les tickets ne sont plus valides.",
        "DNSSEC protège contre l'empoisonnement de cache DNS (attaque de type Man-in-the-Middle).",
        "Le CNAME apporte de la résilience : un alias peut être redirigé vers un autre serveur sans modifier les clients.",
      ],
    },
  ],

  results: [
    "Infrastructure montée de bout en bout pour héberger l'application web.",
    "Annuaire, DNS sécurisé par DNSSEC, temps synchronisé et authentification Kerberos en place.",
    "Supervision réseau automatisée grâce à un script Python planifié.",
  ],

  tech: [
    "Windows Server",
    "Active Directory",
    "DNS/DNSSEC",
    "Debian",
    "Apache",
    "MariaDB",
    "NTP",
    "Kerberos",
    "SSH",
    "Python",
    "Bash",
  ],

  bts: [
    {
      competency: "b1-service",
      evidence: "Mise à disposition d'une application web hébergée sur l'infrastructure.",
    },
    {
      competency: "b1-projet",
      evidence: "Projet d'Atelier de Professionnalisation mené de bout en bout.",
    },
    {
      competency: "b2-concevoir",
      evidence: "Conception de l'infrastructure : serveurs, annuaire et services réseau.",
    },
    {
      competency: "b2-installer",
      evidence: "Installation des serveurs web et base de données, du domaine AD, du DNS et du NTP.",
    },
    {
      competency: "b2-exploiter",
      evidence: "Supervision par un script Python de scan réseau à exécution planifiée.",
    },
    {
      competency: "b3-securiser",
      evidence: "Administration à distance par SSH durci (clés, restriction des accès).",
    },
    {
      competency: "b3-dic",
      evidence: "DNSSEC contre l'empoisonnement de cache, authentification Kerberos.",
    },
    {
      competency: "b3-infrastructure",
      evidence: "Gestion des droits AGDLP et intégration sécurisée des machines Linux au domaine.",
    },
  ],
};

export default project;
