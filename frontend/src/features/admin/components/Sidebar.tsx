import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, UtensilsCrossed, CalendarDays,
  Users, Package, UserCog, BarChart3, Megaphone, Settings,
  ChevronLeft, ChevronRight, Coffee, X
} from 'lucide-react';
import { useUIStore } from '../../../store/ui.store';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/admin' },
  { icon: ShoppingCart, label: 'Orders', to: '/admin/orders' },
  { icon: UtensilsCrossed, label: 'Menu Management', to: '/admin/menu' },
  { icon: CalendarDays, label: 'Reservations', to: '/admin/reservations' },
  { icon: Users, label: 'Customers', to: '/admin/customers' },
  { icon: Package, label: 'Inventory', to: '/admin/inventory' },
  { icon: UserCog, label: 'Staff Management', to: '/admin/staff' },
  { icon: BarChart3, label: 'Reports & Analytics', to: '/admin/reports' },
  { icon: Megaphone, label: 'Marketing', to: '/admin/marketing' },
  { icon: Settings, label: 'Settings', to: '/admin/settings' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 flex flex-col
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-[72px]' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-200 dark:border-gray-800">
          <div className="flex-shrink-0 w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <Coffee className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">
              RestoHub
            </span>
          )}
          <button
            onClick={onMobileClose}
            className="ml-auto lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, to }) => {
            const isActive = to === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                end={to === '/admin'}
                onClick={onMobileClose}
                className={`
                  flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl mb-0.5
                  transition-all duration-150 group relative
                  ${isActive
                    ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200'
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-r-full" />
                )}
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-orange-500' : ''}`} />
                {!collapsed && <span className="text-sm">{label}</span>}
                {collapsed && (
                  <div className="
                    absolute left-full ml-2 px-2.5 py-1.5 bg-gray-900 dark:bg-gray-700
                    text-white text-xs rounded-lg whitespace-nowrap
                    opacity-0 group-hover:opacity-100 pointer-events-none
                    transition-opacity duration-150 z-50
                  ">
                    {label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Upgrade Banner */}
        {!collapsed && (
          <div className="mx-3 mb-4 p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl text-white">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-2">
              <Coffee className="w-4 h-4" />
            </div>
            <p className="font-semibold text-sm">Upgrade to Pro</p>
            <p className="text-xs text-orange-100 mt-0.5 mb-3">Unlock advanced features and grow your restaurant business.</p>
            <button className="w-full bg-white text-orange-600 font-semibold text-xs py-2 rounded-lg hover:bg-orange-50 transition-colors">
              Upgrade Now
            </button>
          </div>
        )}

        {/* Collapse Toggle (desktop) */}
        <button
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center h-10 border-t border-gray-200 dark:border-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4" />
            : <ChevronLeft className="w-4 h-4" />
          }
        </button>
      </aside>
    </>
  );
}