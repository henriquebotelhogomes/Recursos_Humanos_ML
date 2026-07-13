import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: { message: "Não autenticado", code: "UNAUTHORIZED" } }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const employees = await prisma.employee.findMany({ orderBy: { employeeNumber: "asc" } });

  const columns = [
    "employeeNumber", "age", "attrition", "businessTravel", "dailyRate", "department",
    "distanceFromHome", "education", "educationField", "environmentSatisfaction", "gender",
    "hourlyRate", "jobInvolvement", "jobLevel", "jobRole", "jobSatisfaction", "maritalStatus",
    "monthlyIncome", "monthlyRate", "numCompaniesWorked", "over18", "overTime", "percentSalaryHike",
    "performanceRating", "relationshipSatisfaction", "standardHours", "stockOptionLevel",
    "totalWorkingYears", "trainingTimesLastYear", "workLifeBalance", "yearsAtCompany",
    "yearsInCurrentRole", "yearsSinceLastPromotion", "yearsWithCurrManager",
    "isActive", "riskScore", "riskLevel", "attritionProbability",
  ];

  const header = columns.join(",");
  const lines = employees.map((e) =>
    columns.map((c) => String((e as Record<string, unknown>)[c] ?? "")).join(",")
  );
  const csv = [header, ...lines].join("\n");

  return new Response(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="people_dataset.csv"',
    },
  });
}
