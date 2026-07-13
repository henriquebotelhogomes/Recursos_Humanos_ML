export interface RiskFactor {
  feature: string;
  impact: number;
  direction: string;
}

export interface EmployeeForRecommendation {
  overTime: string;
  jobSatisfaction: number;
  environmentSatisfaction: number;
  workLifeBalance: number;
  yearsSinceLastPromotion: number;
  monthlyIncome: number;
}

/** Gera recomendações de retenção com base em regras sobre os fatores de risco. */
export function buildRecommendations(emp: EmployeeForRecommendation): string[] {
  const recs: string[] = [];
  if (emp.overTime === "Yes") {
    recs.push("Revisar carga de trabalho e priorizar equilíbrio (faz horas extras).");
  }
  if (emp.jobSatisfaction <= 2) {
    recs.push("Conversa estruturada sobre motivadores e plano de desenvolvimento.");
  }
  if (emp.environmentSatisfaction <= 2) {
    recs.push("Analisar clima e ambiente do time.");
  }
  if (emp.workLifeBalance <= 2) {
    recs.push("Ajustar rotina e oferecer mais flexibilidade.");
  }
  if (emp.yearsSinceLastPromotion >= 5) {
    recs.push("Revisar trilha de carreira e perspectivas de promoção.");
  }
  if (emp.monthlyIncome < 3000) {
    recs.push("Avaliar equidade salarial frente ao cargo/mercado.");
  }
  if (recs.length === 0) {
    recs.push("Manter acompanhamento periódico e reforçar engajamento.");
  }
  return recs;
}
