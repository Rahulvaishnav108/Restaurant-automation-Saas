// src/features/superAdmin/pages/Analytics.tsx
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

import {
  metricsData,
  barSeries,
  distributionSeries,
  mockPlatformOrders,
} from "../store/Analytics";
import { exportOrdersAsCSV } from "../utils/Analyticsutils";

import AnalyticsHeader     from "../components/Analytics/Analyticsheader";
import AnalyticsKPICards   from "../components/Analytics/Analyticskpicards";
import AnalyticsBarChart   from "../components/Analytics/Analyticsbarchart";
import AnalyticsPieChart   from "../components/Analytics/Analyticspiechart";
import AnalyticsOrdersTable from "../components/Analytics/Analyticsorderstable";

interface LayoutContextType {
  darkMode: boolean;
}

export default function Analytics() {
  const { darkMode } = useOutletContext<LayoutContextType>();

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusTab, setStatusTab]     = useState("All");

  // Refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ── Derived values ──────────────────────────────────────────────────────────
  const totalVolume = mockPlatformOrders.reduce(
    (acc, o) => acc + o.grossAmount,
    0,
  );
  const totalCommission = mockPlatformOrders.reduce(
    (acc, o) => acc + o.commission,
    0,
  );
  const averageOrderValue = Math.round(
    totalVolume / mockPlatformOrders.length,
  );

  const filteredOrders = mockPlatformOrders.filter((order) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      order.restaurant.toLowerCase().includes(q) ||
      order.id.toLowerCase().includes(q);
    const matchesTab =
      statusTab === "All" || order.status === statusTab;
    return matchesSearch && matchesTab;
  });

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSync = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  const handleExport  = () => exportOrdersAsCSV(filteredOrders);
  const handleOnboard = () =>
    alert("System Diagnostics: All Server Clusters Operational.");

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
        darkMode
          ? "bg-[#020817] text-slate-100"
          : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      <main className="w-full px-4 sm:px-6 xl:px-8 py-6 sm:py-8 max-w-[1600px] mx-auto space-y-6">

        {/* 1 ── Page header */}
        <AnalyticsHeader
          darkMode={darkMode}
          isRefreshing={isRefreshing}
          onSync={handleSync}
          onExport={handleExport}
          onOnboard={handleOnboard}
        />

        {/* 2 ── KPI summary cards */}
        <AnalyticsKPICards
          darkMode={darkMode}
          metrics={metricsData}
          totalVolume={totalVolume}
          totalCommission={totalCommission}
          averageOrderValue={averageOrderValue}
        />

        {/* 3 ── Charts row
              Mobile  : stacked (1 col)
              Tablet  : 2 cols (bar takes more space)
              Desktop : bar = 2/3 | pie = 1/3
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Bar chart spans 2 cols on md+ */}
          <div className="md:col-span-2">
            <AnalyticsBarChart darkMode={darkMode} data={barSeries} />
          </div>

          {/* Pie chart */}
          <div className="md:col-span-1">
            <AnalyticsPieChart
              darkMode={darkMode}
              data={distributionSeries}
            />
          </div>
        </div>

        {/* 4 ── Orders table */}
        <AnalyticsOrdersTable
          darkMode={darkMode}
          orders={filteredOrders}
          searchQuery={searchQuery}
          statusTab={statusTab}
          onSearchChange={setSearchQuery}
          onTabChange={setStatusTab}
        />

      </main>
    </div>
  );
}