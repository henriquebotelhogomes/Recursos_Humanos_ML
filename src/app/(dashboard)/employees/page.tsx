import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { RiskBadge } from "@/components/ui/risk-badge";
import { formatCurrency } from "@/lib/utils";
import type { RiskLevel } from "@/lib/risk/risk-level";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; dept?: string; risk?: string; status?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1));
  const status = sp.status ?? "active";
  const dept = sp.dept ?? "";
  const risk = sp.risk ?? "";
  const q = sp.q ?? "";

  const where: Record<string, unknown> = {};
  if (status === "active") where.isActive = true;
  else if (status === "former") where.isActive = false;
  if (dept) where.department = dept;
  if (risk) where.riskLevel = risk;
  if (q && !Number.isNaN(Number(q))) where.employeeNumber = Number(q);

  const [total, employees, departments] = await Promise.all([
    prisma.employee.count({ where }),
    prisma.employee.findMany({
      where,
      orderBy: [{ riskScore: "desc" }, { employeeNumber: "asc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.employee.findMany({ distinct: ["department"], select: { department: true } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const buildUrl = (patch: Record<string, string | number>) => {
    const params = new URLSearchParams({ status, dept, risk, q, page: String(page), ...Object.fromEntries(Object.entries(patch).map(([k, v]) => [k, String(v)])) });
    return `/employees?${params.toString()}`;
  };

  return (
    <div>
      <PageHeader title="Profissionais" subtitle={`${total} profissionais · ordenados por risco`} />

      <form className="mb-4 flex flex-wrap gap-3" action="/employees" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Nº do profissional"
          className="w-40 rounded-lg border border-border bg-card px-3 py-2 text-sm"
        />
        <select name="status" defaultValue={status} className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
          <option value="active">Ativos</option>
          <option value="former">Desligados</option>
          <option value="all">Todos</option>
        </select>
        <select name="dept" defaultValue={dept} className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
          <option value="">Todos os departamentos</option>
          {departments.map((d) => (
            <option key={d.department} value={d.department}>
              {d.department}
            </option>
          ))}
        </select>
        <select name="risk" defaultValue={risk} className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
          <option value="">Todos os níveis</option>
          <option value="LOW">Baixo</option>
          <option value="MEDIUM">Médio</option>
          <option value="HIGH">Alto</option>
          <option value="CRITICAL">Crítico</option>
        </select>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-fg">Filtrar</button>
      </form>

      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3">Nº</th>
              <th className="px-4 py-3">Departamento</th>
              <th className="px-4 py-3">Cargo</th>
              <th className="px-4 py-3">Idade</th>
              <th className="px-4 py-3">Renda</th>
              <th className="px-4 py-3">Hora extra</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Risco</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-muted">
                  Nenhum profissional encontrado para os filtros selecionados.
                </td>
              </tr>
            )}
            {employees.map((e) => (
              <tr key={e.id} className="border-b border-border/60 transition hover:bg-surface">
                <td className="px-4 py-3">
                  <Link href={`/employees/${e.id}`} className="font-medium text-primary hover:underline">
                    #{e.employeeNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">{e.department}</td>
                <td className="px-4 py-3 text-muted">{e.jobRole}</td>
                <td className="px-4 py-3">{e.age}</td>
                <td className="px-4 py-3">{formatCurrency(e.monthlyIncome)}</td>
                <td className="px-4 py-3">{e.overTime === "Yes" ? "Sim" : "Não"}</td>
                <td className="px-4 py-3 font-semibold">{e.riskScore ?? "—"}</td>
                <td className="px-4 py-3">
                  <RiskBadge level={e.riskLevel as RiskLevel | null} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <p className="text-muted">
          Página {page} de {totalPages}
        </p>
        <div className="flex gap-2">
          {page > 1 && (
            <Link href={buildUrl({ page: page - 1 })} className="rounded-lg border border-border px-3 py-1.5">
              Anterior
            </Link>
          )}
          {page < totalPages && (
            <Link href={buildUrl({ page: page + 1 })} className="rounded-lg border border-border px-3 py-1.5">
              Próxima
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
