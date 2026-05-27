import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed, CalendarDays,
  Users, Package, UserCog, BarChart3, Megaphone, Settings,
  ChevronLeft, ChevronRight, HelpCircle, ArrowRight, Crown,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard',         icon: LayoutDashboard, to: '/admin' },
  { label: 'Orders',            icon: ShoppingBag,     to: '/admin/orders' },
  { label: 'Menu Management',   icon: UtensilsCrossed, to: '/admin/menu' },
  { label: 'Reservations',      icon: CalendarDays,    to: '/admin/reservations' },
  { label: 'Customers',         icon: Users,           to: '/admin/customers' },
  { label: 'Inventory',         icon: Package,         to: '/admin/inventory' },
  { label: 'Staff Management',  icon: UserCog,         to: '/admin/staff' },
  { label: 'Reports & Analytics', icon: BarChart3,     to: '/admin/reports' },
  { label: 'Marketing',         icon: Megaphone,       to: '/admin/marketing' },
  { label: 'Settings',          icon: Settings,        to: '/admin/settings' },
];

export function AdminSidebar(): JSX.Element {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside className={`relative flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[220px]'} min-h-screen flex-shrink-0`}>

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-md">
          <UtensilsCrossed className="w-5 h-5 text-white" />
        </div>
        {!collapsed && <span className="font-extrabold text-lg text-orange-500 tracking-tight">RestoHub</span>}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[66px] z-10 w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow flex items-center justify-center text-gray-400 hover:text-orange-500 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, icon: Icon, to }) => {
          const isActive = to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-500 dark:text-orange-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
              title={collapsed ? label : undefined}
            >
              <Icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${isActive ? 'text-orange-500 dark:text-orange-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Upgrade card */}
      {!collapsed && (
        <div className="mx-3 mb-4 p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/30 border border-orange-100 dark:border-orange-900/40">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center mb-2 shadow">
            <Crown className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
          </div>
          <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-0.5">Upgrade to Pro</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-snug">Unlock advanced features and grow your restaurant business.</p>
          <button className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors">
            Upgrade Now <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </aside>
  );
}