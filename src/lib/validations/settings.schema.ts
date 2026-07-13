import { z } from "zod";

export const settingsSchema = z
  .object({
    mediumRiskThreshold: z.coerce.number().int().min(1).max(98),
    highRiskThreshold: z.coerce.number().int().min(2).max(99),
    criticalRiskThreshold: z.coerce.number().int().min(3).max(100),
  })
  .refine(
    (d) =>
      d.mediumRiskThreshold < d.highRiskThreshold &&
      d.highRiskThreshold < d.criticalRiskThreshold,
    { message: "Os thresholds devem ser crescentes: médio < alto < crítico" }
  );

export type SettingsInput = z.infer<typeof settingsSchema>;
