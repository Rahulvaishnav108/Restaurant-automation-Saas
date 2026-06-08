import { useState, useEffect, useRef } from "react";
import {
  revenueData,
  pieData,
  restaurants,
  stats,
} from "../store/Superadmindashboard";
import { 
  Bell, 
  Moon, 
  Sun, 
  Search, 
  TrendingUp,
  ChevronDown,
  LogOut
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function SuperAdminDashboard() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true;
  });
  
  // State to control profile dropdown visibility
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Listen for changes made by the Layout sidebar toggle
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

  // Close the profile dropdown if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // When manually toggled via dashboard navbar, update document & inform layout
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

    // Fire event to notify Layout sidebar
    window.dispatchEvent(new CustomEvent("sync-app-theme", { detail: { darkMode: nextMode } }));
  };

  const handleLogout = () => {
    // Add your application's logout logic here (e.g., clearing tokens, redirecting)
    console.log("Logging out...");
  };

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${darkMode ? "bg-[#020817] text-slate-50" : "bg-[#F8FAFC] text-slate-900"}`}>
      
      {/* GLOBAL TOP NAVBAR */}
      <header className={`sticky top-0 z-50 h-16 w-full border-b backdrop-blur-md transition-all duration-300 ${darkMode ? "bg-slate-950/80 border-slate-800 shadow-md shadow-black/10" : "bg-white/80 border-slate-200/80 shadow-sm shadow-slate-100/40"}`}>
        <div className="w-full h-full px-4 sm:px-8 flex items-center justify-between">
          
          {/* LEFT: Branding/Logo */}
          <div className="flex items-center gap-3 min-w-[200px]">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-black text-white text-base shadow-md shadow-orange-500/10">
              ⬢
            </div>
            <div className="leading-tight">
              <h1 className="font-bold text-sm tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                Super Admin
              </h1>
              <p className={`text-[10px] font-semibold tracking-wider uppercase ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                HQ Terminal
              </p>
            </div>
          </div>

          {/* CENTER: Enterprise Search */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative group">
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${darkMode ? "text-slate-500 group-focus-within:text-orange-500" : "text-slate-400 group-focus-within:text-orange-500"}`} />
              <input
                type="text"
                placeholder="Search orders, metrics, partners..."
                className={`w-full h-10 pl-10 pr-4 rounded-xl text-xs font-medium outline-none border transition-all duration-200 ${
                  darkMode
                    ? "bg-slate-900/60 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-slate-700 focus:bg-slate-900"
                    : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-slate-300 focus:bg-white"
                }`}
              />
            </div>
          </div>

          {/* RIGHT: Switch Theme Controller */}
          <div className="flex items-center gap-4 min-w-[200px] justify-end">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleThemeToggle}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                  darkMode ? "text-slate-400 hover:text-slate-100 hover:bg-slate-900" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              <button className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all relative ${
                darkMode ? "text-slate-400 hover:text-slate-100 hover:bg-slate-900" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}>
                <Bell size={16} />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-orange-500" />
              </button>
            </div>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />

            {/* Profile Dropdown Container */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center gap-2.5 p-1 rounded-xl transition-all ${darkMode ? "hover:bg-slate-900/60" : "hover:bg-slate-100"}`}
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="profile"
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-800"
                />
                <div className="hidden lg:block text-left leading-none">
                  <h4 className="font-semibold text-xs tracking-tight">Mr. Souvik</h4>
                  <p className={`text-[10px] mt-0.5 font-medium ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Global Admin</p>
                </div>
                <ChevronDown size={14} className={`transition-transform duration-200 ${profileDropdownOpen ? "rotate-180" : ""} ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
              </button>

              {/* Logout Button Dropdown Menu */}
              {profileDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-xl border p-1 shadow-lg transition-all duration-200 ${
                  darkMode 
                    ? "bg-slate-950 border-slate-800 text-slate-200 shadow-black/40" 
                    : "bg-white border-slate-200 text-slate-800 shadow-slate-200/40"
                }`}>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* DASHBOARD CONTENT BODY */}
      <main className="w-full px-4 sm:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Real-time analytics and system visibility controls.
          </p>
        </div>

        {/* STATS MATRIX */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className={`rounded-xl p-5 border transition-all duration-200 hover:shadow-md ${
                  darkMode ? "bg-slate-900/30 border-slate-800/80 shadow-black/10" : "bg-white border-slate-200/60 shadow-sm shadow-slate-100/40"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className={`text-[11px] font-semibold tracking-wider uppercase ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      {stat.title}
                    </p>
                    <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
                    <div className="flex items-center gap-1 text-emerald-500 text-xs font-semibold pt-1">
                      <TrendingUp size={12} />
                      <span>{stat.growth}</span>
                    </div>
                  </div>
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${darkMode ? stat.darkColor : stat.lightColor}`}>
                    <Icon size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* DATA VISUALIZATION BLOCK */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* TRENDS CHART */}
          <div className={`lg:col-span-2 rounded-xl p-5 border ${darkMode ? "bg-slate-900/30 border-slate-800/80" : "bg-white border-slate-200/60 shadow-sm shadow-slate-100/40"}`}>
            <div className="mb-4">
              <h3 className="text-base font-bold tracking-tight">Revenue & Orders Trend</h3>
              <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Performance trajectory parameters</p>
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1e293b" : "#e2e8f0"} vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} style={{ fontSize: '11px', fontWeight: 500 }} stroke={darkMode ? "#64748b" : "#94a3b8"} />
                  <YAxis tickLine={false} axisLine={false} style={{ fontSize: '11px', fontWeight: 500 }} stroke={darkMode ? "#64748b" : "#94a3b8"} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#0f172a' : '#ffffff', 
                      borderColor: darkMode ? '#334155' : '#e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: darkMode ? '#f8fafc' : '#0f172a'
                    }} 
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                  <Line type="monotone" name="Revenue ($)" dataKey="revenue" stroke="#f97316" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 1.5 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" name="Orders" dataKey="orders" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 1.5 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CLASSIFICATION SUMMARY */}
          <div className={`rounded-xl p-5 border ${darkMode ? "bg-slate-900/30 border-slate-800/80" : "bg-white border-slate-200/60 shadow-sm shadow-slate-100/40"}`}>
            <div className="mb-1">
              <h3 className="text-base font-bold tracking-tight">Restaurant Status</h3>
              <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Division allocations</p>
            </div>
            <div className="h-[240px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={65} outerRadius={90} paddingAngle={4} dataKey="value" nameKey="name">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} className="outline-none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                      borderColor: darkMode ? '#334155' : '#e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold tracking-tight">216</span>
                <span className={`text-[9px] font-bold uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Venues</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium mt-2">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 py-0.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className={`${darkMode ? "text-slate-400" : "text-slate-600"}`}>{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* METRIC DATA LOG SHEET */}
        <div className={`rounded-xl border overflow-hidden ${darkMode ? "bg-slate-900/30 border-slate-800/80" : "bg-white border-slate-200/60 shadow-sm shadow-slate-100/40"}`}>
          <div className="p-5 border-b border-inherit">
            <h3 className="text-base font-bold tracking-tight">Top Performing Restaurants</h3>
            <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Configured via platform transaction audits</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className={`border-b border-inherit uppercase font-semibold tracking-wider ${darkMode ? "bg-slate-950 text-slate-400" : "bg-slate-50 text-slate-500"}`}>
                  <th className="py-3 px-5">Restaurant</th>
                  <th className="py-3 px-5">Orders</th>
                  <th className="py-3 px-5">Gross Revenue</th>
                  <th className="py-3 px-5 text-right">Growth Rate</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? "divide-slate-800/40" : "divide-slate-200/60"}`}>
                {restaurants.map((restaurant) => (
                  <tr key={restaurant.name} className={`transition-colors ${darkMode ? "hover:bg-slate-800/10" : "hover:bg-slate-50"}`}>
                    <td className="py-3.5 px-5 font-semibold text-sm">{restaurant.name}</td>
                    <td className={`py-3.5 px-5 font-medium ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{restaurant.orders.toLocaleString()}</td>
                    <td className={`py-3.5 px-5 font-medium ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{restaurant.revenue}</td>
                    <td className="py-3.5 px-5 text-emerald-500 font-semibold text-right">{restaurant.growth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}