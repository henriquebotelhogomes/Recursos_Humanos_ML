import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { SettingsForm } from "@/components/settings/settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const config = await prisma.riskConfig.findUnique({ where: { id: 1 } });

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Configurações"
        subtitle="Ajuste os limiares de risco. A alteração reclassifica os níveis sem re-treinar o modelo."
      />
      <Card>
        <SettingsForm
          initial={{
            mediumRiskThreshold: config?.mediumRiskThreshold ?? 35,
            highRiskThreshold: config?.highRiskThreshold ?? 60,
            criticalRiskThreshold: config?.criticalRiskThreshold ?? 80,
          }}
        />
      </Card>
    </div>
  );
}
