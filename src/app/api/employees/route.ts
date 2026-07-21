import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { predictBatchForEmployees } from "@/server/inference/client";

const PAGE_SIZE_DEFAULT = 20;
const PAGE_SIZE_MAX = 100;

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: { message: "Nao autenticado", code: "UNAUTHORIZED" } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const status = searchParams.get("status") ?? "active";
  const dept = searchParams.get("dept") ?? "";
  const risk = searchParams.get("risk") ?? "";
  const q = searchParams.get("q") ?? "";
  const pageSize = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, Number(searchParams.get("pageSize") ?? PAGE_SIZE_DEFAULT))
  );

  const where: Record<string, unknown> = {};
  if (status === "active") where.isActive = true;
  else if (status === "former") where.isActive = false;
  if (dept) where.department = dept;
  if (risk) where.riskLevel = risk;
  if (q && !Number.isNaN(Number(q))) where.employeeNumber = Number(q);

  const [total, employees] = await Promise.all([
    prisma.employee.count({ where }),
    prisma.employee.findMany({
      where,
      orderBy: [{ riskScore: "desc" }, { employeeNumber: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const useOnlineInference = process.env.USE_ONLINE_INFERENCE === "true";
  if (useOnlineInference && employees.length > 0) {
    try {
      const predictions = await predictBatchForEmployees(employees);
      for (const employee of employees) {
        const pred = predictions.get(employee.id);
        if (!pred) continue;
        employee.attritionProbability = pred.attritionProbability;
        employee.riskScore = pred.riskScore;
        employee.riskLevel = pred.riskLevel;
        employee.modelVersion = pred.modelVersion;
      }
    } catch {
      // fallback para valores persistidos no banco
    }
  }

  return NextResponse.json({
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    data: employees,
  });
}
