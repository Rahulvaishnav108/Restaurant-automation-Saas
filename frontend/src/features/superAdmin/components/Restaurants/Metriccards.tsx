// components/MetricCards.tsx

import { SlidersHorizontal, TrendingUp } from "lucide-react";

// Explicitly define or align the filter type union locally to prevent build pipeline failures
export type StatusFilter = "All" | "Active" | "Trial" | "Inactive";

interface Metrics {
  total: number;
  active: number;
  trial: number;
  branches: number;
}

interface MetricCardsProps {
  metrics: Metrics;
  statusFilter: StatusFilter;
  darkMode: boolean;
  onFilterChange: (filter: StatusFilter) => void;
}

export default function MetricCards({ metrics, statusFilter, darkMode, onFilterChange }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

      {/* Total Card */}
      <button
        type="button"
        onClick={() => onFilterChange("All")}
        className={`text-left rounded-xl p-5 border transition-all duration-200 group relative overflow-hidden ${
          statusFilter === "All"
            ? "border-orange-500 ring-2 ring-orange-500/20 bg-orange-500/5 shadow-lg"
            : darkMode
            ? "bg-slate-900/40 border-slate-800/80 hover:border-slate-700"
            : "bg-white border-slate-200/80 hover:shadow-md"
        }`}
      >
        <p className={`text-xs font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Total Restaurants</p>
        <h3 className={`text-3xl font-extrabold tracking-tight mt-2 ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
          {metrics.total}
        </h3>
        <div className={`absolute right-4 bottom-4 opacity-10 group-hover:opacity-20 transition-opacity ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          <SlidersHorizontal size={40} />
        </div>
      </button>

      {/* Active Card */}
      <button
        type="button"
        onClick={() => onFilterChange("Active")}
        className={`text-left rounded-xl p-5 border transition-all duration-200 group relative overflow-hidden ${
          statusFilter === "Active"
            ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500/5 shadow-lg"
            : darkMode
            ? "bg-slate-900/40 border-slate-800/80 hover:border-slate-700"
            : "bg-white border-slate-200/80 hover:shadow-md"
        }`}
      >
        <p className={`text-xs font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Active Status</p>
        <h3 className="text-3xl font-extrabold tracking-tight mt-2 text-emerald-500">{metrics.active}</h3>
        <span className="text-[10px] text-emerald-500/80 font-medium flex items-center gap-1 mt-1">
          <TrendingUp size={12} /> Live Processing
        </span>
      </button>

      {/* Trial Card */}
      <button
        type="button"
        onClick={() => onFilterChange("Trial")}
        className={`text-left rounded-xl p-5 border transition-all duration-200 group relative overflow-hidden ${
          statusFilter === "Trial"
            ? "border-orange-400 ring-2 ring-orange-400/20 bg-orange-400/5 shadow-lg"
            : darkMode
            ? "bg-slate-900/40 border-slate-800/80 hover:border-slate-700"
            : "bg-white border-slate-200/80 hover:shadow-md"
        }`}
      >
        <p className={`text-xs font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Trial Mode Window</p>
        <h3 className="text-3xl font-extrabold tracking-tight mt-2 text-orange-400">{metrics.trial}</h3>
        <span className="text-[10px] text-orange-400/80 font-medium flex items-center gap-1 mt-1">
          Requires conversion pipeline
        </span>
      </button>

      {/* Aggregated Branches Card */}
      <div className={`rounded-xl p-5 border transition-all ${
        darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200/80"
      }`}>
        <p className={`text-xs font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Aggregated Branches</p>
        <h3 className="text-3xl font-extrabold tracking-tight mt-2 text-blue-500">{metrics.branches}</h3>
        <span className={`text-[10px] font-medium block mt-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
          Cross-regional footprint
        </span>
      </div>

    </div>
  );
}