// components/TransactionSummaryBar.tsx

import type { MetricSummary } from "./Transactiontypes";
import { formatCurrency } from "../../utils/transactionUtils";

interface TransactionSummaryBarProps {
  metrics: MetricSummary;
  darkMode: boolean;
  filteredCount: number;
}

export default function TransactionSummaryBar({ metrics, darkMode, filteredCount }: TransactionSummaryBarProps) {
  return (
    <div className={`mt-4 rounded-xl border px-5 py-3.5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs ${
      darkMode ? "bg-slate-900/30 border-slate-800/80" : "bg-slate-50/60 border-slate-200/60"
    }`}>
      <span className={`font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
        Summary:
      </span>

      <span className={darkMode ? "text-slate-300" : "text-slate-700"}>
        <span className={`font-bold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{filteredCount}</span>
        {" "}transactions shown
      </span>

      <div className={`h-4 w-px ${darkMode ? "bg-slate-800" : "bg-slate-300"}`} />

      <span className={darkMode ? "text-slate-300" : "text-slate-700"}>
        <span className="font-bold text-emerald-500">{metrics.completedCount}</span> completed ·{" "}
        <span className="font-bold text-amber-500">{metrics.pendingCount}</span> pending ·{" "}
        <span className="font-bold text-rose-500">{metrics.failedCount}</span> failed ·{" "}
        <span className={`font-bold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{metrics.refundedCount}</span> refunded
      </span>

      <div className={`h-4 w-px ${darkMode ? "bg-slate-800" : "bg-slate-300"}`} />

      <span className={darkMode ? "text-slate-300" : "text-slate-700"}>
        Total revenue: <span className="font-bold text-blue-500">{formatCurrency(metrics.totalRevenue)}</span>
      </span>

      <span className={darkMode ? "text-slate-300" : "text-slate-700"}>
        Commission: <span className="font-bold text-orange-500">{formatCurrency(metrics.totalCommission)}</span>
      </span>
    </div>
  );
}