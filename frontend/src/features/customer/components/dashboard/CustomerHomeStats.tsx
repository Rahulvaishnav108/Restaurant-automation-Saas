import React from 'react';
import { ShoppingBag, MapPin, Gift, Clock } from 'lucide-react';
import { useCustomerStore } from '../../store/customer.store';

export default function CustomerHomeStats() {
  const { orders, tableCode, getTotalItems } = useCustomerStore();
  const activeOrder = orders.find((o) => o.status === 'Preparing' || o.status === 'Placed');
  const cartItems = getTotalItems();

  const stats = [
    {
      label: 'Active Order',
      value: activeOrder ? activeOrder.id : 'None',
      sub: activeOrder ? `ETA ${activeOrder.eta}` : 'No active orders',
      icon: ShoppingBag,
      color: 'text-[#FF9F00]',
      bg: 'bg-[#FF9F00]/10 dark:bg-[#FF9F00]/15',
      dot: activeOrder ? 'bg-green-400' : 'bg-gray-300',
    },
    {
      label: 'Your Table',
      value: tableCode || 'T-00',
      sub: 'Session active',
      icon: MapPin,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      dot: 'bg-blue-400',
    },
    {
      label: 'Cart Items',
      value: cartItems > 0 ? `${cartItems} item${cartItems > 1 ? 's' : ''}` : 'Empty',
      sub: cartItems > 0 ? 'Ready to order' : 'Add from menu',
      icon: Clock,
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      dot: cartItems > 0 ? 'bg-purple-400' : 'bg-gray-300',
    },
    {
      label: 'Loyalty Points',
      value: '240 pts',
      sub: '60 pts to next reward',
      icon: Gift,
      color: 'text-pink-500',
      bg: 'bg-pink-50 dark:bg-pink-950/30',
      dot: 'bg-pink-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(({ label, value, sub, icon: Icon, color, bg, dot }) => (
        <div
          key={label}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon className={`w-4.5 h-4.5 ${color}`} />
            </div>
            <span className={`w-2 h-2 rounded-full mt-1 ${dot}`} />
          </div>
          <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight truncate">
            {value}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{label}</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-1 truncate">{sub}</p>
        </div>
      ))}
    </div>
  );
}
