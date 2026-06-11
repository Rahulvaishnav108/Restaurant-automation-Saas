import { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  CreditCard, 
  BarChart3, 
  DollarSign, 
  Bell, 
  FileText,
  Sun, 
  Moon, 
  ChevronDown,
  LogOut
} from "lucide-react";
import { useAuth } from "../auth/AuthProvider";
import Navbar from "../features/superAdmin/components/dashboard/Navbar";
export default function SuperAdminLayout() {
  const { signOut } = useAuth();
  // Initialize state from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme ? savedTheme === "dark" : true; 
    }
    return true;
  });

  // Listen for theme changes dispatched from the dashboard or other pages
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

  // Update DOM and LocalStorage when layout toggles the theme
  const toggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    
    if (nextMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    // Broadcast change to the dashboard
    window.dispatchEvent(new CustomEvent("sync-app-theme", { detail: { darkMode: nextMode } }));
  };

  return (
    <div className={`flex min-h-screen font-sans antialiased transition-colors duration-300 ${
      darkMode ? "bg-[#020817]" : "bg-[#F8FAFC]"
    }`}>
      
      {/* SIDEBAR */}
      <aside className={`w-[260px] h-screen sticky top-0 border-r p-5 flex flex-col shrink-0 select-none transition-colors duration-300 ${
        darkMode ? "bg-[#090f1c] border-slate-900 text-slate-200" : "bg-white border-slate-200/80 text-slate-900"
      }`}>
        
        {/* LOGO AREA */}
        <div className={`h-16 flex flex-col justify-center mb-6 px-2 border-b pb-4 ${
          darkMode ? "border-slate-800/60" : "border-slate-200/80"
        }`}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-black text-white text-base shadow-md shadow-orange-500/10">
              ⬢
            </div>
            <div className="leading-tight">
              <h1 className={`font-bold text-base tracking-tight ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
                Super Admin
              </h1>
              <p className={`text-xs font-medium mt-0.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                Restaurant Platform
              </p>
            </div>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="space-y-1.5 flex-1 overflow-y-auto pr-1">
          <NavLink
            to="/superadmin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-orange-600 text-white font-semibold shadow-lg shadow-orange-600/10"
                  : darkMode 
                    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`
            }
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/superadmin/restaurants"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-orange-600 text-white font-semibold shadow-lg shadow-orange-600/10"
                  : darkMode 
                    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`
            }
          >
            <UtensilsCrossed size={18} />
            <span>Restaurants</span>
          </NavLink>

          <NavLink
            to="/superadmin/subscriptions"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-orange-600 text-white font-semibold shadow-lg shadow-orange-600/10"
                  : darkMode 
                    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`
            }
          >
            <CreditCard size={18} />
            <span>Subscriptions</span>
          </NavLink>

          <NavLink
            to="/superadmin/analytics"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-orange-600 text-white font-semibold shadow-lg shadow-orange-600/10"
                  : darkMode 
                    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`
            }
          >
            <BarChart3 size={18} />
            <span>Analytics</span>
          </NavLink>

          <NavLink
            to="/superadmin/transactions"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-orange-600 text-white font-semibold shadow-lg shadow-orange-600/10"
                  : darkMode 
                    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`
            }
          >
            <DollarSign size={18} />
            <span>Transactions</span>
          </NavLink>

          <NavLink
            to="/superadmin/alerts"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-orange-600 text-white font-semibold shadow-lg shadow-orange-600/10"
                  : darkMode 
                    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`
            }
          >
            <Bell size={18} />
            <span>Alerts</span>
          </NavLink>

          <NavLink
            to="/superadmin/audit-logs"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-orange-600 text-white font-semibold shadow-lg shadow-orange-600/10"
                  : darkMode 
                    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`
            }
          >
            <FileText size={18} />
            <span>Audit Logs</span>
          </NavLink>

          <button
            onClick={signOut}
            className={`flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 w-full text-left mt-4 ${
              darkMode 
                ? "text-red-400 hover:text-red-300 hover:bg-red-950/20" 
                : "text-red-600 hover:text-red-700 hover:bg-red-50"
            }`}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </nav>

        {/* FOOTER SYSTEM CONTROLS */}
        <div className={`pt-4 border-t flex items-center justify-between ${
          darkMode ? "border-slate-800/60" : "border-slate-100"
        }`}>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                darkMode ? "text-orange-400 hover:bg-slate-900" : "text-amber-500 hover:bg-slate-100"
              }`}
            >
              {darkMode ? <Moon size={15} /> : <Sun size={15} />}
            </button>

            <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all relative ${
              darkMode ? "text-slate-400 hover:text-slate-100 hover:bg-slate-900" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            }`}>
              <Bell size={15} />
              <span className="absolute top-2 right-2 w-1 h-1 rounded-full bg-orange-500" />
            </button>
          </div>

          <button className="flex items-center gap-1.5 p-0.5 rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&h=60&q=80"
              alt="profile"
              className="w-6 h-6 rounded-md object-cover"
            />
            <ChevronDown size={12} className={darkMode ? "text-slate-500" : "text-slate-400"} />
          </button>
        </div>
      </aside>

      {/* DASHBOARD ROUTE OUTLET VIEWPORT */}
      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        {/* Navbar sits on top of the layout container workspace seamlessly */}
        <Navbar darkMode={darkMode} onThemeToggle={toggleTheme} />
        
        {/* Page contents (Dashboard, Transactions, etc.) render here */}
        <div className="flex-1">
          <Outlet context={{ darkMode }} />
        </div>
      </main>
    </div>
  );
}