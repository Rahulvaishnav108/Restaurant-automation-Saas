import React from 'react';
import { Bell, Search, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../app/providers/ThemeProvider';

export function AdminTopbar(): JSX.Element {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center px-6 gap-4 sticky top-0 z-20 transition-colors duration-200">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search orders, customers, tables..."
            className="w-full pl-9 pr-12 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 focus:border-orange-300 dark:focus:border-orange-600 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 text-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark'
            ? <Sun className="w-4 h-4 text-amber-400" />
            : <Moon className="w-4 h-4 text-gray-500" />
          }
        </button>

        {/* Notification bell */}
        <button className="relative w-9 h-9 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Bell className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white dark:border-gray-900" />
        </button>

        {/* User */}
        <button className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Debesh"
            alt="Debesh"
            className="w-8 h-8 rounded-full bg-orange-100 object-cover"
          />
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight">Debesh</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </button>
      </div>
    </header>
  );
}