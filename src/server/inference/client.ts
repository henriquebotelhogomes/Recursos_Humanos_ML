import type { Employee } from "@prisma/client";

interface InferenceResult {
  attritionProbability: number;
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  modelVersion: string;
}

const INFERENCE_BASE_URL = process.env.INFERENCE_BASE_URL ?? "http://127.0.0.1:8000";
const INFERENCE_API_KEY = process.env.INFERENCE_API_KEY;

function toPayload(e: Employee) {
  return {
    age: e.age,
    businessTravel: e.businessTravel,
    dailyRate: e.dailyRate,
    department: e.department,
    distanceFromHome: e.distanceFromHome,
    education: e.education,
    educationField: e.educationField,
    environmentSatisfaction: e.environmentSatisfaction,
    gender: e.gender,
    hourlyRate: e.hourlyRate,
    jobInvolvement: e.jobInvolvement,
    jobLevel: e.jobLevel,
    jobRole: e.jobRole,
    jobSatisfaction: e.jobSatisfaction,
    maritalStatus: e.maritalStatus,
    monthlyIncome: e.monthlyIncome,
    monthlyRate: e.monthlyRate,
    numCompaniesWorked: e.numCompaniesWorked,
    overTime: e.overTime,
    percentSalaryHike: e.percentSalaryHike,
    performanceRating: e.performanceRating,
    relationshipSatisfaction: e.relationshipSatisfaction,
    stockOptionLevel: e.stockOptionLevel,
    totalWorkingYears: e.totalWorkingYears,
    trainingTimesLastYear: e.trainingTimesLastYear,
    workLifeBalance: e.workLifeBalance,
    yearsAtCompany: e.yearsAtCompany,
    yearsInCurrentRole: e.yearsInCurrentRole,
    yearsSinceLastPromotion: e.yearsSinceLastPromotion,
    yearsWithCurrManager: e.yearsWithCurrManager,
  };
}

export async function predictBatchForEmployees(employees: Employee[]): Promise<Map<number, InferenceResult>> {
  if (employees.length === 0) return new Map();

  const headers: Record<string, string> = { "content-type": "application/json" };
  if (INFERENCE_API_KEY) headers["x-api-key"] = INFERENCE_API_KEY;

  const response = await fetch(`${INFERENCE_BASE_URL}/predict/batch`, {
    method: "POST",
    headers,
    body: JSON.stringify({ employees: employees.map(toPayload) }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Inference request failed: ${response.status}`);
  }

  const json = (await response.json()) as { data: InferenceResult[] };
  const map = new Map<number, InferenceResult>();
  for (const [idx, result] of json.data.entries()) {
    map.set(employees[idx].id, result);
  }
  return map;
}
