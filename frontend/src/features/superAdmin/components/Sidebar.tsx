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
  ChevronDown,
  LogOut
} from "lucide-react";

interface SidebarProps {
  darkMode: boolean;
  toggleTheme: () => void;
  signOut: () => void;
}

export default function Sidebar({ darkMode, toggleTheme, signOut }: SidebarProps) {
  const navItems = [
    { path: "/superadmin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/superadmin/restaurants", label: "Restaurants", icon: UtensilsCrossed },
    { path: "/superadmin/subscriptions", label: "Subscriptions", icon: CreditCard },
    { path: "/superadmin/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/superadmin/transactions", label: "Transactions", icon: DollarSign },
    { path: "/superadmin/alerts", label: "Alerts", icon: Bell },
    { path: "/superadmin/audit-logs", label: "Audit Logs", icon: FileText },
  ];

  return (
    <aside className={`w-[260px] h-screen fixed top-0 left-0 z-50 border-r p-5 flex flex-col shrink-0 select-none transition-colors duration-300 ${
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
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/superadmin"}
            className={({ isActive }) => {
              return `flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-orange-600 text-white font-semibold shadow-lg shadow-orange-600/10"
                  : darkMode 
                    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`;
            }}
          >
            {(item.icon === item.icon) && (() => {
              const Icon = item.icon;
              return <Icon size={18} />;
            })()}
            <span>{item.label}</span>
          </NavLink>
        ))}

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
  );
}