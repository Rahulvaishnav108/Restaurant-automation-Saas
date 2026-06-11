import { useEffect, useRef, useState } from "react";
import { 
  Bell, Moon, Sun, Search, ChevronDown, LogOut, Settings, 
  Volume2, VolumeX
} from "lucide-react";

interface NavbarProps {
  darkMode: boolean;
  onThemeToggle: () => void;
}

export default function Navbar({ darkMode, onThemeToggle }: NavbarProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const [systemMute, setSystemMute] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
        setNotificationsOpen(false);
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleThemeClick = () => {
    const nextMode = !darkMode;
    onThemeToggle();
    window.dispatchEvent(
      new CustomEvent("sync-app-theme", { detail: { darkMode: nextMode } })
    );
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const notifications = [
    { id: 1, title: "New Restaurant Onboarding", description: "Burger Hub requested verification updates.", time: "3 mins ago", type: "info", unread: true },
    { id: 2, title: "Gateway Timeout Alert", description: "Payment API experienced a 1.2s latent spike.", time: "14 mins ago", type: "warning", unread: true },
    { id: 3, title: "Payout Disbursed Successfully", description: "Batch #4029 wired to 14 standard merchants.", time: "2 hours ago", type: "success", unread: false },
  ];

  return (
    <header className={`sticky top-0 z-50 h-16 w-full border-b backdrop-blur-md transition-all duration-300 ${darkMode ? "bg-slate-950/80 border-slate-800 shadow-md shadow-black/10" : "bg-white/80 border-slate-200/80 shadow-sm shadow-slate-100/40"}`}>
      <div className="w-full h-full px-4 sm:px-8 flex items-center justify-between" ref={dropdownRef}>
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-black text-white text-base">⬢</div>
          <div className="leading-tight">
            <h1 className="font-bold text-sm tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Super Admin</h1>
            <p className={`text-[10px] font-semibold tracking-wider uppercase ${darkMode ? "text-slate-500" : "text-slate-400"}`}>HQ Terminal</p>
          </div>
        </div>

        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative group">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? "text-slate-500 group-focus-within:text-orange-500" : "text-slate-400 group-focus-within:text-orange-500"}`} />
            <input type="text" placeholder="Search orders, metrics, partners..." className={`w-full h-10 pl-10 pr-4 rounded-xl text-xs font-medium outline-none border transition-all duration-200 ${darkMode ? "bg-slate-900/60 border-slate-800 text-slate-100 focus:border-slate-700 focus:bg-slate-900" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300 focus:bg-white"}`} />
          </div>
        </div>

        <div className="flex items-center gap-4 min-w-[200px] justify-end">
          <div className="flex items-center gap-1.5 relative">
            <button onClick={handleThemeClick} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${darkMode ? "text-slate-400 hover:text-slate-100 hover:bg-slate-900" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"}`}>
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Notification Dropdown Container */}
            <div className="relative">
              <button onClick={() => { setNotificationsOpen(!notificationsOpen); setSettingsOpen(false); setProfileDropdownOpen(false); }} className={`w-9 h-9 rounded-lg flex items-center justify-center relative ${darkMode ? "text-slate-400 hover:text-slate-100" : "text-slate-500 hover:text-slate-800"}`}>
                <Bell size={16} />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              </button>
              {notificationsOpen && (
                <div className={`absolute right-0 mt-2 w-80 rounded-2xl border shadow-xl overflow-hidden z-50 ${darkMode ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-800"}`}>
                  <div className="px-4 py-3 border-b dark:border-slate-900 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Activity Center</h3>
                      <p className="text-[10px] text-orange-500 font-semibold mt-0.5">2 Action items unresolved</p>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y dark:divide-slate-900">
                    {notifications.map((item) => (
                      <div key={item.id} className={`p-3.5 flex gap-3 cursor-pointer group relative ${item.unread ? (darkMode ? "bg-slate-900/30" : "bg-orange-50/20") : ""}`}>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-xs truncate">{item.title}</p>
                          <p className="text-[11px] mt-0.5 text-slate-400">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Settings Control Center */}
            <div className="relative">
              <button onClick={() => { setSettingsOpen(!settingsOpen); setNotificationsOpen(false); setProfileDropdownOpen(false); }} className={`w-9 h-9 rounded-lg flex items-center justify-center ${darkMode ? "text-slate-400 hover:bg-slate-900" : "text-slate-500 hover:bg-slate-100"}`}>
                <Settings size={16} />
              </button>
              {settingsOpen && (
                <div className={`absolute right-0 mt-2 w-56 rounded-2xl border p-1 shadow-xl z-50 ${darkMode ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-800"}`}>
                  <div className="px-3 py-2 font-bold text-[11px] uppercase tracking-wider border-b dark:border-slate-900 text-slate-400">Control Center</div>
                  <div className="p-1.5 space-y-1">
                    <div className="flex items-center justify-between px-2 py-1.5 text-xs">
                      <span className="flex items-center gap-2 text-slate-400 font-medium">
                        {systemMute ? <VolumeX size={13} className="text-red-400" /> : <Volume2 size={13} />} Alert Sounds
                      </span>
                      <button onClick={() => setSystemMute(!systemMute)} className={`w-8 h-4.5 rounded-full relative p-0.5 ${systemMute ? 'bg-red-500' : 'bg-orange-500'}`}>
                        <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${systemMute ? 'translate-x-3.5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />

          {/* User Profile */}
          <div className="relative">
            <button onClick={() => { setProfileDropdownOpen(!profileDropdownOpen); setNotificationsOpen(false); setSettingsOpen(false); }} className="flex items-center gap-2.5 p-1 rounded-xl">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80" alt="profile" className="w-7 h-7 rounded-lg object-cover" />
              <div className="hidden lg:block text-left leading-none">
                <h4 className="font-semibold text-xs">Mr. Souvik</h4>
                <p className="text-[10px] text-slate-400">Global Admin</p>
              </div>
              <ChevronDown size={14} className={`${profileDropdownOpen ? "rotate-180" : ""} transition-transform text-slate-400`} />
            </button>
            {profileDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-48 rounded-xl border p-1 shadow-lg z-50 ${darkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
                <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10">
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}