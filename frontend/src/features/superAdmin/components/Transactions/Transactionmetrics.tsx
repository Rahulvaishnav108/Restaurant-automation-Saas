// components/TransactionMetrics.tsx

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

import type { MetricSummary } from "./Transactiontypes";

import { formatCurrency } from "../../utils/transactionUtils";
interface TransactionMetricsProps {
  metrics: MetricSummary;
  darkMode: boolean;
}

interface KpiCardProps {
  label: string;
  value: string;
  sub: string;
  subPositive?: boolean;
  icon: React.ReactNode;
  iconBg: string;
  darkMode: boolean;
  accent?: string;
}

function KpiCard({ label, value, sub, subPositive, icon, iconBg, darkMode, accent }: KpiCardProps) {
  return (
    <div className={`rounded-xl p-5 border transition-all duration-200 hover:shadow-lg group ${
      darkMode
        ? "bg-slate-900/40 border-slate-800/80"
        : "bg-white border-slate-200/60 shadow-sm"
    }`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1 min-w-0">
          <p className={`text-[11px] font-bold tracking-wider uppercase ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            {label}
          </p>
          <h3 className={`text-2xl font-extrabold tracking-tight ${accent ?? (darkMode ? "text-slate-100" : "text-slate-900")}`}>
            {value}
          </h3>
          <div className={`flex items-center gap-1 text-xs font-semibold pt-0.5 ${
            subPositive === true ? "text-emerald-500" : subPositive === false ? "text-rose-500" : darkMode ? "text-slate-400" : "text-slate-500"
          }`}>
            {subPositive === true && <TrendingUp size={11} />}
            {subPositive === false && <TrendingDown size={11} />}
            <span>{sub}</span>
          </div>
        </div>
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${iconBg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function TransactionMetrics({ metrics, darkMode }: TransactionMetricsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

      <KpiCard
        label="Total Revenue"
        value={formatCurrency(metrics.totalRevenue)}
        sub="+24.5% from last period"
        subPositive={true}
        icon={<DollarSign size={19} />}
        iconBg={darkMode ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}
        darkMode={darkMode}
        accent="text-blue-500"
      />

      <KpiCard
        label="Commission Earned"
        value={formatCurrency(metrics.totalCommission)}
        sub={`Avg rate: ${metrics.avgCommissionRate.toFixed(1)}%`}
        icon={<Percent size={19} />}
        iconBg={darkMode ? "bg-orange-500/10 text-orange-400" : "bg-orange-50 text-orange-600"}
        darkMode={darkMode}
        accent="text-orange-500"
      />

      <KpiCard
        label="Success Rate"
        value={`${metrics.successRate}%`}
        sub={`${metrics.completedCount} of ${metrics.totalTransactions} completed`}
        subPositive={metrics.successRate >= 70}
        icon={<CheckCircle2 size={19} />}
        iconBg={darkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"}
        darkMode={darkMode}
        accent="text-emerald-500"
      />

      <KpiCard
        label="Avg Order Value"
        value={formatCurrency(metrics.avgOrderValue)}
        sub={`${metrics.pendingCount} pending · ${metrics.failedCount} failed · ${metrics.refundedCount} refunded`}
        icon={<RefreshCw size={19} />}
        iconBg={darkMode ? "bg-purple-500/10 text-purple-400" : "bg-purple-50 text-purple-600"}
        darkMode={darkMode}
        accent={darkMode ? "text-slate-100" : "text-slate-900"}
      />

    </div>
  );
}