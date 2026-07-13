import { prisma } from "@/lib/prisma";

export async function getModelRun() {
  return prisma.modelRun.findFirst({ orderBy: { trainedAt: "desc" } });
}
