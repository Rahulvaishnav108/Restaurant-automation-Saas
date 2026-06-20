import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../components/dashboard/CartContext';
import { useCustomerStore } from '../store/customer.store';

export default function CustomerCheckoutPage() {
  const { items, updateQuantity, removeItem, subtotal, resCharges, discount, total, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [coupon, setCoupon] = useState('');
  const navigate = useNavigate();
  const { addNotification } = useCustomerStore();

  const handlePlaceOrder = () => {
    if (items.length === 0) return;

    addNotification(
      'Order Placed! 🍽️',
      `Your order for ${items.map((i) => `${i.name} x${i.quantity}`).join(', ')} has been placed. Total: ₹${total}`,
      'order',
      '/customer/orders'
    );
    clearCart();
    navigate('/customer/orders');
  };

  const PAYMENT_OPTIONS = [
    { id: 'upi', icon: 'account_balance_wallet', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm & more' },
    { id: 'card', icon: 'credit_card', label: 'Card', desc: 'Visa, Mastercard, RuPay & more' },
    { id: 'netbanking', icon: 'account_balance', label: 'Net Banking', desc: 'All major banks supported' },
  ];

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto h-full sd-custom-scrollbar">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-sd-on-surface font-sans">Checkout</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="material-symbols-outlined text-sd-primary text-[18px]">location_on</span>
          <span className="text-sm text-sd-on-surface-variant font-sans">Table T07</span>
          <span className="mx-1 text-sd-surface-variant">|</span>
          <div className="flex items-center gap-1 bg-sd-secondary-container/20 px-2 py-0.5 rounded-full">
            <span className="material-symbols-outlined text-sd-secondary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            <span className="text-[11px] text-sd-secondary font-sans">Secure Checkout</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order Items */}
          <section className="bg-white rounded-2xl shadow-sm border border-sd-surface-variant overflow-hidden">
            <div className="p-5 border-b border-sd-surface-variant flex items-center justify-between">
              <h3 className="text-base font-bold font-sans flex items-center gap-2">
                Your Order <span className="text-sd-on-surface-variant font-normal text-sm">({items.length} items)</span>
              </h3>
              <Link to="/customer/menu" className="text-sd-primary font-bold text-sm font-sans hover:underline">Edit Order</Link>
            </div>
            <div className="divide-y divide-sd-surface-variant">
              {items.map((item) => (
                <div key={item.id} className="p-5 flex gap-4 group">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-sd-surface-container">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-sd-on-surface-variant/30">flatware</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sd-on-surface text-sm font-sans">{item.name}</h4>
                      <p className="font-bold text-sd-on-surface text-sm font-sans">₹{item.price * item.quantity}</p>
                    </div>
                    {item.description && (
                      <p className="text-xs text-sd-on-surface-variant font-sans mt-0.5 line-clamp-1">{item.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center border border-sd-surface-variant rounded-lg overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2.5 py-1 hover:bg-sd-surface-container-low text-sd-on-surface-variant transition-colors text-sm">−</button>
                        <span className="px-2.5 font-bold text-sd-on-surface text-sm font-sans">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2.5 py-1 hover:bg-sd-surface-container-low text-sd-on-surface-variant transition-colors text-sm">+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-sd-error text-xs font-semibold flex items-center gap-1 font-sans">
                        <span className="material-symbols-outlined text-[14px]">delete</span> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-sd-surface-container-low text-center">
              <Link to="/customer/menu" className="text-sd-primary font-bold text-sm flex items-center justify-center gap-2 font-sans">
                <span className="material-symbols-outlined text-[18px]">add_circle</span> Add more items
              </Link>
            </div>
          </section>

          {/* Payment Methods */}
          <section className="space-y-4">
            <h3 className="text-base font-bold font-sans">Payment Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PAYMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`p-5 rounded-2xl border-2 shadow-sm flex items-start gap-4 text-left transition-all ${
                    paymentMethod === opt.id ? 'border-sd-primary-container bg-white' : 'border-sd-surface-variant bg-white hover:border-sd-primary-container/50'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${paymentMethod === opt.id ? 'bg-sd-primary-container/10' : 'bg-sd-surface-container'}`}>
                    <span className={`material-symbols-outlined text-[24px] ${paymentMethod === opt.id ? 'text-sd-primary-container' : 'text-sd-on-surface-variant'}`}>{opt.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sd-on-surface text-sm font-sans">{opt.label}</p>
                    <p className="text-[11px] text-sd-on-surface-variant font-sans mt-0.5">{opt.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${paymentMethod === opt.id ? 'border-sd-primary-container' : 'border-sd-surface-variant'}`}>
                    {paymentMethod === opt.id && <div className="w-2 h-2 rounded-full bg-sd-primary-container" />}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Coupon */}
          <section className="bg-sd-primary-fixed/20 p-5 rounded-2xl border border-sd-primary-fixed flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
            <div className="absolute -left-4 -bottom-4 opacity-10">
              <span className="material-symbols-outlined text-[100px]">local_activity</span>
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-sd-primary-container rounded-full flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
              </div>
              <div>
                <h4 className="font-bold text-sd-on-surface text-sm font-sans">Apply Coupon</h4>
                <p className="text-[11px] text-sd-on-surface-variant font-sans">Get exciting offers & rewards!</p>
              </div>
            </div>
            <div className="flex w-full md:w-auto gap-2 relative z-10">
              <input
                className="flex-1 md:w-56 bg-white border border-sd-surface-variant rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-sd-primary-container transition-all text-sm font-sans"
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button className="bg-sd-primary-container text-white px-5 h-11 rounded-xl font-bold text-sm hover:scale-105 transition-transform font-sans">Apply</button>
            </div>
          </section>
        </div>

        {/* Right Column — Bill Summary */}
        <aside className="lg:col-span-4 lg:sticky lg:top-4 self-start space-y-5">
          <div className="bg-white rounded-2xl shadow-lg border border-sd-surface-variant p-5 space-y-5">
            <h3 className="text-base font-bold font-sans">Bill Summary</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm font-sans"><span className="text-sd-on-surface-variant">Item Total</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between text-sm font-sans"><span className="text-sd-on-surface-variant">Restaurant Charges</span><span>₹{resCharges}</span></div>
              <div className="flex justify-between text-sm font-sans text-sd-secondary"><span>Discount</span><span className="font-bold">- ₹{discount}</span></div>
              <div className="pt-2.5 border-t border-sd-surface-variant flex justify-between">
                <span className="text-lg font-bold text-sd-on-surface font-sans">To Pay</span>
                <span className="text-lg font-bold text-sd-primary font-sans">₹{total}</span>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={items.length === 0}
              className="w-full bg-sd-primary-container text-white h-13 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-sd-primary-container/20 transition-all active:scale-95 font-sans disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pay ₹{total}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <div className="bg-sd-surface-container-low p-3.5 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-sd-secondary">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                <span className="text-xs font-bold font-sans">100% Secure Payments</span>
              </div>
              <p className="text-[11px] text-sd-on-surface-variant font-sans">Your transaction is encrypted and secure.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
