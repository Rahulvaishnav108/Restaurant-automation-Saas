import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, Edit, Clock, CheckCircle, Trash2 } from 'lucide-react';
import { useOrdersStore, type Order, type OrderStatus } from '../../store/orders.store';

interface OrderActionMenuProps {
  order: Order;
}

const actions: {
  label: string;
  icon: React.ElementType;
  status?: OrderStatus;
  danger?: boolean;
}[] = [
  { label: 'View Details',    icon: Eye },
  { label: 'Edit Order',      icon: Edit },
  { label: 'Mark Preparing',  icon: Clock,         status: 'Preparing' },
  { label: 'Mark Completed',  icon: CheckCircle,   status: 'Completed' },
  { label: 'Cancel Order',    icon: Trash2,        status: 'Cancelled', danger: true },
];

export function OrderActionMenu({ order }: OrderActionMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { updateOrderStatus } = useOrdersStore();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 w-46 min-w-[176px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg py-1 overflow-hidden">
          {actions.map(({ label, icon: Icon, status, danger }) => (
            <button
              key={label}
              onClick={() => {
                if (status) updateOrderStatus(order.id, status);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors text-left ${
                danger
                  ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}