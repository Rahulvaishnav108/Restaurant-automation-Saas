import React from 'react';
import { NavLink } from 'react-router-dom';
import { customerNavItems } from './customerNav';

export default function CustomerBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around px-2 py-1 safe-area-pb">
        {customerNavItems.map(({ tab, label, icon: Icon, path }) => (
          <NavLink
            key={tab}
            to={path}
            end={path === '/customer'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-0 flex-1 ${
                isActive ? 'text-[#FF9F00]' : 'text-gray-400 dark:text-gray-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                    isActive ? 'bg-[#FF9F00]/10' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
