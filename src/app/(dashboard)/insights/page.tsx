import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const employees = await prisma.employee.findMany();
  const left = employees.filter((e) => e.attrition === "Yes");
  const stayed = employees.filter((e) => e.attrition === "No");

  const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

  const topDept = countTop(left.map((e) => e.department));
  const topRole = countTop(left.map((e) => e.jobRole));
  const otLeftRate =
    (left.filter((e) => e.overTime === "Yes").length / (left.length || 1)) * 100;

  const insights = [
    `O departamento com mais desligamentos é ${topDept.name} (${topDept.count} saídas).`,
    `O cargo com mais desligamentos é ${topRole.name} (${topRole.count} saídas).`,
    `Quem saiu tinha em média ${formatNumber(avg(left.map((e) => e.age)), 1)} anos, contra ${formatNumber(avg(stayed.map((e) => e.age)), 1)} de quem ficou.`,
    `A renda média de quem saiu foi ${formatCurrency(avg(left.map((e) => e.monthlyIncome)))}, contra ${formatCurrency(avg(stayed.map((e) => e.monthlyIncome)))} de quem ficou.`,
    `${formatPercent(otLeftRate)} das pessoas que saíram faziam horas extras.`,
    `Satisfação média no trabalho de quem saiu: ${formatNumber(avg(left.map((e) => e.jobSatisfaction)), 2)}/4, contra ${formatNumber(avg(stayed.map((e) => e.jobSatisfaction)), 2)}/4 de quem ficou.`,
  ];

  return (
    <div>
      <PageHeader title="Insights executivos" subtitle="Padrões calculados automaticamente a partir da base histórica." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {insights.map((text, i) => (
          <Card key={i}>
            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed">{text}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function countTop(items: string[]): { name: string; count: number } {
  const map = new Map<string, number>();
  for (const i of items) map.set(i, (map.get(i) ?? 0) + 1);
  let best = { name: "—", count: 0 };
  for (const [name, count] of map) if (count > best.count) best = { name, count };
  return best;
}
