"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Thresholds {
  mediumRiskThreshold: number;
  highRiskThreshold: number;
  criticalRiskThreshold: number;
}

export function SettingsForm({ initial }: { initial: Thresholds }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setError(null);
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error?.message ?? "Erro ao salvar");
      return;
    }
    setMsg(`Configurações salvas. ${data.updated} profissionais reclassificados.`);
    router.refresh();
  }

  const field = (key: keyof Thresholds, label: string) => (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        type="number"
        min={1}
        max={100}
        value={values[key]}
        onChange={(e) => setValues((v) => ({ ...v, [key]: Number(e.target.value) }))}
        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
      />
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {field("mediumRiskThreshold", "Médio (≥)")}
        {field("highRiskThreshold", "Alto (≥)")}
        {field("criticalRiskThreshold", "Crítico (≥)")}
      </div>
      <p className="text-xs text-muted">Regra: médio &lt; alto &lt; crítico. Score varia de 0 a 100.</p>
      {error && <p className="text-sm text-risk-critical">{error}</p>}
      {msg && <p className="text-sm text-risk-low">{msg}</p>}
      <button
        disabled={loading}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-fg disabled:opacity-60"
      >
        {loading ? "Salvando..." : "Salvar e recalcular"}
      </button>
    </form>
  );
}
