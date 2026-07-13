import Link from "next/link";
import { Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { formatNumber } from "@/lib/utils";
import { PAGE_SIZE_OPTIONS } from "@/config/site";

export const dynamic = "force-dynamic";

const COLUMNS: { key: string; label: string }[] = [
  { key: "employeeNumber", label: "Nº" },
  { key: "age", label: "Age" },
  { key: "attrition", label: "Attrition" },
  { key: "businessTravel", label: "BusinessTravel" },
  { key: "department", label: "Department" },
  { key: "distanceFromHome", label: "DistanceFromHome" },
  { key: "education", label: "Education" },
  { key: "educationField", label: "EducationField" },
  { key: "environmentSatisfaction", label: "EnvSatisfaction" },
  { key: "gender", label: "Gender" },
  { key: "jobRole", label: "JobRole" },
  { key: "jobLevel", label: "JobLevel" },
  { key: "jobSatisfaction", label: "JobSatisfaction" },
  { key: "maritalStatus", label: "MaritalStatus" },
  { key: "monthlyIncome", label: "MonthlyIncome" },
  { key: "numCompaniesWorked", label: "NumCompanies" },
  { key: "overTime", label: "OverTime" },
  { key: "percentSalaryHike", label: "SalaryHike%" },
  { key: "performanceRating", label: "Performance" },
  { key: "stockOptionLevel", label: "StockOption" },
  { key: "totalWorkingYears", label: "TotalYears" },
  { key: "trainingTimesLastYear", label: "Trainings" },
  { key: "workLifeBalance", label: "WorkLifeBal" },
  { key: "yearsAtCompany", label: "YearsAtCompany" },
  { key: "yearsInCurrentRole", label: "YearsInRole" },
  { key: "yearsSinceLastPromotion", label: "YearsSincePromo" },
  { key: "yearsWithCurrManager", label: "YearsWithMgr" },
  { key: "riskScore", label: "RiskScore" },
];

export default async function DatasetPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; size?: string }>;
}) {
  const sp = await searchParams;
  const size = PAGE_SIZE_OPTIONS.includes(Number(sp.size)) ? Number(sp.size) : 25;
  const page = Math.max(1, Number(sp.page ?? 1));

  const [total, rows] = await Promise.all([
    prisma.employee.count(),
    prisma.employee.findMany({
      orderBy: { employeeNumber: "asc" },
      skip: (page - 1) * size,
      take: size,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / size));
  const start = (page - 1) * size + 1;
  const end = Math.min(page * size, total);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader title="Dataset completo" subtitle="Todas as colunas originais do CSV (base histórica)." />
        <a
          href="/api/dataset/download"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-fg"
        >
          <Download size={16} /> Baixar CSV
        </a>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-muted">
          Exibindo {formatNumber(start)}–{formatNumber(end)} de {formatNumber(total)}
        </p>
        <form action="/dataset" method="get" className="flex items-center gap-2">
          <label className="text-muted">Por página:</label>
          <select name="size" defaultValue={size} className="rounded-lg border border-border bg-card px-2 py-1.5">
            {PAGE_SIZE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <button className="rounded-lg border border-border px-3 py-1.5">Aplicar</button>
        </form>
      </div>

      <div className="card max-h-[70vh] overflow-auto p-0">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-card">
            <tr className="border-b border-border text-left uppercase tracking-wide text-muted">
              {COLUMNS.map((c) => (
                <th key={c.key} className="whitespace-nowrap px-3 py-2.5">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/50">
                {COLUMNS.map((c) => (
                  <td key={c.key} className="whitespace-nowrap px-3 py-2">
                    {String((r as Record<string, unknown>)[c.key] ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <p className="text-muted">Página {page} de {totalPages}</p>
        <div className="flex gap-2">
          {page > 1 && (
            <Link href={`/dataset?size=${size}&page=${page - 1}`} className="rounded-lg border border-border px-3 py-1.5">
              Anterior
            </Link>
          )}
          {page < totalPages && (
            <Link href={`/dataset?size=${size}&page=${page + 1}`} className="rounded-lg border border-border px-3 py-1.5">
              Próxima
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
