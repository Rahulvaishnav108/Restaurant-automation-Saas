import React from 'react';
import { Minus, Plus, X } from 'lucide-react';
import type { CustomerMenuItem } from './MenuItemCard';

export type CustomerCartItem = {
  id: number;
  qty: number;
};

type CartModalProps = {
  open: boolean;
  cart: CustomerCartItem[];
  menuItems: CustomerMenuItem[];
  totalItems: number;
  totalPrice: number;
  onClose: () => void;
  onAdd: (id: number, name: string) => void;
  onRemove: (id: number) => void;
  onPlaceOrder: () => void;
};

const CartModal: React.FC<CartModalProps> = ({ open, cart, menuItems, totalItems, totalPrice, onClose, onAdd, onRemove, onPlaceOrder }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md rounded-t-3xl bg-[#0e1221] border-t border-white/10 p-5 pb-8" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Your Cart ({totalItems})</h3>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        {cart.length === 0 ? (
          <p className="text-center text-slate-400 py-8">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.map((cartItem) => {
                const item = menuItems.find((menuItem) => menuItem.id === cartItem.id);
                if (!item) return null;

                return (
                  <div key={cartItem.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 p-3">
                    <span className="text-sm font-medium flex-1">{item.name}</span>
                    <div className="flex items-center gap-2 rounded-xl bg-orange-500 px-2 py-1">
                      <button onClick={() => onRemove(cartItem.id)}><Minus className="h-3 w-3" /></button>
                      <span className="text-xs font-bold w-4 text-center">{cartItem.qty}</span>
                      <button onClick={() => onAdd(cartItem.id, item.name)}><Plus className="h-3 w-3" /></button>
                    </div>
                    <span className="text-sm font-bold w-16 text-right">₹{item.price * cartItem.qty}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 border-t border-white/10 pt-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Total</p>
                <p className="text-xl font-bold">₹{totalPrice}</p>
              </div>
              <button onClick={onPlaceOrder} className="rounded-2xl bg-orange-500 px-6 py-3 font-bold hover:bg-orange-600 transition">Place Order</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;
