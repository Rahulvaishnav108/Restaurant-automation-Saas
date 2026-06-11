import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Clock, 
  ShieldCheck, 
  Flame, 
  Star, 
  Heart,
  Plus,
  Minus,
  ShoppingBag,
  Trash2,
  Compass
} from 'lucide-react';
import { useCustomerStore, MENU_ITEMS } from '../store/customer.store';
import { useAuth } from '../../../auth/AuthProvider';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    tableCode, 
    cart, 
    addToCart, 
    removeFromCart, 
    clearCart,
    getTotalPrice, 
    getTotalItems,
    favourites,
    toggleFavourite,
    category,
    setCategory,
    search,
    setSearch
  } = useCustomerStore();

  const cartCount = getTotalItems();
  const totalPrice = getTotalPrice();

  // Filter items for recommended section
  const recommendedItems = MENU_ITEMS.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Welcome & Banner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:p-6">
        
        {/* Left Column: Greeting, Search, Categories & Recommended (Bento Layout span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Greeting Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Good Evening, {user?.name?.split(' ')[0] ?? 'Guest'}! 👋
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                What would you like to order today at Table <span className="font-bold text-orange-500">{tableCode}</span>?
              </p>
            </div>
            
            {/* Quick Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search for dishes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-9 pr-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>

          {/* Hero Promo Banner */}
          <div className="relative overflow-hidden rounded-[2rem] bg-orange-50 dark:bg-orange-950/20 border border-orange-100/30 dark:border-orange-900/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 min-h-[220px]">
            {/* Background vector simulation */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex-1 space-y-4 text-center md:text-left">
              <span className="inline-block px-3 py-1 bg-orange-500/10 text-orange-500 dark:text-orange-400 font-bold text-xs rounded-full">
                Today&apos;s Special
              </span>
              <h3 className="text-xl sm:text-2xl font-black leading-tight text-slate-900 dark:text-white">
                Delicious food delivered straight to your table
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
                Get freshly cooked meals with the finest ingredients. Check out our hot deals!
              </p>
              <button 
                onClick={() => navigate('/customer/menu')}
                className="px-6 py-2.5 bg-orange-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-colors"
              >
                Order Now
              </button>
            </div>

            <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
              <div className="absolute top-0 right-0 bg-orange-500 text-white p-3 rounded-full w-16 h-16 flex flex-col items-center justify-center rotate-12 shadow-md border-2 border-white dark:border-slate-900 z-10">
                <span className="text-sm font-extrabold">20%</span>
                <span className="text-[8px] font-black uppercase tracking-wider">OFF</span>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=300&q=80"
                alt="Gourmet Special" 
                className="w-36 h-36 rounded-2xl object-cover shadow-xl rotate-3 hover:rotate-0 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Quick Categories Bar */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Browse Categories</h3>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
              {[
                { label: 'All', icon: '🍽️' },
                { label: 'Biryani', icon: '🍛' },
                { label: 'Pizza', icon: '🍕' },
                { label: 'Burgers', icon: '🍔' },
                { label: 'Desserts', icon: '🧁' },
                { label: 'Drinks', icon: '🥤' },
              ].map((cat) => {
                const active = category === cat.label;
                return (
                  <button
                    key={cat.label}
                    onClick={() => {
                      setCategory(cat.label);
                      navigate('/customer/menu');
                    }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all min-w-[72px] shrink-0 ${
                      active 
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20 text-orange-500' 
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-xs font-semibold">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recommended Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-lg font-bold">Recommended for you</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Handpicked based on your taste</p>
              </div>
              <button 
                onClick={() => navigate('/customer/menu')}
                className="text-xs text-orange-500 font-bold hover:underline"
              >
                View all →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedItems.map((item) => {
                const inCart = cart.find(c => c.id === item.id);
                const isFav = favourites.includes(item.id);
                return (
                  <div 
                    key={item.id} 
                    className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
                  >
                    <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {item.badge && (
                        <span className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {item.badge}
                        </span>
                      )}
                      <button 
                        onClick={() => toggleFavourite(item.id)}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h4 className="font-bold text-sm text-slate-950 dark:text-white truncate">
                            {item.name}
                          </h4>
                          <span className="text-xs font-bold text-orange-500 flex items-center gap-0.5">
                            <Star className="w-3.5 h-3.5 fill-current" /> {item.rating}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                          {item.desc}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50 dark:border-slate-800/50">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                          ₹{item.price}
                        </span>
                        
                        {inCart ? (
                          <div className="flex items-center border border-orange-500/30 rounded-xl overflow-hidden h-8">
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="px-2.5 h-full bg-orange-50 dark:bg-orange-950/20 hover:bg-orange-100 text-orange-500 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-bold text-orange-500">
                              {inCart.qty}
                            </span>
                            <button 
                              onClick={() => addToCart(item.id)}
                              className="px-2.5 h-full bg-orange-50 dark:bg-orange-950/20 hover:bg-orange-100 text-orange-500 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => addToCart(item.id)}
                            className="px-4 py-1.5 border border-orange-500/30 text-orange-500 text-xs font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-colors"
                          >
                            ADD
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Highlights Info Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Fast Delivery', desc: 'On-time service', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/20', icon: Clock },
              { label: 'Fresh Food', desc: 'Hygienic & tasty', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/20', icon: Flame },
              { label: 'Live Tracking', desc: 'Track your order', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20', icon: Compass },
              { label: 'Best Offers', desc: 'Exciting deals', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/20', icon: ShieldCheck },
            ].map((feature, i) => (
              <div 
                key={i} 
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 shadow-sm"
              >
                <div className={`w-10 h-10 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center shrink-0`}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-950 dark:text-white">{feature.label}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Order Summary Panel (Sticky Sidebar) */}
        <div className="space-y-6">
          
          {/* Cart Panel */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm sticky top-20 flex flex-col max-h-[calc(100vh-120px)]">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                Your Order
                {cartCount > 0 && (
                  <span className="text-xs bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-full font-bold">
                    {cartCount} Items
                  </span>
                )}
              </h3>
              {cartCount > 0 && (
                <button 
                  onClick={clearCart}
                  className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 custom-scrollbar min-h-[180px]">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500 text-center space-y-2">
                  <ShoppingBag className="w-10 h-10 stroke-1" />
                  <p className="text-sm font-semibold">Your cart is empty</p>
                  <p className="text-xs max-w-xs">Add items from the menu or quick recommendations to start ordering</p>
                </div>
              ) : (
                cart.map((cartItem) => {
                  const item = MENU_ITEMS.find(m => m.id === cartItem.id);
                  if (!item) return null;
                  return (
                    <div key={cartItem.id} className="flex gap-3 items-center justify-between p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-100"
                      />
                      <div className="flex-1 min-w-0 px-2">
                        <h4 className="text-xs font-bold truncate text-slate-900 dark:text-white">
                          {item.name}
                        </h4>
                        <p className="text-xs font-extrabold text-orange-500 mt-0.5">
                          ₹{item.price}
                        </p>
                      </div>
                      
                      {/* Counter */}
                      <div className="flex items-center border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden shrink-0">
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
                  );
                })
              )}
            </div>

            {/* Bill Summary */}
            {cartCount > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3 shrink-0">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Delivery/Service Fee</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">₹30</span>
                </div>
                <div className="flex justify-between text-xs text-green-500">
                  <span>Discount (20% membership)</span>
                  <span className="font-semibold">-₹{Math.round(totalPrice * 0.2)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold border-t border-dashed border-slate-100 dark:border-slate-800 pt-2 text-slate-900 dark:text-white">
                  <span>Total</span>
                  <span className="text-orange-500">₹{Math.round(totalPrice * 0.8 + 30)}</span>
                </div>
                
                <button
                  onClick={() => navigate('/customer/checkout')}
                  className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 transition-colors mt-2"
                >
                  Proceed to Checkout →
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
