import React, { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { useMenuStore, type FilterTab, type SortOption } from '../../store/menu.store';
import { FilterModal, type FilterOptions } from './FilterModal';

const FILTER_TABS: FilterTab[] = ['All Items', 'Available', 'Unavailable', 'Low Stock'];
const SORT_OPTIONS: SortOption[] = ['Name A-Z', 'Name Z-A', 'Price Low-High', 'Price High-Low', 'Stock Low-High'];

const DEFAULT_FILTER: FilterOptions = { minPrice: '', maxPrice: '', statuses: [] };

export function MenuFilterBar(): JSX.Element {
  const {
    activeFilter, setActiveFilter,
    searchQuery, setSearchQuery,
    sortOption, setSortOption,
  } = useMenuStore();

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [advFilter, setAdvFilter] = useState<FilterOptions>(DEFAULT_FILTER);

  const hasAdvFilter =
    advFilter.minPrice !== '' ||
    advFilter.maxPrice !== '' ||
    advFilter.statuses.length > 0;

  const clearAdvFilter = () => setAdvFilter(DEFAULT_FILTER);

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        {/* Tab filters */}
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

        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          {/* Search */}
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

          {/* Filter button */}
          <button
            onClick={() => setShowFilterModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border rounded-lg transition-colors ${
              hasAdvFilter
                ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800'
                : 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter
            {hasAdvFilter && (
              <span
                className="w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center ml-0.5"
                title="Filters active"
              >
                !
              </span>
            )}
          </button>

          {/* Clear advanced filter */}
          {hasAdvFilter && (
            <button
              onClick={clearAdvFilter}
              title="Clear advanced filters"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors border border-gray-200 dark:border-gray-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Sort */}
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

      {showFilterModal && (
        <FilterModal
          initial={advFilter}
          onApply={setAdvFilter}
          onClose={() => setShowFilterModal(false)}
        />
      )}
    </>
  );
}