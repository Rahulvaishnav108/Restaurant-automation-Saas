import React from 'react';
import { Star, Plus, Minus, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MENU_ITEMS, useCustomerStore } from '../../store/customer.store';

export default function PopularDishesRow() {
  const { addToCart, removeFromCart, getCartQuantity } = useCustomerStore();
  const navigate = useNavigate();

  const popular = MENU_ITEMS.filter((_, i) => i < 6);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Popular Dishes</h3>
        <button
          onClick={() => navigate('/customer/menu')}
          className="flex items-center gap-1 text-xs text-[#FF9F00] font-semibold hover:underline"
        >
          View all <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal scroll on mobile, grid on desktop */}
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
        {popular.map((item) => {
          const qty = getCartQuantity(item.id);
          return (
            <div
              key={item.id}
              className="flex-shrink-0 w-40 sm:w-auto rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-750 hover:shadow-md transition-shadow group"
            >
              {/* Image */}
              <div className="relative h-24 overflow-hidden">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.badge && (
                  <span className="absolute top-1.5 left-1.5 bg-[#FF9F00] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                <span
                  className={`absolute top-1.5 right-1.5 w-4 h-4 rounded-full border border-white ${
                    item.veg ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
              </div>

              <div className="p-2.5">
                <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight truncate">
                  {item.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5 mb-2">
                  <Star className="w-3 h-3 fill-[#FF9F00] text-[#FF9F00]" />
                  <span className="text-[10px] text-gray-400">{item.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">₹{item.price}</span>
                  {qty === 0 ? (
                    <button
                      onClick={() => addToCart(item.id)}
                      className="w-6 h-6 rounded-full bg-[#FF9F00] text-white flex items-center justify-center hover:bg-[#e68f00] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-[#FF9F00] w-4 text-center">{qty}</span>
                      <button
                        onClick={() => addToCart(item.id)}
                        className="w-5 h-5 rounded-full bg-[#FF9F00] text-white flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
