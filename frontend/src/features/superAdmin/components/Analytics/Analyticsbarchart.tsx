import React from "react";
import { BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { BarSeriesItem } from "../../store/Analytics";

interface AnalyticsBarChartProps {
  darkMode: boolean;
  data: BarSeriesItem[];
}

export default function AnalyticsBarChart({ darkMode, data }: AnalyticsBarChartProps) {
  const tooltipStyle = darkMode
    ? { backgroundColor: "#0f172a", color: "#f8fafc" }
    : { backgroundColor: "#ffffff", color: "#0f172a" };

  return (
    <div
      className={`lg:col-span-2 rounded-xl p-5 border ${
        darkMode
          ? "bg-slate-900/30 border-slate-800/80"
          : "bg-white border-slate-200/60 shadow-sm shadow-slate-100/40"
      }`}
    >
      <div className="mb-4">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <BarChart3 size={16} /> Cluster Operations Load
        </h3>
        <p className={`text-[13px] ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          Throughput balance configurations
        </p>
      </div>

      <div className="h-[260px] sm:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkMode ? "#1e293b" : "#e2e8f0"}
              vertical={false}
            />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "11px" }}
              stroke={darkMode ? "#64748b" : "#94a3b8"}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "11px" }}
              stroke={darkMode ? "#64748b" : "#94a3b8"}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Bar name="Active Clusters" dataKey="load" fill="#f97316" radius={[4, 4, 0, 0]} />
            <Bar name="Staging Subnets" dataKey="capacity" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}