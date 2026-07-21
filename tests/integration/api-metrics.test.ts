import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/session", () => ({ auth: vi.fn() }));
vi.mock("@/server/services/metrics", () => ({ getDashboardData: vi.fn() }));

import { GET } from "../../src/app/api/metrics/route";
import { auth } from "../../src/lib/auth/session";
import { getDashboardData } from "../../src/server/services/metrics";

describe("GET /api/metrics", () => {
  it("returns 401 when unauthenticated", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("returns metrics payload when authenticated", async () => {
    vi.mocked(auth).mockResolvedValueOnce({ user: { id: "u1" } } as never);
    vi.mocked(getDashboardData).mockResolvedValueOnce({ total: 10 } as never);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.total).toBe(10);
  });
});
