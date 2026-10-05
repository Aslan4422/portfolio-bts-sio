/* Référentiel BTS SIO : recherche d'une compétence et regroupement par bloc (fiche projet). */
import { describe, expect, it } from "vitest";
import { btsBlocks, findBtsCompetency, groupEvidenceByBlock } from "@/content/bts";
import type { BtsCompetencyId } from "@/content/types";

describe("Référentiel BTS SIO", () => {
  it("contient les 3 blocs, numérotés 1 à 3, sans compétence en double", () => {
    expect(btsBlocks.map((block) => block.id)).toEqual([1, 2, 3]);
    const ids = btsBlocks.flatMap((block) => block.competencies.map((c) => c.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("retrouve chaque compétence et son bloc", () => {
    for (const block of btsBlocks) {
      for (const competency of block.competencies) {
        expect(findBtsCompetency(competency.id)).toEqual({ block, competency });
      }
    }
  });

  it("ne retrouve pas une compétence inconnue", () => {
    expect(findBtsCompetency("b9-inconnue" as BtsCompetencyId)).toBeUndefined();
  });
});

describe("Regroupement des preuves par bloc", () => {
  it("range les preuves dans l'ordre du référentiel et omet les blocs non couverts", () => {
    const groups = groupEvidenceByBlock([
      { competency: "b3-dic", evidence: "Sauvegardes 3-2-1" },
      { competency: "b1-incidents", evidence: "Assistance utilisateurs" },
      { competency: "b3-securiser", evidence: "Moindre privilège" },
    ]);
    expect(groups.map((group) => group.block.id)).toEqual([1, 3]);
    // Dans le bloc 3, ordre du référentiel (b3-securiser avant b3-dic), pas ordre de saisie.
    expect(groups[1].items.map((item) => item.id)).toEqual(["b3-securiser", "b3-dic"]);
    expect(groups[1].items[1]).toMatchObject({ evidence: "Sauvegardes 3-2-1" });
    expect(groups[1].items[1].label).toMatch(/disponibilité/);
  });

  it("renvoie une liste vide sans preuve", () => {
    expect(groupEvidenceByBlock([])).toEqual([]);
  });
});
