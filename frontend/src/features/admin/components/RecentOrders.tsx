import React from 'react';

const orders = [
  { id: 'ORD-00124', customer: 'Sarah Brooks', time: '3 mins ago', amount: '₹1,240' },
  { id: 'ORD-00123', customer: 'Sarah Johnson', time: '15 mins ago', amount: '₹680' },
  { id: 'ORD-00122', customer: 'Michael Brown', time: '23 mins ago', amount: '₹2,100' },
  { id: 'ORD-00121', customer: 'Emily Davis', time: '31 mins ago', amount: '₹1,850' },
  { id: 'ORD-00120', customer: 'David Wilson', time: '45 mins ago', amount: '₹920' },
];

export function RecentOrders() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
        <button className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors">View All</button>
      </div>
      <div className="space-y-2.5">
        {orders.map((o) => (
          <div key={o.id} className="flex items-center gap-3 py-1">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">#{o.id}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{o.customer} · {o.time}</p>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white flex-shrink-0">{o.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}