import React from 'react';
import { Search, LayoutGrid, List, Map } from 'lucide-react';
import { useTablesStore } from '../../store/tables.store';
import type { TableSection, TableStatus } from '../../store/tables.store';

const sections: (TableSection | 'All')[] = ['All', 'Indoor', 'Outdoor', 'Bar', 'Private'];
const statuses: (TableStatus | 'All')[]  = ['All', 'Available', 'Occupied', 'Reserved', 'Cleaning', 'Blocked'];
const floors:   (number | 'All')[]       = ['All', 1, 2];

export function TableFilterBar(): JSX.Element {
  const { filter, viewMode, setFilter, setViewMode } = useTablesStore();

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search table…"
          value={filter.search}
          onChange={e => setFilter({ search: e.target.value })}
          className="pl-9 pr-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 focus:border-orange-300 dark:focus:border-orange-600 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 w-36"
        />
      </div>

      {/* Section filter */}
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {sections.map(s => (
          <button
            key={s}
            onClick={() => setFilter({ section: s as TableSection | 'All' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter.section === s
                ? 'bg-white dark:bg-gray-700 text-orange-500 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Status filter */}
      <select
        value={filter.status}
        onChange={e => setFilter({ status: e.target.value as TableStatus | 'All' })}
        className="py-2 pl-3 pr-8 text-xs font-semibold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-orange-100"
      >
        {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
      </select>

      {/* Floor filter */}
      <select
        value={filter.floor}
        onChange={e => setFilter({ floor: e.target.value === 'All' ? 'All' : Number(e.target.value) })}
        className="py-2 pl-3 pr-8 text-xs font-semibold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-orange-100"
      >
        {floors.map(f => <option key={f} value={f}>{f === 'All' ? 'All Floors' : `Floor ${f}`}</option>)}
      </select>

      {/* View mode toggle */}
      <div className="ml-auto flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {([
          { mode: 'floor-map', icon: Map },
          { mode: 'grid',      icon: LayoutGrid },
          { mode: 'list',      icon: List },
        ] as const).map(({ mode, icon: Icon }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === mode
                ? 'bg-white dark:bg-gray-700 text-orange-500 shadow-sm'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            }`}
            title={mode.replace('-', ' ')}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>
    </div>
  );
}