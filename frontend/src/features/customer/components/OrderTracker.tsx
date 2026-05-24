import React from 'react';
import { CheckCircle2, Clock3, Flame, ShoppingBag } from 'lucide-react';

export type TrackedOrder = {
  id: string;
  items: string;
  total: number;
  status: 'Placed' | 'Preparing' | 'Served' | 'Completed';
  eta: string;
};

type OrderTrackerProps = {
  orders: TrackedOrder[];
  onReorder?: (order: TrackedOrder) => void;
};

const STATUS_ICON = {
  Placed: ShoppingBag,
  Preparing: Flame,
  Served: CheckCircle2,
  Completed: CheckCircle2,
};

const OrderTracker: React.FC<OrderTrackerProps> = ({ orders, onReorder }) => {
  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const Icon = STATUS_ICON[order.status];

        return (
          <div key={order.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold text-sm">
                <Icon className="h-4 w-4 text-orange-400" />
                {order.id}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${order.status === 'Preparing' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>{order.status}</span>
            </div>
            <p className="text-xs text-slate-400">{order.items}</p>
            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <span className="font-bold text-white">₹{order.total}</span>
              {order.eta !== '-' && <span className="flex items-center gap-1 text-xs text-orange-400"><Clock3 className="h-3 w-3" />ETA: {order.eta}</span>}
              {onReorder && (
                <button onClick={() => onReorder(order)} className="rounded-xl bg-orange-500/10 border border-orange-500/30 px-3 py-1.5 text-xs font-semibold text-orange-400 hover:bg-orange-500 hover:text-white transition">
                  Reorder
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTracker;
