import React from 'react';
import { Search, X, ChevronDown, Filter } from 'lucide-react';
import { useInventoryStore, type ItemTab, type ItemCategory } from '../../store/inventory.store';

const TABS: ItemTab[] = ['All Items', 'Ingredients', 'Beverages', 'Packaging', 'Cleaning Supplies', 'Other'];
const CATEGORIES: Array<ItemCategory | 'All Categories'> = ['All Categories', 'Ingredients', 'Beverages', 'Packaging', 'Cleaning Supplies', 'Other'];

export function InventoryTabBar() {
  const {
    activeTab, setActiveTab,
    activeCategory, setActiveCategory,
    searchQuery, setSearchQuery,
  } = useInventoryStore();

  return (
    <div className="border-b border-gray-100 dark:border-gray-800">
      {/* Tabs row */}
      <div className="flex items-center justify-between gap-2 px-5 pt-3 flex-wrap">
        <div className="flex items-center gap-0 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                  isActive
                    ? 'border-orange-500 text-orange-500 dark:text-orange-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-200 dark:hover:border-gray-700'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 pb-2">
          {/* Category dropdown */}
          <div className="relative">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value as ItemCategory | 'All Categories')}
              className="appearance-none pl-3 pr-8 py-1.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          </div>

          {/* Filter */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-8 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 focus:border-orange-300 dark:focus:border-orange-700 w-40 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}