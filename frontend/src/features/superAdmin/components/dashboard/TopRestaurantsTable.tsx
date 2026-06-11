import { restaurants } from "../../store/Superadmindashboard"; 

// 1. Define the type structure for a single Restaurant object
interface Restaurant {
  name: string;
  orders: number;
  revenue: string;
  growth: string;
}

interface TopRestaurantsTableProps {
  darkMode: boolean;
}

export default function TopRestaurantsTable({ darkMode }: TopRestaurantsTableProps) {
  return (
    <div
      className={`rounded-xl border overflow-hidden ${
        darkMode
          ? "bg-slate-900/30 border-slate-800/80"
          : "bg-white border-slate-200/60 shadow-sm shadow-slate-100/40"
      }`}
    >
      <div className="p-5 border-b border-inherit">
        <h3 className="text-base font-bold tracking-tight">Top Performing Restaurants</h3>
        <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          Configured via platform transaction audits
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr
              className={`border-b border-inherit uppercase font-semibold tracking-wider ${
                darkMode ? "bg-slate-950 text-slate-400" : "bg-slate-50 text-slate-500"
              }`}
            >
              <th className="py-3 px-5">Restaurant</th>
              <th className="py-3 px-5">Orders</th>
              <th className="py-3 px-5">Gross Revenue</th>
              <th className="py-3 px-5 text-right">Growth Rate</th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              darkMode ? "divide-slate-800/40" : "divide-slate-200/60"
            }`}
          >
            {/* 2. Added explicit type mapping to the loop parameter */}
            {(restaurants as Restaurant[]).map((restaurant) => (
              <tr
                key={restaurant.name}
                className={`transition-colors ${
                  darkMode ? "hover:bg-slate-800/10" : "hover:bg-slate-50"
                }`}
              >
                <td className="py-3.5 px-5 font-semibold text-sm">{restaurant.name}</td>
                <td
                  className={`py-3.5 px-5 font-medium ${
                    darkMode ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {restaurant.orders.toLocaleString()}
                </td>
                <td
                  className={`py-3.5 px-5 font-medium ${
                    darkMode ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {restaurant.revenue}
                </td>
                <td className="py-3.5 px-5 text-emerald-500 font-semibold text-right">
                  {restaurant.growth}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}