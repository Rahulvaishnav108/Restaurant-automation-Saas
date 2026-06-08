import React, { useRef, useState } from 'react';
import { Search, X, ChevronDown, Filter } from 'lucide-react';
import { useInventoryStore, type ItemTab, type ItemCategory } from '../../store/inventory.store';

const TABS: ItemTab[] = ['All Items', 'Ingredients', 'Beverages', 'Packaging', 'Cleaning Supplies', 'Other'];
const CATEGORIES: Array<ItemCategory | 'All Categories'> = ['All Categories', 'Ingredients', 'Beverages', 'Packaging', 'Cleaning Supplies', 'Other'];

export function InventoryTabBar() {
  const {
    activeTab, setActiveTab,
    activeCategory, setActiveCategory,
    searchQuery, setSearchQuery,
    items,
  } = useInventoryStore();

  const [catOpen, setCatOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const tabCount = (tab: ItemTab) => {
    if (tab === 'All Items') return items.length;
    return items.filter((i) => i.category === tab).length;
  };

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
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  isActive ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                }`}>
                  {tabCount(tab)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search + filter row */}
      <div className="flex items-center gap-2 px-5 py-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Category filter dropdown */}
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setCatOpen((v) => !v)}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors whitespace-nowrap"
          >
            <Filter className="w-4 h-4 text-gray-400" />
            {activeCategory}
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
          </button>

          {catOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg z-30 py-1 min-w-[180px]">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setCatOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    activeCategory === cat
                      ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-500 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
