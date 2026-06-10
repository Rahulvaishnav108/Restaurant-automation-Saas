import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, UtensilsCrossed, LogOut } from 'lucide-react';
import { customerNavItems } from './customerNav';
import { useAuth } from '../../../../auth/AuthProvider';

export default function CustomerSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    signOut();
    navigate('/');
  }

  return (
    <aside
      className={`relative hidden md:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-300 flex-shrink-0 min-h-screen ${
        collapsed ? 'w-[72px]' : 'w-[220px]'
      }`}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer select-none"
        onClick={() => navigate('/customer')}
      >
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#FF9F00] flex items-center justify-center shadow-md">
          <UtensilsCrossed className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="font-extrabold text-lg text-[#FF9F00] tracking-tight truncate">
            ServeSphere
          </span>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[66px] z-10 w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow flex items-center justify-center text-gray-400 hover:text-[#FF9F00] transition-colors"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {customerNavItems.map(({ tab, label, icon: Icon, path }) => (
          <NavLink
            key={tab}
            to={path}
            end={path === '/customer'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-orange-50 dark:bg-orange-950/40 text-[#FF9F00]'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
              }`
            }
            title={collapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                    isActive
                      ? 'text-[#FF9F00]'
                      : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                  }`}
                />
                {!collapsed && <span className="truncate">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-2 py-3 border-t border-gray-100 dark:border-gray-800">
        {!collapsed && user && (
          <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-[#FF9F00]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[#FF9F00] font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.restaurantName}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-all"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
