import React from 'react';

const items = [
  { name: 'Margherita Pizza', count: 245, color: '#f97316', img: '🍕' },
  { name: 'Cheesy Burger', count: 189, color: '#ef4444', img: '🍔' },
  { name: 'Grilled Chicken', count: 147, color: '#f59e0b', img: '🍗' },
  { name: 'Pasta Alfredo', count: 128, color: '#10b981', img: '🍝' },
  { name: 'Caesar Salad', count: 102, color: '#3b82f6', img: '🥗' },
];

const maxCount = 245;

export function TopSellingItems() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Top Selling Items</h3>
        <button className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors">View All</button>
      </div>
      <div className="space-y-3.5">
        {items.map((item) => (
          <div key={item.name} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl flex-shrink-0">
              {item.img}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.name}</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white ml-2">{item.count}</span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(item.count / maxCount) * 100}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}