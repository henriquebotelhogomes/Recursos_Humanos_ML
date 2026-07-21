import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/session", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    employee: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

import { GET } from "../../src/app/api/employees/route";
import { auth } from "../../src/lib/auth/session";
import { prisma } from "../../src/lib/prisma";

describe("GET /api/employees", () => {
  it("returns 401 when unauthenticated", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null);

    const req = new Request("http://localhost/api/employees");
    const res = await GET(req);

    expect(res.status).toBe(401);
  });

  it("returns paginated employees with filters", async () => {
    vi.mocked(auth).mockResolvedValueOnce({ user: { id: "u1" } } as never);
    vi.mocked(prisma.employee.count).mockResolvedValueOnce(3 as never);
    vi.mocked(prisma.employee.findMany).mockResolvedValueOnce([
      { id: 1, employeeNumber: 1001, riskScore: 95, riskLevel: "CRITICAL" },
    ] as never);

    const req = new Request(
      "http://localhost/api/employees?page=1&status=active&dept=Sales&risk=HIGH&q=1001&pageSize=10"
    );
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.total).toBe(3);
    expect(body.totalPages).toBe(1);
    expect(body.data).toHaveLength(1);
    expect(prisma.employee.count).toHaveBeenCalledWith({
      where: {
        isActive: true,
        department: "Sales",
        riskLevel: "HIGH",
        employeeNumber: 1001,
      },
    });
  });
});
