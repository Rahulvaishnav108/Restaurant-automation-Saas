import React, { useState } from 'react';
import {
  ConciergeBell, ReceiptText, Droplets, Utensils,
  Sparkles, Headphones,
} from 'lucide-react';
import { useCustomerStore } from '../../store/customer.store';

const actions = [
  {
    id: 'waiter',
    label: 'Call Waiter',
    icon: ConciergeBell,
    color: 'text-[#FF9F00]',
    bg: 'bg-[#FF9F00]/10 dark:bg-[#FF9F00]/15',
    border: 'border-[#FF9F00]/20',
  },
  {
    id: 'bill',
    label: 'Request Bill',
    icon: ReceiptText,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950/30',
    border: 'border-green-200/50 dark:border-green-800/40',
  },
  {
    id: 'water',
    label: 'Water Refill',
    icon: Droplets,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200/50 dark:border-blue-800/40',
  },
  {
    id: 'cutlery',
    label: 'Cutlery',
    icon: Utensils,
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-200/50 dark:border-purple-800/40',
  },
  {
    id: 'cleaning',
    label: 'Clean Table',
    icon: Sparkles,
    color: 'text-pink-500',
    bg: 'bg-pink-50 dark:bg-pink-950/30',
    border: 'border-pink-200/50 dark:border-pink-800/40',
  },
  {
    id: 'help',
    label: 'Help',
    icon: Headphones,
    color: 'text-gray-600 dark:text-gray-300',
    bg: 'bg-gray-100 dark:bg-gray-700/50',
    border: 'border-gray-200/50 dark:border-gray-600/40',
  },
];

export default function QuickActionsGrid() {
  const { requestService } = useCustomerStore();
  const [sent, setSent] = useState<string | null>(null);

  function handleAction(id: string, label: string) {
    const type = (['waiter', 'water', 'cleaning'].includes(id) ? id : 'other') as 'waiter' | 'water' | 'cleaning' | 'other';
    requestService({
      id,
      label,
      description: `Request for ${label}`,
      type,
      status: 'Pending',
    });
    setSent(id);
    setTimeout(() => setSent(null), 2000);
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {actions.map(({ id, label, icon: Icon, color, bg, border }) => {
          const isSent = sent === id;
          return (
            <button
              key={id}
              onClick={() => handleAction(id, label)}
              disabled={!!sent}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all hover:-translate-y-0.5 active:scale-95 ${bg} ${border} ${
                isSent ? 'opacity-70 scale-95' : 'hover:shadow-sm'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <span className={`text-[10px] sm:text-xs font-medium text-center leading-tight ${color}`}>
                {isSent ? 'Sent ✓' : label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
