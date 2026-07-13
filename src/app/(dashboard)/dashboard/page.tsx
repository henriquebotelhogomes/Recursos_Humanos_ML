import { AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard, Card } from "@/components/ui/card";
import { GroupedBar, SimpleBar, StackedRisk } from "@/components/charts/charts";
import { getDashboardData } from "@/server/services/metrics";
import { getModelRun } from "@/server/services/model";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardData();
  const model = await getModelRun();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Visão executiva de rotatividade e risco de saída (indicadores de risco consideram apenas profissionais ativos)."
      />

      {!data.hasPredictions && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-risk-medium/40 bg-risk-medium/10 p-4 text-sm">
          <AlertTriangle className="text-risk-medium" size={18} />
          Predições de ML ainda não geradas. Rode a camada de ML para popular o risco.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Profissionais (total)" value={formatNumber(data.total)} hint={`${formatNumber(data.totalActive)} ativos`} />
        <StatCard
          label="Rotatividade histórica"
          value={formatPercent(data.attritionRate)}
          hint={`${formatNumber(data.attritionCount)} desligados (histórico)`}
        />
        <StatCard
          label="Ativos em risco alto/crítico"
          value={formatNumber(data.atRiskActive)}
          accent="text-risk-high"
          hint="Baseado no modelo de ML"
        />
        <StatCard label="Renda média (USD)" value={formatCurrency(data.avgIncome)} hint="Base completa" />
      </div>

      {model && (
        <Card className="mt-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">Desempenho do modelo</p>
              <p className="text-xs text-muted">
                {model.algorithm} · versão {model.modelVersion} · threshold {model.threshold.toFixed(2)}
              </p>
            </div>
            <div className="flex flex-wrap gap-6">
              <Metric label="ROC-AUC" value={model.rocAuc} highlight />
              <Metric label="PR-AUC" value={model.prAuc} />
              <Metric label="Precision" value={model.precision} />
              <Metric label="Recall" value={model.recall} />
              <Metric label="F1" value={model.f1} />
            </div>
          </div>
        </Card>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-sm font-semibold">Rotatividade por departamento (histórico)</h3>
          <GroupedBar
            data={data.byDepartment}
            keys={[
              { key: "ficou", label: "Permaneceu" },
              { key: "saiu", label: "Saiu" },
            ]}
            colors={["rgb(var(--primary))", "rgb(var(--risk-critical))"]}
          />
        </Card>
        <Card>
          <h3 className="mb-4 text-sm font-semibold">Distribuição de risco por departamento (ativos)</h3>
          <StackedRisk data={data.riskByDepartment} />
        </Card>
        <Card>
          <h3 className="mb-4 text-sm font-semibold">Horas extras vs. rotatividade</h3>
          <GroupedBar
            data={data.overtimeAttrition}
            keys={[
              { key: "ficou", label: "Permaneceu" },
              { key: "saiu", label: "Saiu" },
            ]}
            colors={["rgb(var(--primary))", "rgb(var(--risk-critical))"]}
          />
        </Card>
        <Card>
          <h3 className="mb-4 text-sm font-semibold">Distribuição de idade</h3>
          <SimpleBar data={data.ageHistogram} />
        </Card>
        <Card className="lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold">Distribuição de renda mensal (USD)</h3>
          <SimpleBar data={data.incomeHistogram} color="rgb(var(--accent))" />
        </Card>
      </div>
    </div>
  );
}

function Metric({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className={`text-lg font-bold ${highlight ? "text-primary" : ""}`}>{value.toFixed(3)}</p>
    </div>
  );
}
