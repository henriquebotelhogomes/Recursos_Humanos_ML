import { describe, expect, it } from "vitest";

import { loginSchema, registerSchema } from "../../src/lib/validations/auth.schema";
import { settingsSchema } from "../../src/lib/validations/settings.schema";

describe("auth schemas", () => {
  it("accepts demo login identifier", () => {
    const result = loginSchema.safeParse({ email: "demo123", password: "x" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email when not demo identifier", () => {
    const result = loginSchema.safeParse({ email: "invalid", password: "x" });
    expect(result.success).toBe(false);
  });

  it("rejects mismatched register passwords", () => {
    const result = registerSchema.safeParse({
      name: "Henri",
      email: "henri@example.com",
      password: "123456",
      confirmPassword: "000000",
    });
    expect(result.success).toBe(false);
  });
});

describe("settings schema", () => {
  it("accepts valid and increasing thresholds", () => {
    const result = settingsSchema.safeParse({
      mediumRiskThreshold: 20,
      highRiskThreshold: 50,
      criticalRiskThreshold: 80,
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-increasing thresholds", () => {
    const result = settingsSchema.safeParse({
      mediumRiskThreshold: 70,
      highRiskThreshold: 60,
      criticalRiskThreshold: 80,
    });
    expect(result.success).toBe(false);
  });
});
