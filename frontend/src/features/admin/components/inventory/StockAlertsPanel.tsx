import React from 'react';
import { useInventoryStore } from '../../store/inventory.store';
import { InventoryStatusBadge } from './InventoryStatusBadge';

export function StockAlertsPanel() {
  const { stockAlerts } = useInventoryStore();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Stock Alerts</h3>
        <button className="text-xs text-orange-500 hover:text-orange-600 dark:text-orange-400 font-medium transition-colors">
          View all
        </button>
      </div>

      <div className="space-y-3">
        {stockAlerts.map((alert) => (
          <div key={alert.id} className="flex items-center gap-3">
            <span className="text-2xl leading-none flex-shrink-0">{alert.imageEmoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{alert.name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{alert.detail}</p>
            </div>
            <InventoryStatusBadge status={alert.status} />
          </div>
        ))}
      </div>
    </div>
  );
}