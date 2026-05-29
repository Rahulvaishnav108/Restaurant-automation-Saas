import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useCustomersStore } from '../../store/customers.store';

const AVATAR_COLORS: Record<string, string> = {
  JS: 'bg-orange-500', MB: 'bg-green-500', SJ: 'bg-blue-500',
  DW: 'bg-teal-500',   JT: 'bg-amber-500',
};

export function TopCustomersPanel() {
  const { topCustomers } = useCustomersStore();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Top Customers</h3>
        <button className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
          This Month
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-3">
        {topCustomers.map((c) => {
          const bg = AVATAR_COLORS[c.avatar] ?? 'bg-gray-500';
          return (
            <div key={c.rank} className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-4 text-center">{c.rank}</span>
              <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {c.avatar}
              </div>
              <p className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{c.name}</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{c.spent}</p>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 py-2 text-xs font-semibold text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 border border-orange-100 dark:border-orange-900/50 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors">
        View All
      </button>
    </div>
  );
}