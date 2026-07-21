import { describe, expect, it } from "vitest";

import { buildRecommendations } from "../../src/lib/risk/recommendations";

describe("recommendations", () => {
  it("returns fallback recommendation when no rule matches", () => {
    const recs = buildRecommendations({
      overTime: "No",
      jobSatisfaction: 4,
      environmentSatisfaction: 4,
      workLifeBalance: 4,
      yearsSinceLastPromotion: 1,
      monthlyIncome: 10000,
    });

    expect(recs).toEqual([
      "Manter acompanhamento periódico e reforçar engajamento.",
    ]);
  });

  it("returns all matched recommendations", () => {
    const recs = buildRecommendations({
      overTime: "Yes",
      jobSatisfaction: 2,
      environmentSatisfaction: 2,
      workLifeBalance: 2,
      yearsSinceLastPromotion: 7,
      monthlyIncome: 2500,
    });

    expect(recs).toHaveLength(6);
    expect(recs[0]).toContain("horas extras");
    expect(recs.join(" ")).toContain("motivadores");
    expect(recs.join(" ")).toContain("clima");
    expect(recs.join(" ")).toContain("flexibilidade");
    expect(recs.join(" ")).toContain("promoção");
    expect(recs.join(" ")).toContain("salarial");
  });
});
