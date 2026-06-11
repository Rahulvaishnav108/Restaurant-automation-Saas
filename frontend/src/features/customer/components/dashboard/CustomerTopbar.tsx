import React, { useState } from 'react';
import { Bell, Sun, Moon, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../auth/AuthProvider';
import { useTheme } from '../../../../app/providers/ThemeProvider';

const NOTIFS = [
  { id: 1, text: 'Your order #ORD-2841 is being prepared 🍳', time: '2 min ago', read: false },
  { id: 2, text: 'Table T-04 session is active', time: '10 min ago', read: false },
  { id: 3, text: 'Waiter request accepted ✓', time: '15 min ago', read: true },
];

export default function CustomerTopbar() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  const unread = NOTIFS.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6 h-14 flex items-center justify-between gap-3">

      {/* Left: greeting */}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          Hey, {user?.name?.split(' ')[0] ?? 'Guest'} 👋
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
          {user?.restaurantName ?? 'ServeSphere'}
        </p>
      </div>

      {/* Right: theme + notifications + avatar */}
      <div className="flex items-center gap-2 flex-shrink-0">

        {/* Theme toggle */}
        <div className="relative">
          <button
            onClick={() => { setThemeOpen(!themeOpen); setNotifOpen(false); }}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-[#FF9F00] hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            aria-label="Change theme"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          {themeOpen && (
            <div className="absolute right-0 top-10 w-40 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl py-1.5 z-50">
              {[
                { label: 'Light', value: 'light', icon: Sun },
                { label: 'Dark', value: 'dark', icon: Moon },
                { label: 'System', value: 'system', icon: Monitor },
              ].map(({ label, value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => {
                    if (value === 'system') {
                      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                      setTheme(prefersDark ? 'dark' : 'light');
                    } else {
                      setTheme(value as 'light' | 'dark');
                    }
                    setThemeOpen(false);
                  }}
                  className={`flex items-center gap-2.5 w-full px-3.5 py-2 text-sm transition-colors ${
                    theme === value
                      ? 'text-[#FF9F00] font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setThemeOpen(false); }}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-[#FF9F00] hover:bg-gray-100 dark:hover:bg-gray-800 transition-all relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF9F00] ring-2 ring-white dark:ring-gray-900" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-10 w-80 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</span>
                {unread > 0 && (
                  <span className="text-xs bg-[#FF9F00]/10 text-[#FF9F00] font-semibold px-2 py-0.5 rounded-full">
                    {unread} new
                  </span>
                )}
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-700 max-h-72 overflow-y-auto">
                {NOTIFS.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 ${n.read ? '' : 'bg-[#FF9F00]/5 dark:bg-[#FF9F00]/10'}`}
                  >
                    <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed">{n.text}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700">
                <button className="text-xs text-[#FF9F00] font-semibold hover:underline">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <button
          onClick={() => navigate('/customer/profile')}
          className="w-8 h-8 rounded-full bg-[#FF9F00]/20 flex items-center justify-center hover:ring-2 hover:ring-[#FF9F00]/50 transition-all"
          aria-label="Profile"
        >
          <span className="text-[#FF9F00] font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase() ?? 'G'}
          </span>
        </button>
      </div>

      {/* Close dropdowns on outside click */}
      {(notifOpen || themeOpen) && (
        <button
          type="button"
          className="fixed inset-0 z-30 w-full h-full cursor-default bg-transparent border-none outline-none"
          onClick={() => { setNotifOpen(false); setThemeOpen(false); }}
          aria-label="Close menus"
        />
      )}
    </header>
  );
}
