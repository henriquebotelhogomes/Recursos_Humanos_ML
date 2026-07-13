export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface RiskThresholds {
  mediumRiskThreshold: number;
  highRiskThreshold: number;
  criticalRiskThreshold: number;
}

export const DEFAULT_THRESHOLDS: RiskThresholds = {
  mediumRiskThreshold: 35,
  highRiskThreshold: 60,
  criticalRiskThreshold: 80,
};

/** Converte a probabilidade prevista (0-1) em riskScore (0-100). */
export function probabilityToScore(probability: number): number {
  return Math.round(Math.min(1, Math.max(0, probability)) * 100);
}

/** Deriva o nível de risco a partir do score e dos thresholds configuráveis. */
export function scoreToLevel(score: number, thresholds: RiskThresholds): RiskLevel {
  if (score >= thresholds.criticalRiskThreshold) return "CRITICAL";
  if (score >= thresholds.highRiskThreshold) return "HIGH";
  if (score >= thresholds.mediumRiskThreshold) return "MEDIUM";
  return "LOW";
}

export const RISK_META: Record<RiskLevel, { label: string; className: string; dot: string }> = {
  LOW: { label: "Baixo", className: "bg-risk-low/15 text-risk-low", dot: "bg-risk-low" },
  MEDIUM: { label: "Médio", className: "bg-risk-medium/15 text-risk-medium", dot: "bg-risk-medium" },
  HIGH: { label: "Alto", className: "bg-risk-high/15 text-risk-high", dot: "bg-risk-high" },
  CRITICAL: {
    label: "Crítico",
    className: "bg-risk-critical/15 text-risk-critical",
    dot: "bg-risk-critical",
  },
};
