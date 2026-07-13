import { prisma } from "@/lib/prisma";

export interface DashboardData {
  total: number;
  totalActive: number;
  attritionCount: number;
  attritionRate: number;
  atRiskActive: number;
  avgAge: number;
  avgIncome: number;
  avgTenure: number;
  avgJobSat: number;
  avgEnvSat: number;
  avgWlb: number;
  byDepartment: { name: string; saiu: number; ficou: number }[];
  riskByDepartment: { name: string; LOW: number; MEDIUM: number; HIGH: number; CRITICAL: number }[];
  ageHistogram: { bucket: string; count: number }[];
  incomeHistogram: { bucket: string; count: number }[];
  overtimeAttrition: { name: string; saiu: number; ficou: number }[];
  hasPredictions: boolean;
}

export async function getDashboardData(): Promise<DashboardData> {
  const employees = await prisma.employee.findMany();
  const total = employees.length;
  const active = employees.filter((e) => e.isActive);
  const totalActive = active.length;
  const attritionCount = employees.filter((e) => e.attrition === "Yes").length;

  const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

  const atRiskActive = active.filter(
    (e) => e.riskLevel === "HIGH" || e.riskLevel === "CRITICAL"
  ).length;

  // Rotatividade por departamento
  const deptMap = new Map<string, { saiu: number; ficou: number }>();
  for (const e of employees) {
    const d = deptMap.get(e.department) ?? { saiu: 0, ficou: 0 };
    if (e.attrition === "Yes") d.saiu++;
    else d.ficou++;
    deptMap.set(e.department, d);
  }

  // Risco por departamento (ativos)
  const riskMap = new Map<string, { LOW: number; MEDIUM: number; HIGH: number; CRITICAL: number }>();
  for (const e of active) {
    const r = riskMap.get(e.department) ?? { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
    if (e.riskLevel) r[e.riskLevel as keyof typeof r]++;
    riskMap.set(e.department, r);
  }

  const histogram = (values: number[], size: number, max: number) => {
    const buckets = new Map<string, number>();
    for (let i = 0; i < max; i += size) {
      buckets.set(`${i}-${i + size}`, 0);
    }
    for (const v of values) {
      const start = Math.min(Math.floor(v / size) * size, max - size);
      const key = `${start}-${start + size}`;
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
    return Array.from(buckets.entries()).map(([bucket, count]) => ({ bucket, count }));
  };

  const otMap = new Map<string, { saiu: number; ficou: number }>();
  for (const e of employees) {
    const key = e.overTime === "Yes" ? "Com hora extra" : "Sem hora extra";
    const o = otMap.get(key) ?? { saiu: 0, ficou: 0 };
    if (e.attrition === "Yes") o.saiu++;
    else o.ficou++;
    otMap.set(key, o);
  }

  return {
    total,
    totalActive,
    attritionCount,
    attritionRate: total ? (attritionCount / total) * 100 : 0,
    atRiskActive,
    avgAge: avg(employees.map((e) => e.age)),
    avgIncome: avg(employees.map((e) => e.monthlyIncome)),
    avgTenure: avg(employees.map((e) => e.yearsAtCompany)),
    avgJobSat: avg(employees.map((e) => e.jobSatisfaction)),
    avgEnvSat: avg(employees.map((e) => e.environmentSatisfaction)),
    avgWlb: avg(employees.map((e) => e.workLifeBalance)),
    byDepartment: Array.from(deptMap.entries()).map(([name, v]) => ({ name, ...v })),
    riskByDepartment: Array.from(riskMap.entries()).map(([name, v]) => ({ name, ...v })),
    ageHistogram: histogram(employees.map((e) => e.age), 5, 65),
    incomeHistogram: histogram(employees.map((e) => e.monthlyIncome), 2500, 20000),
    overtimeAttrition: Array.from(otMap.entries()).map(([name, v]) => ({ name, ...v })),
    hasPredictions: employees.some((e) => e.attritionProbability !== null),
  };
}
