import React from 'react';
import { ChevronRight, Clock, CheckCircle2, ChefHat, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCustomerStore } from '../../store/customer.store';

const ORDER_STEPS = [
  { key: 'Placed',    label: 'Placed',    icon: CheckCircle2 },
  { key: 'Preparing', label: 'Preparing', icon: ChefHat },
  { key: 'Ready',     label: 'Ready',     icon: Truck },
  { key: 'Served',    label: 'Served',    icon: CheckCircle2 },
];

export default function ActiveOrderCard() {
  const { orders } = useCustomerStore();
  const navigate = useNavigate();

  const activeOrder = orders.find(
    (o) => o.status === 'Placed' || o.status === 'Preparing' || o.status === 'Ready'
  );

  if (!activeOrder) return null;

  const stepIndex = ORDER_STEPS.findIndex((s) => s.key === activeOrder.status);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Live Order
          </span>
          <span className="text-xs text-gray-400 font-mono">{activeOrder.id}</span>
        </div>
        <button
          onClick={() => navigate('/customer/orders')}
          className="flex items-center gap-1 text-xs text-[#FF9F00] font-semibold hover:underline"
        >
          View <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4">
        {/* Items */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{activeOrder.items}</p>

        {/* Progress bar steps */}
        <div className="flex items-center justify-between relative mb-2">
          {/* connecting line */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100 dark:bg-gray-700 z-0" />
          <div
            className="absolute top-4 left-4 h-0.5 bg-[#FF9F00] z-0 transition-all duration-500"
            style={{ width: `${(stepIndex / (ORDER_STEPS.length - 1)) * 100}%` }}
          />

          {ORDER_STEPS.map((step, i) => {
            const done = i <= stepIndex;
            const Icon = step.icon;
            return (
              <div key={step.key} className="flex flex-col items-center gap-1.5 z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    done
                      ? 'bg-[#FF9F00] text-white shadow-md shadow-[#FF9F00]/30'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-300 dark:text-gray-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className={`text-[10px] font-medium whitespace-nowrap ${done ? 'text-[#FF9F00]' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* ETA */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">ETA: <strong className="text-gray-900 dark:text-white">{activeOrder.eta}</strong></span>
          </div>
          <span className="text-sm font-bold text-gray-900 dark:text-white">₹{activeOrder.total}</span>
        </div>
      </div>
    </div>
  );
}
