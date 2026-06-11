// src/features/superAdmin/pages/Analytics.tsx

import React, { useState } from "react"; // Fixed: Removed unused useEffect
import { useOutletContext } from "react-router-dom";
import {
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Utensils,
  DollarSign,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  RefreshCw,
  Percent,
  PlusCircle
} from "lucide-react"; // Fixed: Removed unused Sun, Moon, Bell

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";

// IMPORT DECOUPLED STORES AND DATA HOOK STRUCTS
import { 
  metricsData, 
  barSeries, 
  distributionSeries, 
  mockPlatformOrders 
} from "../store/Analytics";

interface LayoutContextType {
  darkMode: boolean;
}

export default function PlatformInfrastructureMatrix() {
  // Pull dark mode state directly from the global layout outlet wrapper context
  const { darkMode } = useOutletContext<LayoutContextType>();

  // INTERACTIVE FILTER STATES
  const [searchQuery, setSearchQuery] = useState("");
  const [statusTab, setStatusTab] = useState("All");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // DATA PIPELINE COMPUTATIONS
  const totalVolume = mockPlatformOrders.reduce((acc, curr) => acc + curr.grossAmount, 0);
  const totalCommission = mockPlatformOrders.reduce((acc, curr) => acc + curr.commission, 0);
  const averageOrderValue = Math.round(totalVolume / mockPlatformOrders.length);

  const filteredOrders = mockPlatformOrders.filter(order => {
    const matchesSearch = order.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) || order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = statusTab === "All" || order.status === statusTab;
    return matchesSearch && matchesTab;
  });

  // METRIC EXPORT HANDLER
  const handleExportCSV = () => {
    const headers = "Transaction_ID,Restaurant,Route,Gross_Amount,Commission,Status\n";
    const rows = mockPlatformOrders.map(o => `${o.id},"${o.restaurant}",${o.type},${o.grossAmount},${o.commission},${o.status}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `superadmin_franchise_report_${new Date().toISOString().slice(0,10)}.csv`);
    a.click();
  };

  // TELEMETRY SYNC LOADER SIMULATOR
  const handleSyncTelemetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
      darkMode ? "bg-[#020817] text-slate-100" : "bg-[#F8FAFC] text-slate-900"
    }`}>

      {/* MAIN VIEWPORT MATRIX DASHBOARD */}
      <main className="w-full px-4 sm:px-8 py-8 max-w-[1600px] mx-auto space-y-6">
        
        {/* DASHBOARD ACTIONS MODULE CONTROLLER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">System Core Matrix</h2>
            <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Telemetry routing, resource allocation matrices, and cluster state logs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSyncTelemetry}
              type="button"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                darkMode ? "bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-200" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
            >
              <RefreshCw size={13} className={isRefreshing ? "animate-spin text-orange-500" : ""} />
              <span>{isRefreshing ? "Syncing..." : "Sync Systems"}</span>
            </button>

            <button
              onClick={handleExportCSV}
              type="button"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                darkMode ? "bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-200" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
            >
              <Download size={13} className="text-blue-500" />
              <span>Export Ledger</span>
            </button>

            <button
              onClick={() => alert("System Diagnostics: All Server Clusters Operational.")}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-sm hover:opacity-95 transition-all"
            >
              <PlusCircle size={13} />
              <span>Onboard Franchise</span>
            </button>
          </div>
        </div>

        {/* METRICS TRACKING GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metricsData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className={`rounded-xl p-5 border transition-all duration-200 hover:shadow-md ${
                  darkMode ? "bg-slate-900/30 border-slate-800/80 shadow-black/10" : "bg-white border-slate-200/60 shadow-sm shadow-slate-100/40"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className={`text-[10px] font-bold tracking-wider uppercase ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      {item.label}
                    </p>
                    <h3 className="text-2xl font-bold tracking-tight">{item.current}</h3>
                    <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold pt-1">
                      <TrendingUp size={12} />
                      <span>{item.shift}</span>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? item.darkBg : item.lightBg}`}>
                    <IconComponent size={18} />
                  </div>
                </div>
              </div>
            );
          })}

          <div className={`rounded-xl p-5 border transition-all duration-200 hover:shadow-md ${
            darkMode ? "bg-slate-900/30 border-slate-800/80 shadow-black/10" : "bg-white border-slate-200/60 shadow-sm shadow-slate-100/40"
          }`}>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className={`text-[10px] font-bold tracking-wider uppercase ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Gross Terminal GMV
                </p>
                <h3 className="text-2xl font-bold tracking-tight">${totalVolume.toLocaleString()}</h3>
                <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold pt-1">
                  <TrendingUp size={12} />
                  <span>+18.4% premium</span>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? "bg-emerald-500/10 text-emerald-500" : "bg-emerald-50 text-emerald-600"}`}>
                <DollarSign size={18} />
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-5 border transition-all duration-200 hover:shadow-md ${
            darkMode ? "bg-slate-900/30 border-slate-800/80 shadow-black/10" : "bg-white border-slate-200/60 shadow-sm shadow-slate-100/40"
          }`}>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className={`text-[10px] font-bold tracking-wider uppercase ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  AOV / Revenue Cut
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-orange-500">${averageOrderValue} AOV</h3>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold pt-1">
                  <Percent size={12} />
                  <span>Total Comm: ${totalCommission}</span>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? "bg-orange-500/10 text-orange-500" : "bg-orange-50 text-orange-600"}`}>
                <Utensils size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* DATA VISUALIZATION BLOCK CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-2 rounded-xl p-5 border ${darkMode ? "bg-slate-900/30 border-slate-800/80" : "bg-white border-slate-200/60 shadow-sm shadow-slate-100/40"}`}>
            <div className="mb-4">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <BarChart3 size={16} /> Cluster Operations Load
              </h3>
              <p className={`text-[13px] ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Throughput balance configurations
              </p>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barSeries} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1e293b" : "#e2e8f0"} vertical={false} />
                  <XAxis dataKey="period" tickLine={false} axisLine={false} style={{ fontSize: "11px" }} stroke={darkMode ? "#64748b" : "#94a3b8"} />
                  <YAxis tickLine={false} axisLine={false} style={{ fontSize: "11px" }} stroke={darkMode ? "#64748b" : "#94a3b8"} />
                  <Tooltip contentStyle={darkMode ? { backgroundColor: "#0f172a", color: "#f8fafc" } : { backgroundColor: "#ffffff", color: "#0f172a" }} />
                  <Legend />
                  <Bar key="load-bars" name="Active Clusters" dataKey="load" fill="#f97316" />
                  <Bar key="capacity-bars" name="Staging Subnets" dataKey="capacity" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`rounded-xl p-5 border ${darkMode ? "bg-slate-900/30 border-slate-800/80" : "bg-white border-slate-200/60 shadow-sm shadow-slate-100/40"}`}>
            <div className="mb-2">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <PieIcon size={16} /> Deployment Architecture
              </h3>
              <p className={`text-[13px] ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Core allocation mapping
              </p>
            </div>

            <div className="h-[220px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie data={distributionSeries} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="allocation" nameKey="division">
                    {distributionSeries.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.Hex} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={darkMode ? { backgroundColor: "#0f172a", color: "#f8fafc" } : { backgroundColor: "#ffffff", color: "#0f172a" }} />
                </RechartsPieChart>
              </ResponsiveContainer>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold tracking-tight">100%</span>
                <span className={`text-[9px] font-bold uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                  Configured
                </span>
              </div>
            </div>

            <div className="space-y-1.5 mt-2">
              {distributionSeries.map((item, index) => (
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
        </div>

        {/* DATA TABLE MODULAR MANIFEST */}
        <div className={`rounded-xl border p-6 space-y-6 ${darkMode ? "bg-slate-900/20 border-slate-800/80 shadow-xl shadow-black/5" : "bg-white border-slate-200/60 shadow-sm"}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold tracking-tight flex items-center gap-2">
                <Utensils size={18} className="text-orange-500" /> Connected Restaurant Outlets Matrix
              </h3>
              <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Real-time clearing node balance configurations and fee streams.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search branch nodes..."
                  className={`pl-9 pr-4 py-2 text-xs rounded-lg outline-none border transition-all min-w-[220px] ${
                    darkMode ? "bg-slate-950/60 border-slate-800 focus:border-orange-500/50 text-slate-100" : "bg-slate-50 border-slate-200 focus:border-orange-500/50 text-slate-900"
                  }`}
                />
              </div>

              <div className={`p-1 rounded-lg border flex gap-1 ${darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-100 border-slate-200"}`}>
                {["All", "Settled", "Processing", "Disputed"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setStatusTab(tab)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                      statusTab === tab ? "bg-orange-500 text-white shadow" : darkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-inherit">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className={`border-b border-inherit uppercase font-bold tracking-wider text-[10px] ${darkMode ? "bg-slate-950 text-slate-400" : "bg-slate-50 text-slate-500"}`}>
                  <th className="py-3 px-4">Node Hash</th>
                  <th className="py-3 px-4">Restaurant Franchise</th>
                  <th className="py-3 px-4">Channel Route</th>
                  <th className="py-3 px-4">Gross Vol</th>
                  <th className="py-3 px-4">10% Platform Cut</th>
                  <th className="py-3 px-4">Cluster Health</th>
                  <th className="py-3 px-4 text-right">Activity Log</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? "divide-slate-800/60" : "divide-slate-200/60"}`}>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className={`transition-colors ${darkMode ? "hover:bg-slate-900/40" : "hover:bg-slate-50/80"}`}>
                      <td className={`py-3.5 px-4 font-mono font-bold ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                        {order.id}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-sm">
                        {order.restaurant}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${darkMode ? "bg-slate-950 text-slate-300" : "bg-slate-100 text-slate-700"}`}>
                          {order.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold">
                        ${order.grossAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-orange-500">
                        +${order.commission}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          order.status === "Settled" ? "bg-emerald-500/10 text-emerald-500" : order.status === "Processing" ? "bg-blue-500/10 text-blue-500" : "bg-rose-500/10 text-rose-500"
                        }`}>
                          {order.status === "Settled" && <CheckCircle2 size={11} />}
                          {order.status === "Processing" && <Clock size={11} />}
                          {order.status === "Disputed" && <XCircle size={11} />}
                          {order.status}
                        </span>
                      </td>
                      <td className={`py-3.5 px-4 text-right whitespace-nowrap font-medium ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                        {order.timestamp}
                      </td>
                    </tr>
                  ))
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

      </main>
    </div>
  );
}