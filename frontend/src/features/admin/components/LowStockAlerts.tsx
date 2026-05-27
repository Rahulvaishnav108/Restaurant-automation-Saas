import React from 'react';
import { AlertTriangle } from 'lucide-react';

const items = [
  { name: 'Tomato Sauce', stock: '2.5 kg', level: 'low', emoji: '🍅' },
  { name: 'Mozzarella Cheese', stock: '1.2 kg', level: 'low', emoji: '🧀' },
  { name: 'Chicken Breast', stock: '3.0 kg', level: 'running', emoji: '🍗' },
];

const levelStyle: Record<string, string> = {
  low: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
  running: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
};

const levelLabel: Record<string, string> = {
  low: 'Low Stock',
  running: 'Running Low',
};

export function LowStockAlerts() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">Low Stock Alerts</h3>
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </div>
        <button className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors">View All</button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.name} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl flex-shrink-0">
              {item.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
              <p className="text-xs text-gray-400">Stock: {item.stock}</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${levelStyle[item.level]}`}>
              {levelLabel[item.level]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}