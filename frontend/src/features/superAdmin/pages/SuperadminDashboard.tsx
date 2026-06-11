// src/features/superAdmin/pages/SuperadminDashboard.tsx

import React, { useState, useEffect } from "react";
// Removed duplicate Navbar import line to clean up unused components
import StatsGrid from "../components/dashboard/Statsgrid";
import RevenueChart from '../components/dashboard/RevenueChart';
import RestaurantStatusPie from '../components/dashboard/Restaurantstatuspie';
import TopRestaurantsTable from "../components/dashboard/TopRestaurantsTable";

export default function SuperAdminDashboard() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  // Sync theme with Layout sidebar toggle
  useEffect(() => {
    const handleThemeSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail !== undefined) {
        setDarkMode(customEvent.detail.darkMode);
      }
    };
    window.addEventListener("sync-app-theme", handleThemeSync);
    return () => window.removeEventListener("sync-app-theme", handleThemeSync);
  }, []);

  // Fixed: Commented out handleThemeToggle because theme state updates flow into this view 
  // reactively via the window "sync-app-theme" event listener.
  /*
  const handleThemeToggle = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);

    if (nextMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    window.dispatchEvent(
      new CustomEvent("sync-app-theme", { detail: { darkMode: nextMode } })
    );
  };
  */

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
        darkMode ? "bg-[#020817] text-slate-50" : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      {/* Removed the duplicate <Navbar /> component instance line from here */}

      <main className="w-full px-4 sm:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Dashboard Overview
          </h2>
          <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Real-time analytics and system visibility controls.
          </p>
        </div>

        {/* Stats Row */}
        <StatsGrid darkMode={darkMode} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <RevenueChart darkMode={darkMode} />
          <RestaurantStatusPie darkMode={darkMode} />
        </div>

        {/* Table */}
        <TopRestaurantsTable darkMode={darkMode} />
      </main>
    </div>
  );
}