import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/session";
import { getDashboardData } from "@/server/services/metrics";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: { message: "Nao autenticado", code: "UNAUTHORIZED" } },
      { status: 401 }
    );
  }

  const data = await getDashboardData();
  return NextResponse.json(data);
}
