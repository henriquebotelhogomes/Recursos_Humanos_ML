import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/session";
import { settingsSchema } from "@/lib/validations/settings.schema";
import { scoreToLevel } from "@/lib/risk/risk-level";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: { message: "Não autenticado", code: "UNAUTHORIZED" } }, { status: 401 });
  }

  const body = await request.json();
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { message: parsed.error.issues[0]?.message ?? "Dados inválidos", code: "VALIDATION" } },
      { status: 422 }
    );
  }

  const thresholds = parsed.data;
  await prisma.riskConfig.upsert({
    where: { id: 1 },
    update: thresholds,
    create: { id: 1, ...thresholds },
  });

  // Reclassifica riskLevel de todos os profissionais com score
  const employees = await prisma.employee.findMany({
    where: { riskScore: { not: null } },
    select: { id: true, riskScore: true },
  });
  for (const e of employees) {
    const level = scoreToLevel(e.riskScore ?? 0, thresholds);
    await prisma.employee.update({ where: { id: e.id }, data: { riskLevel: level } });
  }

  return NextResponse.json({ ok: true, updated: employees.length });
}
