import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/session", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    riskConfig: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    employee: {
      findMany: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { GET, PUT } from "../../src/app/api/settings/route";
import { auth } from "../../src/lib/auth/session";
import { prisma } from "../../src/lib/prisma";

describe("/api/settings", () => {
  it("GET returns 401 when unauthenticated", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null);

    const res = await GET();

    expect(res.status).toBe(401);
  });

  it("GET returns current thresholds", async () => {
    vi.mocked(auth).mockResolvedValueOnce({ user: { id: "u1" } } as never);
    vi.mocked(prisma.riskConfig.findUnique).mockResolvedValueOnce({
      id: 1,
      mediumRiskThreshold: 30,
      highRiskThreshold: 55,
      criticalRiskThreshold: 85,
    } as never);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.mediumRiskThreshold).toBe(30);
    expect(body.highRiskThreshold).toBe(55);
    expect(body.criticalRiskThreshold).toBe(85);
  });

  it("PUT validates payload and reclassifies employees", async () => {
    vi.mocked(auth).mockResolvedValueOnce({ user: { id: "u1" } } as never);
    vi.mocked(prisma.employee.findMany).mockResolvedValueOnce([
      { id: 1, riskScore: 90 },
      { id: 2, riskScore: 50 },
    ] as never);
    vi.mocked(prisma.employee.update).mockResolvedValue({} as never);

    const req = new Request("http://localhost/api/settings", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        mediumRiskThreshold: 35,
        highRiskThreshold: 60,
        criticalRiskThreshold: 80,
      }),
    });

    const res = await PUT(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(prisma.riskConfig.upsert).toHaveBeenCalledTimes(1);
    expect(prisma.employee.update).toHaveBeenCalledTimes(2);
    expect(body.updated).toBe(2);
  });
});
