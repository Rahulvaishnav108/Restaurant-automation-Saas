import React from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/kitchen', icon: 'dashboard', label: 'Overview', end: true },
  { to: '/kitchen/orders', icon: 'shopping_bag', label: 'Orders', badge: 24 },
  { to: '/kitchen/batch-cooking', icon: 'inventory_2', label: 'Batch Cooking' },
  { to: '/kitchen/inventory', icon: 'package_2', label: 'Inventory' },
  { to: '/kitchen/stations', icon: 'view_column', label: 'Kitchen Stations' },
  { to: '/kitchen/staff', icon: 'group', label: 'Staff' },
  { to: '/kitchen/analytics', icon: 'bar_chart', label: 'Analytics' },
  { to: '/kitchen/reports', icon: 'description', label: 'Reports' },
  { to: '/kitchen/settings', icon: 'settings', label: 'Settings' },
];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  onItemClick?: () => void;
}

export default function KitchenSidebar({ collapsed, onToggle, onItemClick }: Props) {
  return (
    <aside
      className={`flex flex-col h-screen fixed left-0 top-0 bg-white border-r border-slate-200 z-50 transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-64 shadow-xl lg:shadow-none'
      }`}
    >
      {/* Header */}
      <div className={`flex ${collapsed ? 'flex-col items-center gap-3 px-2' : 'items-center justify-between px-6'} py-5 border-b border-slate-100 shrink-0`}>
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 dark:bg-orange-600 p-2 rounded-lg shrink-0 text-white shadow-sm shadow-orange-500/20">
            <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-lg text-slate-800 leading-tight font-sans dark:text-white">Flavoroast</h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase font-sans">Kitchen Dashboard</p>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-all"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <span className="material-symbols-outlined text-[20px]">{collapsed ? 'menu_open' : 'menu'}</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon, label, badge, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onItemClick}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-sans text-sm font-semibold group ${
                isActive
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/10'
                  : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              } ${collapsed ? 'justify-center px-3' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {icon}
                  </span>
                  {!collapsed && <span>{label}</span>}
                </div>
                {!collapsed && badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400'
                  }`}>{badge}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Kitchen Status Widget */}
      {!collapsed && (
        <div className="mx-3 mb-3 space-y-3">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-2 font-sans">Kitchen Status</p>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-orange-500">🔥</span>
              <span className="font-bold text-orange-600 text-sm font-sans dark:text-orange-400">Medium Load</span>
            </div>
            <p className="text-[10px] text-slate-500 font-sans">All stations operational</p>
          </div>
        </div>
      )}

      {/* Chef Profile */}
      <div className="border-t border-slate-100 px-3 py-3">
        <div className={`bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3 ${collapsed ? 'p-2 justify-center' : 'p-3'}`}>
          <div className="w-10 h-10 rounded-full bg-orange-200 dark:bg-orange-950/50 flex items-center justify-center shrink-0 text-orange-700 dark:text-orange-400 font-bold text-sm">
            CA
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate font-sans text-slate-800 dark:text-slate-200">Chef Arjun</p>
              <p className="text-[10px] text-slate-400 font-sans">Executive Chef</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase font-sans">On Duty</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
