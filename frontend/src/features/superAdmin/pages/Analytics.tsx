import React, { useState, useEffect, useRef } from "react";

import {
  Sun, Moon, LayoutDashboard, Search, Bell, ChevronDown,
  TrendingUp, BarChart3, PieChart as PieIcon, Layers, LogOut
} from "lucide-react";

import {
  ResponsiveContainer, BarChart, Bar, CartesianGrid,
  XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell
} from "recharts";

// Mocking imports to maintain a fully compiled component
const metricsData = [
  { label: "Active Subscriptions", current: "1,240", shift: "+12.3%", darkBg: "bg-orange-500/10 text-orange-500", lightBg: "bg-orange-50 text-orange-600", icon: Layers },
  { label: "Platform Compute", current: "94.2%", shift: "+0.8%", darkBg: "bg-blue-500/10 text-blue-500", lightBg: "bg-blue-50 text-blue-600", icon: LayoutDashboard },
];

const barSeries = [
  { period: "Q1", load: 400, capacity: 240 },
  { period: "Q2", load: 300, capacity: 139 },
  { period: "Q3", load: 200, capacity: 980 },
  { period: "Q4", load: 278, capacity: 390 },
];

const distributionSeries = [
  { division: "Enterprise", allocation: 60, Hex: "#f97316" },
  { division: "SME Node", allocation: 40, Hex: "#3b82f6" },
];

export default function PlatformInfrastructureMatrix() {

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const cached = localStorage.getItem("theme");
    return cached ? cached === "dark" : true;
  });

  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const synchronizeTheme = (event: Event) => {
      const payload = (event as CustomEvent).detail;
      if (payload?.darkMode !== undefined) setDarkMode(payload.darkMode);
    };
    window.addEventListener("sync-app-theme", synchronizeTheme);
    return () => window.removeEventListener("sync-app-theme", synchronizeTheme);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const toggleApplicationTheme = () => {
    const state = !darkMode;
    setDarkMode(state);

    const rootElement = document.documentElement;
    if (state) {
      rootElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      rootElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    window.dispatchEvent(new CustomEvent("sync-app-theme", { detail: { darkMode: state } }));
  };

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
      darkMode ? "bg-[#020817] text-slate-100" : "bg-[#F8FAFC] text-slate-900"
    }`}>

      {/* NAVIGATION MANIFEST */}
      <header className={`sticky top-0 z-50 h-16 w-full border-b backdrop-blur-md transition-all duration-300 ${
        darkMode ? "bg-slate-950/80 border-slate-800 shadow-md shadow-black/10" : "bg-white/80 border-slate-200/80 shadow-sm shadow-slate-100/40"
      }`}>
        <div className="w-full h-full px-4 sm:px-8 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-black text-white text-base shadow-md">
              M
            </div>
            <div className="leading-tight">
              <h1 className="font-bold text-sm tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500">
                Analytics
              </h1>
              <p className={`text-[10px] font-semibold tracking-wider uppercase ${
                darkMode ? "text-slate-500" : "text-slate-400"
              }`}>
                Infrastructure Core
              </p>
            </div>
          </div>

          {/* SEARCH BOX REMOVED */}

          <div className="flex items-center gap-4">

            <div className="flex items-center gap-1">
              <button
                onClick={toggleApplicationTheme}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                  darkMode ? "text-slate-400 hover:text-slate-100 hover:bg-slate-900" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              <button className={`w-9 h-9 rounded-lg flex items-center justify-center relative ${
                darkMode ? "text-slate-400 hover:text-slate-100" : "text-slate-500 hover:text-slate-800"
              }`}>
                <Bell size={16} />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-orange-500" />
              </button>
            </div>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />

            {/* PROFILE BOX REMOVED */}
          </div>

        </div>
      </header>

      {/* VIEWPORT CONTROLLER CONTENT */}
      <main className="w-full px-4 sm:px-8 py-8 max-w-[1600px] mx-auto space-y-6">

        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Core Matrix</h2>
          <p className={`text-xs mt-0.5 ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}>
            Telemetry routing, resource allocation matrices, and cluster state logs.
          </p>
        </div>

        {/* COMPACT METRIC CARDS */}
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
                    <p className={`text-[10px] font-bold tracking-wider uppercase ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}>
                      {item.label}
                    </p>
                    <h3 className="text-2xl font-bold tracking-tight">{item.current}</h3>
                    <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold pt-1">
                      <TrendingUp size={12} />
                      <span>{item.shift}</span>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    darkMode ? item.darkBg : item.lightBg
                  }`}>
                    <IconComponent size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* VISUALIZATION CONTAINER ALIGNMENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className={`lg:col-span-2 rounded-xl p-5 border ${
            darkMode ? "bg-slate-900/30 border-slate-800/80" : "bg-white border-slate-200/60 shadow-sm shadow-slate-100/40"
          }`}>
            <div className="mb-4">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <BarChart3 size={16} /> Cluster Operations Load
              </h3>
              <p className={`text-xs ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}>
                Throughput balance configurations
              </p>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barSeries} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1e293b" : "#e2e8f0"} vertical={false} />
                  <XAxis dataKey="period" tickLine={false} axisLine={false} style={{ fontSize: "11px" }} stroke={darkMode ? "#64748b" : "#94a3b8"} />
                  <YAxis tickLine={false} axisLine={false} style={{ fontSize: "11px" }} stroke={darkMode ? "#64748b" : "#94a3b8"} />
                  <Tooltip />
                  <Legend />
                  <Bar name="Active Clusters" dataKey="load" fill="#f97316" radius={[4, 4, 0, 0]} />
                  <Bar name="Staging Subnets" dataKey="capacity" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`rounded-xl p-5 border ${
            darkMode ? "bg-slate-900/30 border-slate-800/80" : "bg-white border-slate-200/60 shadow-sm shadow-slate-100/40"
          }`}>
            <div className="mb-2">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <PieIcon size={16} /> Deployment Architecture
              </h3>
              <p className={`text-xs ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}>
                Core allocation mapping
              </p>
            </div>

            <div className="h-[220px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={distributionSeries} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="allocation" nameKey="division">
                    {distributionSeries.map((entry, index) => (
                      <Cell key={index} fill={entry.Hex} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold tracking-tight">100%</span>
                <span className={`text-[9px] font-bold uppercase tracking-wider ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}>
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

      </main>
    </div>
  );
}