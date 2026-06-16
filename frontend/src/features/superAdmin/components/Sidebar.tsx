import { NavLink } from "react-router-dom";
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
  Settings,
  ChevronDown,
  X,
} from "lucide-react";

interface SidebarProps {
  darkMode: boolean;
  toggleTheme: () => void;
  /** Mobile drawer open state – controlled by the layout */
  mobileOpen?: boolean;
  /** Close the mobile drawer */
  onMobileClose?: () => void;
}

export default function Sidebar({
  darkMode,
  toggleTheme,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const navItems = [
    { path: "/superadmin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/superadmin/restaurants", label: "Restaurants", icon: UtensilsCrossed },
    { path: "/superadmin/subscriptions", label: "Subscriptions", icon: CreditCard },
    { path: "/superadmin/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/superadmin/transactions", label: "Transactions", icon: DollarSign },
    { path: "/superadmin/alerts", label: "Alerts", icon: Bell },
    { path: "/superadmin/audit-logs", label: "Audit Logs", icon: FileText },
    { path: "/superadmin/settings", label: "Settings", icon: Settings },
  ];

  const sidebarContent = (
    <aside
      className={`w-[260px] h-screen flex flex-col shrink-0 select-none transition-colors duration-300 p-5 ${
        darkMode
          ? "bg-[#090f1c] border-slate-900 text-slate-200"
          : "bg-white border-slate-200/80 text-slate-900"
      }`}
    >
      {/* LOGO AREA */}
      <div
        className={`h-16 flex flex-col justify-center mb-6 px-2 border-b pb-4 ${
          darkMode ? "border-slate-800/60" : "border-slate-200/80"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-black text-white text-base shadow-md shadow-orange-500/10">
            ⬢
          </div>
          <div className="leading-tight flex-1">
            <h1 className={`font-bold text-base tracking-tight ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
              Super Admin
            </h1>
            <p className={`text-xs font-medium mt-0.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
              Restaurant Platform
            </p>
          </div>
          <button
            onClick={onMobileClose}
            className={`lg:hidden ml-auto w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              darkMode
                ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            }`}
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="space-y-1.5 flex-1 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/superadmin"}
              onClick={onMobileClose}
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
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* FOOTER SYSTEM CONTROLS */}
      <div
        className={`pt-4 border-t flex items-center justify-between ${
          darkMode ? "border-slate-800/60" : "border-slate-100"
        }`}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              darkMode ? "text-orange-400 hover:bg-slate-900" : "text-amber-500 hover:bg-slate-100"
            }`}
          >
            {darkMode ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          <button
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all relative ${
              darkMode
                ? "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            }`}
          >
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
  );

  return (
    <>
      <div className="hidden lg:block fixed top-0 left-0 z-50 h-screen border-r transition-colors duration-300 border-r-slate-800/60">
        {sidebarContent}
      </div>
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onMobileClose}
        aria-hidden="true"
      />
      <div
        className={`lg:hidden fixed top-0 left-0 z-50 h-screen border-r transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${darkMode ? "border-slate-800" : "border-slate-200/80"}`}
      >
        {sidebarContent}
      </div>
    </>
  );
}