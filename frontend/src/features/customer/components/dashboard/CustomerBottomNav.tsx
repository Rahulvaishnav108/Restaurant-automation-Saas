import React from 'react';
import { NavLink } from 'react-router-dom';

const NAV = [
  { to: '/customer/home', icon: 'home', label: 'Home' },
  { to: '/customer/menu', icon: 'restaurant_menu', label: 'Menu' },
  { to: '/customer/orders', icon: 'receipt_long', label: 'Orders' },
  { to: '/customer/profile', icon: 'person', label: 'Profile' },
];

export default function CustomerBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-16 px-2 pb-[env(safe-area-inset-bottom)] bg-sd-surface border-t border-sd-surface-variant shadow-lg z-40">
      {NAV.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 ${
              isActive
                ? 'text-sd-primary'
                : 'text-sd-on-surface-variant'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`material-symbols-outlined text-[22px] ${isActive ? 'bg-sd-primary-container/10 rounded-full px-4 py-1' : ''}`}
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {icon}
              </span>
              <span className="text-[10px] font-semibold font-sans">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
