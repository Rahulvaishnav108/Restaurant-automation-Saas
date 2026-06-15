// src/features/superAdmin/pages/SuperadminDashboard.tsx

import { useOutletContext } from "react-router-dom";
import StatsGrid from "../components/dashboard/Statsgrid";
import RevenueChart from "../components/dashboard/RevenueChart";
import RestaurantStatusPie from "../components/dashboard/Restaurantstatuspie";
import TopRestaurantsTable from "../components/dashboard/TopRestaurantsTable";
import { Activity, RefreshCw } from "lucide-react";

interface OutletContext {
  darkMode: boolean;
}

export default function SuperAdminDashboard() {
  // ✅ Reads darkMode directly from the layout via Outlet context —
  //    no need for local state or event listeners.
  const { darkMode } = useOutletContext<OutletContext>();

  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className={`min-h-full font-sans antialiased transition-colors duration-300 ${
        darkMode ? "text-slate-50" : "text-slate-900"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

        {/* ── PAGE HEADER ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                  darkMode
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    : "text-emerald-600 bg-emerald-50 border-emerald-200"
                }`}
              >
                <Activity size={9} className="animate-pulse" />
                Live
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Dashboard Overview
            </h2>
            <p
              className={`mt-1 text-xs sm:text-sm ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {dateString} · Last synced at {timeString}
            </p>
          </div>

          {/* Refresh hint */}
          <button
            onClick={() => window.location.reload()}
            className={`self-start sm:self-auto inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
              darkMode
                ? "border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 hover:bg-slate-800/40"
                : "border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>

        {/* ── STATS ROW ───────────────────────────────────────────────── */}
        <StatsGrid darkMode={darkMode} />

        {/* ── CHARTS ROW ──────────────────────────────────────────────── */}
        {/*
          On mobile:  single column stack.
          On lg+:     revenue chart takes 2/3, pie takes 1/3.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <RevenueChart darkMode={darkMode} />
          <RestaurantStatusPie darkMode={darkMode} />
        </div>

        {/* ── TOP RESTAURANTS TABLE ────────────────────────────────────── */}
        <TopRestaurantsTable darkMode={darkMode} />

        {/* ── FOOTER NOTE ─────────────────────────────────────────────── */}
        <p
          className={`text-center text-[10px] pb-2 ${
            darkMode ? "text-slate-700" : "text-slate-300"
          }`}
        >
          Super Admin HQ · All data reflects live platform telemetry
        </p>
      </div>
    </div>
  );
}