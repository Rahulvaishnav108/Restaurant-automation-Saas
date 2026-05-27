import React from 'react';
import { Search, Bell, Sun, Moon, Menu, Plus, ChevronDown } from 'lucide-react';
import { useUIStore } from '../../../store/ui.store';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { theme, toggleTheme } = useUIStore();

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 lg:px-6 h-16 flex items-center gap-4">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="
              w-full pl-9 pr-4 py-2 text-sm
              bg-gray-100 dark:bg-gray-800
              border border-transparent dark:border-gray-700
              rounded-xl text-gray-800 dark:text-gray-200
              placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400
              transition-all
            "
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* New Order button */}
        <button className="hidden sm:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-sm shadow-orange-200 dark:shadow-none">
          <Plus className="w-4 h-4" />
          New Order
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Toggle theme"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200 dark:border-gray-700 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            D
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">Debesh Mahato</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
          <ChevronDown className="hidden sm:block w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
        </div>
      </div>
    </header>
  );
}