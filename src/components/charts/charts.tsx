"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const axisProps = {
  tick: { fill: "rgb(var(--muted))", fontSize: 12 },
  stroke: "rgb(var(--border))",
};

const tooltipStyle = {
  backgroundColor: "rgb(var(--card))",
  border: "1px solid rgb(var(--border))",
  borderRadius: 12,
  color: "rgb(var(--fg))",
};

export function GroupedBar({
  data,
  keys,
  colors,
}: {
  data: Record<string, unknown>[];
  keys: { key: string; label: string }[];
  colors: string[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" opacity={0.5} />
        <XAxis dataKey="name" {...axisProps} angle={-15} textAnchor="end" height={50} interval={0} />
        <YAxis {...axisProps} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgb(var(--border))", opacity: 0.3 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {keys.map((k, i) => (
          <Bar key={k.key} dataKey={k.key} name={k.label} fill={colors[i]} radius={[4, 4, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SimpleBar({
  data,
  color = "rgb(var(--primary))",
}: {
  data: { bucket: string; count: number }[];
  color?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" opacity={0.5} />
        <XAxis dataKey="bucket" {...axisProps} angle={-25} textAnchor="end" height={54} interval={0} />
        <YAxis {...axisProps} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgb(var(--border))", opacity: 0.3 }} />
        <Bar dataKey="count" name="Profissionais" fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

const RISK_COLORS: Record<string, string> = {
  LOW: "rgb(var(--risk-low))",
  MEDIUM: "rgb(var(--risk-medium))",
  HIGH: "rgb(var(--risk-high))",
  CRITICAL: "rgb(var(--risk-critical))",
};

export function StackedRisk({ data }: { data: Record<string, unknown>[] }) {
  const keys = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
  const labels: Record<string, string> = {
    LOW: "Baixo",
    MEDIUM: "Médio",
    HIGH: "Alto",
    CRITICAL: "Crítico",
  };
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" opacity={0.5} />
        <XAxis dataKey="name" {...axisProps} angle={-15} textAnchor="end" height={50} interval={0} />
        <YAxis {...axisProps} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgb(var(--border))", opacity: 0.3 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {keys.map((k) => (
          <Bar key={k} dataKey={k} name={labels[k]} stackId="risk" fill={RISK_COLORS[k]}>
            {data.map((_, i) => (
              <Cell key={i} />
            ))}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
