import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { buildRecommendations, type RiskFactor } from "@/lib/risk/recommendations";
import type { RiskLevel } from "@/lib/risk/risk-level";

export const dynamic = "force-dynamic";

export default async function EmployeeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const employee = await prisma.employee.findUnique({ where: { id: Number(id) } });
  if (!employee) notFound();

  let factors: RiskFactor[] = [];
  try {
    factors = employee.topRiskFactors ? (JSON.parse(employee.topRiskFactors) as RiskFactor[]) : [];
  } catch {
    factors = [];
  }

  const recs = buildRecommendations({
    overTime: employee.overTime,
    jobSatisfaction: employee.jobSatisfaction,
    environmentSatisfaction: employee.environmentSatisfaction,
    workLifeBalance: employee.workLifeBalance,
    yearsSinceLastPromotion: employee.yearsSinceLastPromotion,
    monthlyIncome: employee.monthlyIncome,
  });

  const prob = employee.attritionProbability ?? 0;

  return (
    <div>
      <Link href="/employees" className="mb-4 inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
        <ArrowLeft size={16} /> Voltar
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Profissional #{employee.employeeNumber}</h1>
          <p className="text-sm text-muted">
            {employee.jobRole} · {employee.department} · {employee.isActive ? "Ativo" : "Desligado"}
          </p>
        </div>
        <RiskBadge level={employee.riskLevel as RiskLevel | null} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <h3 className="mb-4 text-sm font-semibold">Perfil</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <Info label="Idade" value={String(employee.age)} />
              <Info label="Gênero" value={employee.gender === "Male" ? "Masculino" : "Feminino"} />
              <Info label="Estado civil" value={employee.maritalStatus} />
              <Info label="Renda mensal" value={formatCurrency(employee.monthlyIncome)} />
              <Info label="Nível do cargo" value={String(employee.jobLevel)} />
              <Info label="Hora extra" value={employee.overTime === "Yes" ? "Sim" : "Não"} />
              <Info label="Tempo de empresa" value={`${employee.yearsAtCompany} anos`} />
              <Info label="Anos no cargo" value={`${employee.yearsInCurrentRole} anos`} />
              <Info label="Última promoção" value={`há ${employee.yearsSinceLastPromotion} anos`} />
              <Info label="Satisfação trabalho" value={`${employee.jobSatisfaction}/4`} />
              <Info label="Satisfação ambiente" value={`${employee.environmentSatisfaction}/4`} />
              <Info label="Equilíbrio vida/trab." value={`${employee.workLifeBalance}/4`} />
            </dl>
          </Card>

          <Card>
            <h3 className="mb-3 text-sm font-semibold">Fatores que mais contribuem para o risco</h3>
            {factors.length === 0 ? (
              <p className="text-sm text-muted">Sem fatores calculados.</p>
            ) : (
              <ul className="space-y-2">
                {factors.map((f, i) => (
                  <li key={i} className="flex items-center justify-between rounded-lg bg-surface px-3 py-2 text-sm">
                    <span>{f.feature}</span>
                    <span className="text-xs font-medium text-risk-high">{f.direction} risco</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="mb-2 text-sm font-semibold">Risco de saída</h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-risk-high">{employee.riskScore ?? "—"}</span>
              <span className="mb-1 text-sm text-muted">/100</span>
            </div>
            <p className="mt-1 text-sm text-muted">Probabilidade prevista: {formatPercent(prob * 100)}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full bg-risk-high"
                style={{ width: `${employee.riskScore ?? 0}%` }}
              />
            </div>
          </Card>

          <Card>
            <h3 className="mb-3 text-sm font-semibold">Recomendações de retenção</h3>
            <ul className="space-y-2 text-sm">
              {recs.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-primary">•</span>
                  {r}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
