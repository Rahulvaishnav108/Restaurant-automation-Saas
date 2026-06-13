import React from "react";
import { PieChart as PieIcon } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { DistributionItem } from "../../store/Analytics";
interface AnalyticsPieChartProps {
  darkMode: boolean;
  data: DistributionItem[];
}

export default function AnalyticsPieChart({ darkMode, data }: AnalyticsPieChartProps) {
  const tooltipStyle = darkMode
    ? { backgroundColor: "#0f172a", color: "#f8fafc" }
    : { backgroundColor: "#ffffff", color: "#0f172a" };

  return (
    <div
      className={`rounded-xl p-5 border ${
        darkMode
          ? "bg-slate-900/30 border-slate-800/80"
          : "bg-white border-slate-200/60 shadow-sm shadow-slate-100/40"
      }`}
    >
      <div className="mb-2">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <PieIcon size={16} /> Deployment Architecture
        </h3>
        <p className={`text-[13px] ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          Core allocation mapping
        </p>
      </div>

      {/* Donut chart with centred label */}
      <div className="h-[220px] w-full flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="allocation"
              nameKey="division"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.Hex} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-xl font-bold tracking-tight">100%</span>
          <span
            className={`text-[9px] font-bold uppercase tracking-wider ${
              darkMode ? "text-slate-500" : "text-slate-400"
            }`}
          >
            Configured
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-1.5 mt-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.Hex }} />
              <span className={darkMode ? "text-slate-400" : "text-slate-600"}>
                {item.division}
              </span>
            </div>
            <span className="font-bold">{item.allocation}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}