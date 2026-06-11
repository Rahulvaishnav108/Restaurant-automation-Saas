import { TrendingUp } from "lucide-react";
// 1. Fixed the path to go up two levels to find the store folder
import { stats } from "../../store/Superadmindashboard"; 

// 2. Defined explicit interfaces so TypeScript understands the stat object and its dynamic Lucide icon component
interface StatItem {
  title: string;
  value: string | number;
  growth: string;
  icon: React.ComponentType<{ size?: number }>;
  lightColor: string;
  darkColor: string;
}

interface StatsGridProps {
  darkMode: boolean;
}

export default function StatsGrid({ darkMode }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {/* 3. Explicitly typed the loop target */}
      {(stats as StatItem[]).map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className={`rounded-xl p-5 border transition-all duration-200 hover:shadow-md ${
              darkMode
                ? "bg-slate-900/30 border-slate-800/80 shadow-black/10"
                : "bg-white border-slate-200/60 shadow-sm shadow-slate-100/40"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p
                  className={`text-[11px] font-semibold tracking-wider uppercase ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
                <div className="flex items-center gap-1 text-emerald-500 text-xs font-semibold pt-1">
                  <TrendingUp size={12} />
                  <span>{stat.growth}</span>
                </div>
              </div>
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  darkMode ? stat.darkColor : stat.lightColor
                }`}
              >
                <Icon size={18} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}