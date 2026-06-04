"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const axisStyle = { fontSize: 11, fill: "hsl(var(--muted-foreground))" };

function TooltipBox({ active, payload, label, money }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-xl">
      {label && <p className="mb-1 font-medium">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="flex items-center gap-2 text-muted-foreground">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: p.color || p.fill }}
          />
          <span className="capitalize">{p.name}:</span>
          <span className="font-medium text-foreground">
            {money ? formatCurrency(p.value) : p.value}
          </span>
        </p>
      ))}
    </div>
  );
}

export function AreaTrend({
  data,
  dataKeys,
  money = true,
  height = 280,
}: {
  data: any[];
  dataKeys: { key: string; color: string }[];
  money?: boolean;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ left: -18, right: 8, top: 8 }}>
        <defs>
          {dataKeys.map((dk) => (
            <linearGradient
              key={dk.key}
              id={`grad-${dk.key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={dk.color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={dk.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={axisStyle} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={axisStyle}
          width={48}
          tickFormatter={(v) => (money ? `$${v / 1000}k` : `${v}`)}
        />
        <Tooltip content={<TooltipBox money={money} />} cursor={{ stroke: "hsl(var(--border))" }} />
        {dataKeys.map((dk) => (
          <Area
            key={dk.key}
            type="monotone"
            dataKey={dk.key}
            stroke={dk.color}
            strokeWidth={2}
            fill={`url(#grad-${dk.key})`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BarSeries({
  data,
  dataKey,
  color = "#2563EB",
  money = true,
  height = 280,
}: {
  data: any[];
  dataKey: string;
  color?: string;
  money?: boolean;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ left: -18, right: 8, top: 8 }}>
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={axisStyle} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={axisStyle}
          width={48}
          tickFormatter={(v) => (money ? `$${v / 1000}k` : `${v}`)}
        />
        <Tooltip content={<TooltipBox money={money} />} cursor={{ fill: "hsl(var(--accent))" }} />
        <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} maxBarSize={42} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({
  data,
  height = 240,
}: {
  data: { name: string; value: number; color: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={62}
          outerRadius={92}
          paddingAngle={3}
          stroke="none"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<TooltipBox money={false} />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
