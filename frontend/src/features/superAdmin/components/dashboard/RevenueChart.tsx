import {
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
// 1. Fixed the path to go up two levels to find the store folder
import { revenueData } from "../../store/Superadmindashboard"; 

// 2. Defined explicit structure for your graph data point objects
interface RevenueDataPoint {
  month: string;
  revenue: number;
  orders: number;
}

interface RevenueChartProps {
  darkMode: boolean;
}

export default function RevenueChart({ darkMode }: RevenueChartProps) {
  return (
    <div
      className={`lg:col-span-2 rounded-xl p-5 border ${
        darkMode
          ? "bg-slate-900/30 border-slate-800/80"
          : "bg-white border-slate-200/60 shadow-sm shadow-slate-100/40"
      }`}
    >
      <div className="mb-4">
        <h3 className="text-base font-bold tracking-tight">Revenue & Orders Trend</h3>
        <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          Performance trajectory parameters
        </p>
      </div>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            // 3. Cast data array so Recharts chart handles properties cleanly
            data={revenueData as RevenueDataPoint[]}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkMode ? "#1e293b" : "#e2e8f0"}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "11px", fontWeight: 500 }}
              stroke={darkMode ? "#64748b" : "#94a3b8"}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "11px", fontWeight: 500 }}
              stroke={darkMode ? "#64748b" : "#94a3b8"}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? "#0f172a" : "#ffffff",
                borderColor: darkMode ? "#334155" : "#e2e8f0",
                borderRadius: "8px",
                fontSize: "12px",
                color: darkMode ? "#f8fafc" : "#0f172a",
              }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }}
            />
            <Line
              type="monotone"
              name="Revenue ($)"
              dataKey="revenue"
              stroke="#f97316"
              strokeWidth={2.5}
              dot={{ r: 3, strokeWidth: 1.5 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              name="Orders"
              dataKey="orders"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ r: 3, strokeWidth: 1.5 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}