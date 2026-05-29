import React from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useMenuStore, type FilterTab, type SortOption } from '../../store/menu.store';

const FILTER_TABS: FilterTab[] = ['All Items', 'Available', 'Unavailable', 'Low Stock'];
const SORT_OPTIONS: SortOption[] = ['Name A-Z', 'Name Z-A', 'Price Low-High', 'Price High-Low', 'Stock Low-High'];

export function MenuFilterBar(): JSX.Element {
  const { activeFilter, setActiveFilter, searchQuery, setSearchQuery, sortOption, setSortOption } = useMenuStore();
  return (
    <div className="flex items-center justify-between gap-4 mb-5">
      <div className="flex items-center gap-0.5 border-b border-gray-100 dark:border-gray-800">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap border-b-2 -mb-px ${
              activeFilter === tab
                ? 'border-orange-500 text-orange-500 dark:text-orange-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            placeholder="Search menu items..."
            className="pl-8 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/40 focus:border-orange-300 dark:focus:border-orange-700 w-44 placeholder:text-gray-400 text-gray-700 dark:text-gray-200 transition-all"
          />
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filter
        </button>
        <div className="relative">
          <select
            value={sortOption}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortOption(e.target.value as SortOption)}
            className="appearance-none pl-3 pr-7 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 outline-none transition-colors cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>Sort: {opt}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}