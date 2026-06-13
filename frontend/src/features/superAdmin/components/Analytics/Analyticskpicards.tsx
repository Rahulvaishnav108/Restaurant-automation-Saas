import React from "react";
import { TrendingUp, DollarSign, Utensils, Percent } from "lucide-react";
import { MetricItem } from "../../store/Analytics";

interface AnalyticsKPICardsProps {
  darkMode: boolean;
  metrics: MetricItem[];
  totalVolume: number;
  totalCommission: number;
  averageOrderValue: number;
}

const cardBase = (darkMode: boolean) =>
  `rounded-xl p-5 border transition-all duration-200 hover:shadow-md ${
    darkMode
      ? "bg-slate-900/30 border-slate-800/80 shadow-black/10"
      : "bg-white border-slate-200/60 shadow-sm shadow-slate-100/40"
  }`;

interface StatCardProps {
  darkMode: boolean;
  label: string;
  value: string;
  badge: React.ReactNode;
  icon: React.ReactNode;
  iconBg: string;
}

function StatCard({ darkMode, label, value, badge, icon, iconBg }: StatCardProps) {
  return (
    <div className={cardBase(darkMode)}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className={`text-[10px] font-bold tracking-wider uppercase ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            {label}
          </p>
          <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
          <div className="pt-1">{badge}</div>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsKPICards({
  darkMode,
  metrics,
  totalVolume,
  totalCommission,
  averageOrderValue,
}: AnalyticsKPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Dynamic metric cards from data */}
      {metrics.map((item, index) => {
        const Icon = item.icon;
        return (
          <StatCard
            key={index}
            darkMode={darkMode}
            label={item.label}
            value={item.current}
            badge={
              <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
                <TrendingUp size={12} />
                <span>{item.shift}</span>
              </div>
            }
            icon={<Icon size={18} />}
            iconBg={darkMode ? item.darkBg : item.lightBg}
          />
        );
      })}

      {/* Gross Terminal GMV */}
      <StatCard
        darkMode={darkMode}
        label="Gross Terminal GMV"
        value={`$${totalVolume.toLocaleString()}`}
        badge={
          <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
            <TrendingUp size={12} />
            <span>+18.4% premium</span>
          </div>
        }
        icon={<DollarSign size={18} />}
        iconBg={darkMode ? "bg-emerald-500/10 text-emerald-500" : "bg-emerald-50 text-emerald-600"}
      />

      {/* AOV / Revenue Cut */}
      <StatCard
        darkMode={darkMode}
        label="AOV / Revenue Cut"
        value={`$${averageOrderValue} AOV`}
        badge={
          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
            <Percent size={12} />
            <span>Total Comm: ${totalCommission}</span>
          </div>
        }
        icon={<Utensils size={18} />}
        iconBg={darkMode ? "bg-orange-500/10 text-orange-500" : "bg-orange-50 text-orange-600"}
      />
    </div>
  );
}