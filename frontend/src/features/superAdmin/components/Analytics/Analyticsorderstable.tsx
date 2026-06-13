import React from "react";
import {
  Utensils,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { PlatformOrder, OrderStatus } from "../../store/Analytics";

const STATUS_TABS = ["All", "Settled", "Processing", "Disputed"] as const;

interface AnalyticsOrdersTableProps {
  darkMode: boolean;
  orders: PlatformOrder[];
  searchQuery: string;
  statusTab: string;
  onSearchChange: (v: string) => void;
  onTabChange: (tab: string) => void;
}

const statusConfig: Record<
  OrderStatus,
  { color: string; Icon: React.ElementType }
> = {
  Settled: { color: "bg-emerald-500/10 text-emerald-500", Icon: CheckCircle2 },
  Processing: { color: "bg-blue-500/10 text-blue-500", Icon: Clock },
  Disputed: { color: "bg-rose-500/10 text-rose-500", Icon: XCircle },
};

export default function AnalyticsOrdersTable({
  darkMode,
  orders,
  searchQuery,
  statusTab,
  onSearchChange,
  onTabChange,
}: AnalyticsOrdersTableProps) {
  return (
    <div
      className={`rounded-xl border p-4 sm:p-6 space-y-5 ${
        darkMode
          ? "bg-slate-900/20 border-slate-800/80 shadow-xl shadow-black/5"
          : "bg-white border-slate-200/60 shadow-sm"
      }`}
    >
      {/* Table header row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold tracking-tight flex items-center gap-2">
            <Utensils size={18} className="text-orange-500" />
            Connected Restaurant Outlets Matrix
          </h3>
          <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Real-time clearing node balance configurations and fee streams.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                darkMode ? "text-slate-500" : "text-slate-400"
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search branch nodes..."
              className={`pl-9 pr-4 py-2 text-xs rounded-lg outline-none border transition-all w-full sm:min-w-[220px] ${
                darkMode
                  ? "bg-slate-950/60 border-slate-800 focus:border-orange-500/50 text-slate-100"
                  : "bg-slate-50 border-slate-200 focus:border-orange-500/50 text-slate-900"
              }`}
            />
          </div>

          {/* Status tabs */}
          <div
            className={`p-1 rounded-lg border flex gap-1 ${
              darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-100 border-slate-200"
            }`}
          >
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                  statusTab === tab
                    ? "bg-orange-500 text-white shadow"
                    : darkMode
                    ? "text-slate-400 hover:text-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-inherit">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr
              className={`border-b border-inherit uppercase font-bold tracking-wider text-[10px] ${
                darkMode ? "bg-slate-950 text-slate-400" : "bg-slate-50 text-slate-500"
              }`}
            >
              {[
                "Node Hash",
                "Restaurant Franchise",
                "Channel Route",
                "Gross Vol",
                "10% Platform Cut",
                "Cluster Health",
                "Activity Log",
              ].map((col) => (
                <th
                  key={col}
                  className={`py-3 px-4 ${col === "Activity Log" ? "text-right" : ""}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody
            className={`divide-y ${
              darkMode ? "divide-slate-800/60" : "divide-slate-200/60"
            }`}
          >
            {orders.length > 0 ? (
              orders.map((order) => {
                const { color, Icon } = statusConfig[order.status];
                return (
                  <tr
                    key={order.id}
                    className={`transition-colors ${
                      darkMode ? "hover:bg-slate-900/40" : "hover:bg-slate-50/80"
                    }`}
                  >
                    <td
                      className={`py-3.5 px-4 font-mono font-bold ${
                        darkMode ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {order.id}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-sm whitespace-nowrap">
                      {order.restaurant}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          darkMode
                            ? "bg-slate-950 text-slate-300"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {order.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold whitespace-nowrap">
                      ${order.grossAmount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-orange-500 whitespace-nowrap">
                      +${order.commission}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${color}`}
                      >
                        <Icon size={11} />
                        {order.status}
                      </span>
                    </td>

                    <td
                      className={`py-3.5 px-4 text-right whitespace-nowrap font-medium ${
                        darkMode ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {order.timestamp}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8 font-medium text-slate-400">
                  No branch node telemetry records match criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}