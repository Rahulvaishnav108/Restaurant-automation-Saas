import React from 'react';
import { Plus, ChevronDown, Filter, Calendar } from 'lucide-react';

export function OrdersHeader() {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Orders Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Track and manage all customer orders in real-time
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Date picker */}
        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Calendar className="w-4 h-4 text-gray-400" />
          Today, May 20
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>

        {/* Filter */}
        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Filter className="w-4 h-4 text-gray-400" />
          Filter
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>

        {/* New Order */}
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 rounded-xl transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          New Order
        </button>
      </div>
    </div>
  );
}