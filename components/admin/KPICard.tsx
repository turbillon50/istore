"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

interface SparklineData {
  value: number;
}

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number; // percentage, positive = up, negative = down
  trendLabel?: string;
  icon: LucideIcon;
  sparklineData?: SparklineData[];
  variant?: "default" | "warning" | "danger" | "success";
  prefix?: string;
  suffix?: string;
}

const variantColors = {
  default: {
    icon: "text-[#2563eb]",
    iconBg: "bg-[#2563eb]/10",
    sparkline: "#2563eb",
  },
  warning: {
    icon: "text-yellow-400",
    iconBg: "bg-yellow-400/10",
    sparkline: "#facc15",
  },
  danger: {
    icon: "text-red-400",
    iconBg: "bg-red-400/10",
    sparkline: "#f87171",
  },
  success: {
    icon: "text-emerald-400",
    iconBg: "bg-emerald-400/10",
    sparkline: "#34d399",
  },
};

export default function KPICard({
  title,
  value,
  trend,
  trendLabel,
  icon: Icon,
  sparklineData,
  variant = "default",
  prefix = "",
  suffix = "",
}: KPICardProps) {
  const colors = variantColors[variant];
  const hasTrend = trend !== undefined;
  const trendUp = hasTrend && trend > 0;
  const trendDown = hasTrend && trend < 0;
  const trendNeutral = hasTrend && trend === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 overflow-hidden group hover:border-[#333] transition-colors"
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top left, rgba(37, 99, 235,0.04) 0%, transparent 70%)" }}
      />

      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[#a3a3a3] text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            {prefix && <span className="text-[#a3a3a3] text-sm">{prefix}</span>}
            <span className="text-[#e5e5e5] text-2xl font-bold tabular-nums">{value}</span>
            {suffix && <span className="text-[#a3a3a3] text-sm">{suffix}</span>}
          </div>
        </div>
        <div className={`p-2.5 rounded-lg ${colors.iconBg} flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
      </div>

      {/* Trend + Sparkline row */}
      <div className="flex items-end justify-between gap-3">
        {hasTrend && (
          <div className="flex items-center gap-1.5">
            {trendUp && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
            {trendDown && <TrendingDown className="w-3.5 h-3.5 text-red-400" />}
            {trendNeutral && <Minus className="w-3.5 h-3.5 text-[#a3a3a3]" />}
            <span className={`text-xs font-medium ${trendUp ? "text-emerald-400" : trendDown ? "text-red-400" : "text-[#a3a3a3]"}`}>
              {trendUp ? "+" : ""}{trend}%
            </span>
            {trendLabel && (
              <span className="text-xs text-[#525252]">{trendLabel}</span>
            )}
          </div>
        )}

        {sparklineData && sparklineData.length > 0 && (
          <div className="w-24 h-10 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={colors.sparkline}
                  strokeWidth={1.5}
                  dot={false}
                  strokeLinecap="round"
                />
                <Tooltip
                  contentStyle={{ display: "none" }}
                  cursor={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
}
