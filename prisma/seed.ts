import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";

const prisma = new PrismaClient();

const ROOT = process.cwd();
const HR_CSV = path.join(ROOT, "data", "Human_Resources.csv");
const PRED_CSV = path.join(ROOT, "data", "predictions.csv");
const METRICS_JSON = path.join(ROOT, "analysis", "models", "metrics_v1.json");

const DEFAULT_THRESHOLDS = {
  mediumRiskThreshold: 35,
  highRiskThreshold: 60,
  criticalRiskThreshold: 80,
};

function scoreToLevel(score: number): string {
  if (score >= DEFAULT_THRESHOLDS.criticalRiskThreshold) return "CRITICAL";
  if (score >= DEFAULT_THRESHOLDS.highRiskThreshold) return "HIGH";
  if (score >= DEFAULT_THRESHOLDS.mediumRiskThreshold) return "MEDIUM";
  return "LOW";
}

function num(v: string): number {
  return Number(v);
}

interface Prediction {
  attritionProbability: number;
  predictedAttrition: boolean;
  modelVersion: string;
  topRiskFactors: string;
}

function loadPredictions(): Map<number, Prediction> {
  const map = new Map<number, Prediction>();
  if (!fs.existsSync(PRED_CSV)) {
    console.warn("!! data/predictions.csv não encontrado — carregando sem predições de ML.");
    return map;
  }
  const raw = fs.readFileSync(PRED_CSV, "utf-8");
  const parsed = Papa.parse<Record<string, string>>(raw, { header: true, skipEmptyLines: true });
  for (const row of parsed.data) {
    const empNo = Number(row.EmployeeNumber);
    if (!empNo) continue;
    map.set(empNo, {
      attritionProbability: Number(row.attritionProbability),
      predictedAttrition: Number(row.predictedAttrition) === 1,
      modelVersion: row.modelVersion ?? "v1",
      topRiskFactors: row.topRiskFactors ?? "[]",
    });
  }
  return map;
}

async function main() {
  console.log(">> Seed iniciado");

  // Usuário demo
  const demoPassword = await bcrypt.hash("demo123", 10);
  await prisma.user.upsert({
    where: { email: "demo123" },
    update: {},
    create: { name: "Usuário Demo", email: "demo123", password: demoPassword },
  });
  console.log("   Usuário demo criado (demo123 / demo123)");

  // Employees — só recarrega se estiver vazio
  if (!fs.existsSync(HR_CSV)) {
    throw new Error(`CSV não encontrado: ${HR_CSV}`);
  }

  const existingCount = await prisma.employee.count();
  if (existingCount > 0) {
    console.log(`   ${existingCount} profissionais já existem — pulando carga (use deleteMany manualmente se quiser recarregar)`);
  } else {
    const csvRaw = fs.readFileSync(HR_CSV, "utf-8");
    const csv = Papa.parse<Record<string, string>>(csvRaw, { header: true, skipEmptyLines: true });
    const predictions = loadPredictions();

    console.log(`   ${csv.data.length} registros no CSV`);
    await prisma.employee.deleteMany();

    let inserted = 0;
    for (const r of csv.data) {
      const employeeNumber = num(r.EmployeeNumber);
      if (!employeeNumber) continue;

      const isActive = r.Attrition !== "Yes";
      const pred = predictions.get(employeeNumber);
      const riskScore = pred ? Math.round(pred.attritionProbability * 100) : null;

      await prisma.employee.create({
        data: {
          employeeNumber,
          age: num(r.Age),
          attrition: r.Attrition,
          businessTravel: r.BusinessTravel,
          dailyRate: num(r.DailyRate),
          department: r.Department,
          distanceFromHome: num(r.DistanceFromHome),
          education: num(r.Education),
          educationField: r.EducationField,
          environmentSatisfaction: num(r.EnvironmentSatisfaction),
          gender: r.Gender,
          hourlyRate: num(r.HourlyRate),
          jobInvolvement: num(r.JobInvolvement),
          jobLevel: num(r.JobLevel),
          jobRole: r.JobRole,
          jobSatisfaction: num(r.JobSatisfaction),
          maritalStatus: r.MaritalStatus,
          monthlyIncome: num(r.MonthlyIncome),
          monthlyRate: num(r.MonthlyRate),
          numCompaniesWorked: num(r.NumCompaniesWorked),
          over18: r.Over18,
          overTime: r.OverTime,
          percentSalaryHike: num(r.PercentSalaryHike),
          performanceRating: num(r.PerformanceRating),
          relationshipSatisfaction: num(r.RelationshipSatisfaction),
          standardHours: num(r.StandardHours),
          stockOptionLevel: num(r.StockOptionLevel),
          totalWorkingYears: num(r.TotalWorkingYears),
          trainingTimesLastYear: num(r.TrainingTimesLastYear),
          workLifeBalance: num(r.WorkLifeBalance),
          yearsAtCompany: num(r.YearsAtCompany),
          yearsInCurrentRole: num(r.YearsInCurrentRole),
          yearsSinceLastPromotion: num(r.YearsSinceLastPromotion),
          yearsWithCurrManager: num(r.YearsWithCurrManager),
          isActive,
          attritionProbability: pred?.attritionProbability ?? null,
          predictedAttrition: pred?.predictedAttrition ?? null,
          riskScore,
          riskLevel: riskScore !== null ? scoreToLevel(riskScore) : null,
          topRiskFactors: pred?.topRiskFactors ?? null,
          modelVersion: pred?.modelVersion ?? null,
          scoredAt: pred ? new Date() : null,
        },
      });
      inserted++;
    }
    console.log(`   ${inserted} profissionais inseridos`);
  } // fim do else (employee vazio)

  // RiskConfig + ModelRun
  let modelVersion: string | null = null;
  if (fs.existsSync(METRICS_JSON)) {
    const m = JSON.parse(fs.readFileSync(METRICS_JSON, "utf-8"));
    modelVersion = m.modelVersion ?? "v1";
    await prisma.modelRun.deleteMany();
    await prisma.modelRun.create({
      data: {
        modelVersion: m.modelVersion ?? "v1",
        algorithm: m.algorithm ?? "LogisticRegression",
        rocAuc: m.roc_auc ?? 0,
        prAuc: m.pr_auc ?? 0,
        precision: m.precision ?? 0,
        recall: m.recall ?? 0,
        f1: m.f1 ?? 0,
        accuracy: m.accuracy ?? 0,
        threshold: m.threshold ?? 0.5,
        trainedAt: m.trainedAt ? new Date(m.trainedAt) : new Date(),
        notes: JSON.stringify(m.cvRocAuc ?? {}),
      },
    });
    console.log("   ModelRun registrado:", modelVersion);
  }

  await prisma.riskConfig.upsert({
    where: { id: 1 },
    update: { ...DEFAULT_THRESHOLDS, activeModelVersion: modelVersion },
    create: { id: 1, ...DEFAULT_THRESHOLDS, activeModelVersion: modelVersion },
  });

  console.log(">> Seed concluído");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
