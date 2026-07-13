import Link from "next/link";
import { ShieldAlert, TrendingDown, Brain, Users, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { formatNumber, formatPercent } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [total, active, attrition, model] = await Promise.all([
    prisma.employee.count(),
    prisma.employee.count({ where: { isActive: true } }),
    prisma.employee.count({ where: { attrition: "Yes" } }),
    prisma.modelRun.findFirst({ orderBy: { trainedAt: "desc" } }),
  ]);
  const atRisk = await prisma.employee.count({
    where: { isActive: true, riskLevel: { in: ["HIGH", "CRITICAL"] } },
  });
  const rate = total ? (attrition / total) * 100 : 0;

  return (
    <div className="min-h-screen bg-bg">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-fg">
            <ShieldAlert size={20} />
          </div>
          <span className="text-xl font-bold">PeopleRisk</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login" className="text-sm font-medium text-muted hover:text-fg">
            Entrar
          </Link>
          <Link href="/register" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-fg">
            Começar
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center lg:py-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted">
          <Brain size={14} /> People Analytics com Machine Learning
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight lg:text-6xl">
          Antecipe desligamentos.{" "}
          <span className="text-primary">Retenha talentos.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          Preveja com antecedência quais profissionais ativos têm maior risco de deixar a empresa e
          aja preventivamente, com fatores explicáveis e recomendações de retenção.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-fg"
          >
            Ver dashboard <ArrowRight size={16} />
          </Link>
          <Link href="/login" className="rounded-lg border border-border px-6 py-3 text-sm font-semibold">
            Entrar
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 lg:grid-cols-4">
        <Stat icon={Users} label="Profissionais" value={formatNumber(total)} sub={`${formatNumber(active)} ativos`} />
        <Stat icon={TrendingDown} label="Rotatividade histórica" value={formatPercent(rate)} sub={`${formatNumber(attrition)} saídas`} />
        <Stat icon={ShieldAlert} label="Ativos em risco" value={formatNumber(atRisk)} sub="alto / crítico" />
        <Stat icon={Brain} label="ROC-AUC do modelo" value={model ? model.rocAuc.toFixed(2) : "—"} sub={model?.algorithm ?? "—"} />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold">Principais fatores de risco</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { t: "Horas extras", d: "Sobrecarga recorrente aumenta a probabilidade de saída." },
            { t: "Baixa satisfação", d: "Insatisfação com trabalho e ambiente é forte sinal de risco." },
            { t: "Estagnação de carreira", d: "Muito tempo sem promoção eleva o risco de desligamento." },
          ].map((f) => (
            <div key={f.t} className="card p-6">
              <h3 className="font-semibold">{f.t}</h3>
              <p className="mt-2 text-sm text-muted">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted">
        PeopleRisk · Projeto de portfólio · Dados IBM HR Analytics (sintéticos)
      </footer>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="card p-5 text-left">
      <Icon size={20} className="text-primary" />
      <p className="mt-3 text-2xl font-bold">{value}</p>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted">{sub}</p>
    </div>
  );
}
