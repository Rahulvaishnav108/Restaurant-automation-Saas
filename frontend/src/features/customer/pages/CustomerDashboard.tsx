import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, QrCode } from 'lucide-react';
import { useCustomerStore } from '../store/customer.store';
import {
  CustomerHomeStats,
  ActiveOrderCard,
  QuickActionsGrid,
  PopularDishesRow,
  RecentOrdersList,
} from '../components/dashboard';

export default function CustomerDashboard() {
  const { tableCode, getTotalItems } = useCustomerStore();
  const cartItems = getTotalItems();
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 space-y-5 pb-24 md:pb-6">

      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FF9F00] to-[#e68f00] p-4 sm:p-5 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -right-2 top-8 w-16 h-16 rounded-full bg-white/10" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <p className="text-white/80 text-xs mb-1">Welcome to your table</p>
            <div className="flex items-center gap-2 mb-3">
              <QrCode className="w-4 h-4" />
              <span className="font-bold text-lg">{tableCode}</span>
            </div>
            <button
              onClick={() => navigate('/customer/menu')}
              className="bg-white text-[#FF9F00] text-xs font-bold px-4 py-2 rounded-full hover:bg-white/90 transition-colors shadow-sm"
            >
              Browse Menu →
            </button>
          </div>

          {/* Cart bubble */}
          <button
            onClick={() => navigate('/customer/menu')}
            className="flex flex-col items-center gap-1 bg-white/20 hover:bg-white/30 rounded-2xl p-3 transition-colors flex-shrink-0"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white text-[#FF9F00] rounded-full text-[9px] font-black flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold">Cart</span>
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <CustomerHomeStats />

      {/* Active order tracker — only shows when there's an active order */}
      <ActiveOrderCard />

      {/* Quick service actions */}
      <QuickActionsGrid />

      {/* Popular dishes */}
      <PopularDishesRow />

      {/* Recent orders */}
      <RecentOrdersList />
    </div>
  );
}
