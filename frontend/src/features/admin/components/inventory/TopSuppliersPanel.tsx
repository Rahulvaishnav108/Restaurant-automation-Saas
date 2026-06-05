import React from 'react';
import { useInventoryStore } from '../../store/inventory.store';

export function TopSuppliersPanel() {
  const { topSuppliers } = useInventoryStore();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Top Suppliers</h3>
        <button className="text-xs text-orange-500 hover:text-orange-600 dark:text-orange-400 font-medium transition-colors">
          View all
        </button>
      </div>

      <div className="space-y-3">
        {topSuppliers.map((s) => (
          <div key={s.id} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full ${s.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
              {s.initials}
            </div>
            <p className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{s.name}</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">{s.spent}</p>
          </div>
        ))}
      </div>
    </div>
  );
}