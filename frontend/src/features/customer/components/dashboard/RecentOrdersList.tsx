import React from 'react';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCustomerStore } from '../../store/customer.store';

const STATUS_STYLES: Record<string, string> = {
  Placed:    'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
  Preparing: 'bg-[#FF9F00]/10 text-[#FF9F00]',
  Ready:     'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400',
  Served:    'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
  Cancelled: 'bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400',
};

export default function RecentOrdersList() {
  const { orders, reorder } = useCustomerStore();
  const navigate = useNavigate();

  const recent = orders.slice(0, 3);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
        <button
          onClick={() => navigate('/customer/orders')}
          className="flex items-center gap-1 text-xs text-[#FF9F00] font-semibold hover:underline"
        >
          View all <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recent.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">No orders yet</p>
      ) : (
        <div className="space-y-3">
          {recent.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold text-gray-900 dark:text-white font-mono">{order.id}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[order.status] ?? ''}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 truncate">{order.items}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-bold text-gray-900 dark:text-white">₹{order.total}</span>
                {order.status === 'Served' && (
                  <button
                    onClick={() => reorder(order)}
                    className="w-6 h-6 rounded-full bg-[#FF9F00]/10 text-[#FF9F00] flex items-center justify-center hover:bg-[#FF9F00] hover:text-white transition-all"
                    title="Reorder"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
