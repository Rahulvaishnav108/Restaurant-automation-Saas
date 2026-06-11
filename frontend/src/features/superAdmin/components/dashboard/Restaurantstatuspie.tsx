import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
// 1. Fixed the path to go up two levels to find the store folder
import { pieData } from "../../store/Superadmindashboard"; 

// 2. Defined explicit types for the data structures inside your chart slice
interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

interface RestaurantStatusPieProps {
  darkMode: boolean;
}

export default function RestaurantStatusPie({ darkMode }: RestaurantStatusPieProps) {
  return (
    <div
      className={`rounded-xl p-5 border ${
        darkMode
          ? "bg-slate-900/30 border-slate-800/80"
          : "bg-white border-slate-200/60 shadow-sm shadow-slate-100/40"
      }`}
    >
      <div className="mb-1">
        <h3 className="text-base font-bold tracking-tight">Restaurant Status</h3>
        <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          Division allocations
        </p>
      </div>

      <div className="h-[240px] flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData as PieDataItem[]}
              innerRadius={65}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              nameKey="name"
            >
              {/* 3. Added types to the cell renderer loop mapping */}
              {(pieData as PieDataItem[]).map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="outline-none"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? "#0f172a" : "#ffffff",
                borderColor: darkMode ? "#334155" : "#e2e8f0",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold tracking-tight">216</span>
          <span
            className={`text-[9px] font-bold uppercase tracking-wider ${
              darkMode ? "text-slate-500" : "text-slate-400"
            }`}
          >
            Venues
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 text-xs font-medium mt-2">
        {/* 4. Added types to the bottom legend list loops mapping */}
        {(pieData as PieDataItem[]).map((item) => (
          <div key={item.name} className="flex items-center gap-2 py-0.5">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className={darkMode ? "text-slate-400" : "text-slate-600"}>
              {item.name} ({item.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}