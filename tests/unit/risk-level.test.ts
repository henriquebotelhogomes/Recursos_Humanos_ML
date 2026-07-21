import { describe, expect, it } from "vitest";

import {
  DEFAULT_THRESHOLDS,
  probabilityToScore,
  scoreToLevel,
} from "../../src/lib/risk/risk-level";

describe("risk-level", () => {
  it("converts probability to bounded score", () => {
    expect(probabilityToScore(-0.5)).toBe(0);
    expect(probabilityToScore(0)).toBe(0);
    expect(probabilityToScore(0.356)).toBe(36);
    expect(probabilityToScore(1)).toBe(100);
    expect(probabilityToScore(2)).toBe(100);
  });

  it("maps score to risk level by thresholds", () => {
    expect(scoreToLevel(34, DEFAULT_THRESHOLDS)).toBe("LOW");
    expect(scoreToLevel(35, DEFAULT_THRESHOLDS)).toBe("MEDIUM");
    expect(scoreToLevel(60, DEFAULT_THRESHOLDS)).toBe("HIGH");
    expect(scoreToLevel(80, DEFAULT_THRESHOLDS)).toBe("CRITICAL");
  });
});
