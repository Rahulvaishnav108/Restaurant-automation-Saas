import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  MapPin, 
  ShieldCheck, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Ticket, 
  Headphones, 
  Lock,
  Wallet,
  Building
} from 'lucide-react';
import { useCustomerStore, MENU_ITEMS } from '../store/customer.store';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    clearCart,
    getTotalPrice, 
    getTotalItems,
    placeOrder,
    tableCode
  } = useCustomerStore();

  const cartCount = getTotalItems();
  const totalPrice = getTotalPrice();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const discountAmount = discountApplied ? Math.round(totalPrice * 0.1) : 0; // extra 10% off for coupon
  const finalPrice = Math.max(0, totalPrice + 30 + 20 - Math.round(totalPrice * 0.2) - discountAmount); // subtotal + fee + tax - memberDiscount - couponDiscount

  function handleApplyCoupon() {
    if (couponCode.trim().toUpperCase() === 'WELCOME10') {
      setDiscountApplied(true);
    }
  }

  function handleCheckout() {
    if (cart.length === 0) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      const order = placeOrder();
      setIsProcessing(false);
      if (order) {
        navigate('/customer/orders');
      }
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 px-6 py-6 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Checkout</h2>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-500" /> Table {tableCode}
              </span>
              <span className="text-slate-350 dark:text-slate-700">|</span>
              <span className="flex items-center gap-1 text-green-500 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-full font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> Secure Checkout
              </span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/customer/menu')}
            className="text-xs text-orange-500 font-bold hover:underline"
          >
            ← Add More Items
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 w-full">
        
        {/* Left Column: Items and Payment (col-span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Order Items list */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
              <span>Your Order ({cartCount} Items)</span>
              {cartCount > 0 && (
                <button 
                  onClick={clearCart}
                  className="text-xs text-red-500 hover:text-red-650 flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Cart
                </button>
              )}
            </h3>

            {cart.length === 0 ? (
              <div className="text-center py-12 text-slate-400 dark:text-slate-500 space-y-3">
                <ShoppingBag className="w-12 h-12 stroke-1 mx-auto text-slate-300" />
                <p className="font-bold text-sm">Your cart is currently empty</p>
                <button 
                  onClick={() => navigate('/customer/menu')}
                  className="px-6 py-2 bg-orange-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/10"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {cart.map((cartItem) => {
                  const item = MENU_ITEMS.find(m => m.id === cartItem.id);
                  if (!item) return null;
                  return (
                    <div key={cartItem.id} className="py-4 flex gap-4 items-center justify-between group">
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100"
                      />
                      <div className="flex-1 min-w-0 px-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px]">{item.veg ? '🟢' : '🔴'}</span>
                          <h4 className="text-xs font-bold truncate text-slate-900 dark:text-white">
                            {item.name}
                          </h4>
                        </div>
                        <p className="text-[10px] text-slate-450 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {item.desc}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                          ₹{item.price * cartItem.qty}
                        </span>

                        <div className="flex items-center border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden h-8">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-slate-700 dark:text-slate-300">
                            {cartItem.qty}
                          </span>
                          <button 
                            onClick={() => addToCart(item.id)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Payment Methods */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Payment Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* UPI */}
              <button 
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative text-left w-full ${
                  paymentMethod === 'upi'
                    ? 'border-orange-500 bg-orange-50/20 dark:bg-orange-950/10'
                    : 'border-slate-100 dark:border-slate-800 hover:border-orange-500/30'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center shrink-0">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-950 dark:text-white">UPI</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Google Pay, PhonePe, Paytm</p>
                </div>
                {paymentMethod === 'upi' && (
                  <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-white text-[9px] font-bold">✓</div>
                )}
              </button>

              {/* Cards */}
              <button 
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative text-left w-full ${
                  paymentMethod === 'card'
                    ? 'border-orange-500 bg-orange-50/20 dark:bg-orange-950/10'
                    : 'border-slate-100 dark:border-slate-800 hover:border-orange-500/30'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-950/40 text-green-500 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-950 dark:text-white">Credit / Debit Cards</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Visa, Mastercard, RuPay</p>
                </div>
                {paymentMethod === 'card' && (
                  <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-white text-[9px] font-bold">✓</div>
                )}
              </button>

              {/* Net Banking */}
              <button 
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative text-left w-full ${
                  paymentMethod === 'netbanking'
                    ? 'border-orange-500 bg-orange-50/20 dark:bg-orange-950/10'
                    : 'border-slate-100 dark:border-slate-800 hover:border-orange-500/30'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center shrink-0">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-950 dark:text-white">Net Banking</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">All major Indian banks</p>
                </div>
                {paymentMethod === 'netbanking' && (
                  <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-white text-[9px] font-bold">✓</div>
                )}
              </button>
            </div>
          </section>

          {/* Coupon Code Section */}
          <section className="bg-orange-500/5 rounded-3xl border border-orange-500/10 p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -left-6 -bottom-6 opacity-[0.03]">
              <Ticket className="w-28 h-28 text-orange-500" />
            </div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center shrink-0">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Apply Coupon</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Enter WELCOME10 for 10% discount</p>
              </div>
            </div>

            <div className="flex w-full md:w-auto gap-2 relative z-10">
              <input 
                type="text" 
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={discountApplied}
                className="flex-1 md:w-56 h-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              <button 
                onClick={handleApplyCoupon}
                disabled={discountApplied}
                className="bg-orange-500 text-white px-5 h-10 rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors disabled:bg-slate-300 dark:disabled:bg-slate-800"
              >
                {discountApplied ? 'Applied' : 'Apply'}
              </button>
            </div>
          </section>

        </div>

        {/* Right Column: Bill Summary (col-span 4) */}
        <div className="lg:col-span-4 sticky top-20 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Bill Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Item Total</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Restaurant Charges</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">₹30</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Taxes & Fees</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">₹20</span>
              </div>
              <div className="flex justify-between text-xs text-green-500">
                <span>Discount (20% membership)</span>
                <span className="font-semibold">-₹{Math.round(totalPrice * 0.2)}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-xs text-green-500">
                  <span>Coupon Discount (10% extra)</span>
                  <span className="font-semibold">-₹{discountAmount}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-sm font-black text-slate-900 dark:text-white">
                <span>To Pay</span>
                <span className="text-orange-500">₹{finalPrice}</span>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0 || isProcessing}
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 transition-colors disabled:bg-slate-350 dark:disabled:bg-slate-800"
              >
                {isProcessing ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <span>Pay ₹{finalPrice}</span>
                  </>
                )}
              </button>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1.5 border border-slate-100/50 dark:border-slate-800/30">
                <div className="flex items-center gap-1.5 text-green-500 text-xs font-bold">
                  <Lock className="w-3.5 h-3.5" /> <span>100% Secure Payments</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Your transaction is encrypted. We do not store card details.
                </p>
              </div>
            </div>
          </div>

          {/* Support Panel */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Need help with payment?</p>
              <button className="text-xs text-orange-500 font-bold hover:underline">Contact Support</button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
