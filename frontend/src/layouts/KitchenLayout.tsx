import React, { useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import {
  LayoutDashboard, ChefHat, Layers, Flame, Sun, Moon, ChevronLeft, ChevronRight, Bell, UtensilsCrossed,
  Users, BarChart2, FileText, Settings, Menu
} from 'lucide-react';
import { typographyTheme, fontTheme } from '../shared/theme/typography';
import { useTheme } from '../app/providers/ThemeProvider';

const navItems = [
  { label: 'Overview',          icon: LayoutDashboard, key: 'dashboard' },
  { label: 'Tickets Queue',     icon: ChefHat,         key: 'orders' },
  { label: 'Cooking Batches',   icon: Layers,          key: 'batches' },
  { label: 'Kitchen Stations',  icon: Flame,           key: 'stations' },
  { label: 'Staff Profile',     icon: Users,           key: 'staff' },
  { label: 'Analytics',         icon: BarChart2,       key: 'analytics' },
  { label: 'Reports',           icon: FileText,        key: 'reports' },
  { label: 'Settings',          icon: Settings,        key: 'settings' },
];

export default function KitchenLayout(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeView = searchParams.get('view') || 'dashboard';
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });
  const { theme: globalTheme, toggleTheme } = useTheme();
  const isDark = globalTheme === 'dark';

  const handleMenuClick = (key: string) => {
    if (key === 'dashboard') {
      navigate('/kitchen');
    } else {
      navigate(`/kitchen?view=${key}`);
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#f97316', // Orange matching RestoHub primary color
          colorBgBase: isDark ? '#0f172a' : '#ffffff', // slate-900 / white
          colorBorder: isDark ? 'rgba(255, 255, 255, 0.08)' : '#e5e7eb',
          fontFamily: `${typographyTheme.style.fontFamily}, sans-serif`,
        },
      }}
    >
      <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${isDark ? 'dark' : ''} ${fontTheme.body} ${isDark ? 'bg-[#0f172a] text-stone-50' : 'bg-[#f8fafc] text-slate-800'}`}>
        
        {/* Sidebar */}
        <aside 
          className={`relative flex flex-col bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-white/5 transition-all duration-300 ${
            collapsed ? 'w-[72px]' : 'w-[240px]'
          } min-h-screen flex-shrink-0 z-30 pb-10`}
        >
          
          {/* Logo & Theme Switch Header */}
          <div className="p-4 border-b flex flex-col gap-3.5 border-gray-100 dark:border-white/5">
            <div className="flex items-center justify-between gap-1.5">
              {!collapsed ? (
                <div className="flex items-center gap-2.5">
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-md">
                    <UtensilsCrossed className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-extrabold text-lg text-orange-500 tracking-tight">RestoHub KDS</span>
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-md">
                  <UtensilsCrossed className="w-5 h-5 text-white" />
                </div>
              )}
              
              {/* Light & Dark Theme Toggle */}
              {!collapsed && (
                <button
                  onClick={toggleTheme}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-gray-500" />}
                </button>
              )}
            </div>
            
            {!collapsed && (
              <div>
                <div className={`text-sm font-semibold ${typographyTheme.colors.primary}`}>
                  Main Cookstation A
                </div>
                <div className={`text-[10px] mt-0.5 ${typographyTheme.colors.secondary}`}>
                  Live Sync Connected
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-[66px] z-40 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 shadow flex items-center justify-center text-gray-400 hover:text-orange-500 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map(({ label, icon: Icon, key }) => {
              const isActive = activeView === key;
              return (
                <button
                  key={key}
                  onClick={() => handleMenuClick(key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                       ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-500 dark:text-orange-400'
                       : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                  title={collapsed ? label : undefined}
                >
                  <Icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                    isActive ? 'text-orange-500 dark:text-orange-400' : 'text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                  }`} />
                  {!collapsed && <span className="truncate">{label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Chef Profile / Fallback branding */}
          {!collapsed && (
            <div className="p-4 border-t border-gray-100 dark:border-white/5 flex items-center gap-2.5">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=samrai-01`}
                alt="samrai-01"
                className="w-8 h-8 rounded-full bg-orange-100 object-cover flex-shrink-0"
              />
              <div className="text-left min-w-0">
                <p className={`text-xs font-semibold ${typographyTheme.colors.primary} leading-tight truncate`}>samrai-01</p>
                <p className={`text-[10px] ${typographyTheme.colors.secondary} truncate`}>Head Chef</p>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Header Bar */}
          <header className="h-14 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-6 gap-4 sticky top-0 z-20 transition-colors duration-200">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCollapsed(!collapsed)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 transition-colors"
                title="Toggle Menu"
              >
                <Menu className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <span className={`text-sm font-bold ${typographyTheme.colors.primary}`}>KDS Panel Control Center</span>
            </div>
            
            <div className="flex items-center gap-2.5">
              {/* Notification bell mock */}
              <button className="relative w-9 h-9 rounded-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                <Bell className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white dark:border-slate-900" />
              </button>
            </div>
          </header>

          {/* Actual content container */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
            <Outlet />
          </main>
        </div>
      </div>
    </ConfigProvider>
  );
}
