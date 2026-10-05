import type { BtsBlock, BtsCompetencyId, BtsEvidence } from "./types";

/*
 * Référentiel BTS SIO (option SISR) : blocs et compétences.
 * Utilisé par le bloc « Compétences du référentiel BTS SIO » de chaque page projet.
 */
export const btsBlocks: BtsBlock[] = [
  {
    id: 1,
    title: "Bloc 1 — Support et mise à disposition de services informatiques",
    competencies: [
      { id: "b1-patrimoine", label: "Gérer le patrimoine informatique" },
      {
        id: "b1-incidents",
        label: "Répondre aux incidents et aux demandes d'assistance et d'évolution",
      },
      { id: "b1-service", label: "Mettre à disposition des utilisateurs un service informatique" },
      { id: "b1-projet", label: "Travailler en mode projet" },
    ],
  },
  {
    id: 2,
    title: "Bloc 2 — Administration des systèmes et des réseaux",
    competencies: [
      { id: "b2-concevoir", label: "Concevoir une solution d'infrastructure réseau" },
      { id: "b2-installer", label: "Installer, tester et déployer une solution d'infrastructure" },
      {
        id: "b2-exploiter",
        label: "Exploiter, dépanner et superviser une solution d'infrastructure",
      },
    ],
  },
  {
    id: 3,
    title: "Bloc 3 — Cybersécurité des services informatiques",
    competencies: [
      { id: "b3-securiser", label: "Sécuriser les équipements et les usages" },
      {
        id: "b3-dic",
        label: "Garantir la disponibilité, l'intégrité et la confidentialité face aux cyberattaques",
      },
      {
        id: "b3-infrastructure",
        label: "Assurer la cybersécurité d'une solution d'infrastructure, système et réseau",
      },
    ],
  },
];

/** Retrouve le bloc et l'intitulé d'une compétence à partir de son identifiant. */
export function findBtsCompetency(id: BtsCompetencyId) {
  for (const block of btsBlocks) {
    const competency = block.competencies.find((c) => c.id === id);
    if (competency) return { block, competency };
  }
  return undefined;
}

export type BtsBlockCoverage = {
  block: BtsBlock;
  items: { id: BtsCompetencyId; label: string; evidence: string }[];
};

/**
 * Regroupe les compétences mobilisées par un projet, bloc par bloc,
 * dans l'ordre du référentiel. Les blocs non couverts sont omis.
 */
export function groupEvidenceByBlock(evidence: BtsEvidence[]): BtsBlockCoverage[] {
  return btsBlocks
    .map((block) => ({
      block,
      items: block.competencies.flatMap((competency) =>
        evidence
          .filter((e) => e.competency === competency.id)
          .map((e) => ({ id: competency.id, label: competency.label, evidence: e.evidence })),
      ),
    }))
    .filter((group) => group.items.length > 0);
}
