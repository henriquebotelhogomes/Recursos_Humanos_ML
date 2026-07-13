import { cn } from "@/lib/utils";
import { RISK_META, type RiskLevel } from "@/lib/risk/risk-level";

export function RiskBadge({ level }: { level: RiskLevel | null | undefined }) {
  if (!level) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/15 px-2.5 py-1 text-xs font-medium text-muted">
        —
      </span>
    );
  }
  const meta = RISK_META[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        meta.className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}
