import React from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/customer/home', icon: 'home', label: 'Home' },
  { to: '/customer/menu', icon: 'restaurant_menu', label: 'Menu' },
  { to: '/customer/orders', icon: 'receipt_long', label: 'Orders' },
  { to: '/customer/reservations', icon: 'event_seat', label: 'Reservations' },
  { to: '/customer/feedback', icon: 'rate_review', label: 'Feedback' },
];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export default function CustomerSidebar({ collapsed, onToggle }: Props) {
  return (
    <aside
      className={`hidden md:flex flex-col h-screen fixed left-0 top-0 bg-sd-surface border-r border-sd-surface-variant z-50 transition-all duration-300 group ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className={`flex ${collapsed ? 'flex-col items-center gap-4 px-2' : 'items-center justify-between px-4'} py-5 border-b border-sd-surface-variant/50 shrink-0`}>
        <div className="flex items-center gap-3">
          <div className="bg-sd-primary-container w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              restaurant
            </span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold text-sd-primary font-sans whitespace-nowrap">Smart Dining</h1>
              <p className="text-xs text-sd-on-surface-variant font-sans">Table T07</p>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 text-sd-on-surface-variant hover:bg-sd-surface-container rounded-lg transition-all duration-200"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="material-symbols-outlined text-[22px]">
            {collapsed ? 'left_panel_open' : 'left_panel_close'}
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 overflow-y-auto sd-custom-scrollbar">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 font-sans text-sm font-semibold group ${
                isActive
                  ? 'bg-sd-primary-container text-white shadow-md'
                  : 'text-sd-on-surface-variant hover:bg-sd-surface-container'
              } ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {icon}
                </span>
                {!collapsed && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Promo Card */}
      {!collapsed && (
        <div className="mx-3 mb-3">
          <div className="bg-sd-primary-container/10 rounded-xl p-4 border border-sd-primary/20 relative overflow-hidden">
            <p className="text-sd-primary font-bold text-sm font-sans mb-1">Get 20% OFF</p>
            <p className="text-sd-on-surface-variant text-xs font-sans mb-3">on your first order</p>
            <NavLink
              to="/customer/menu"
              className="inline-block bg-sd-primary-container text-white px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity font-sans"
            >
              Order Now
            </NavLink>
            <span className="material-symbols-outlined absolute -bottom-2 -right-2 text-sd-primary/10 text-6xl rotate-12">
              celebration
            </span>
          </div>
        </div>
      )}

      {/* Profile */}
      <div className="border-t border-sd-surface-variant/50 px-2 py-2">
        <NavLink
          to="/customer/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-3 rounded-xl transition-colors font-sans text-sm font-semibold ${
              isActive
                ? 'bg-sd-primary-container text-white'
                : 'text-sd-on-surface-variant hover:bg-sd-surface-container'
            } ${collapsed ? 'justify-center' : ''}`
          }
          title={collapsed ? 'Profile' : undefined}
        >
          <span className="material-symbols-outlined">person</span>
          {!collapsed && <span>Profile</span>}
        </NavLink>
      </div>
    </aside>
  );
}
