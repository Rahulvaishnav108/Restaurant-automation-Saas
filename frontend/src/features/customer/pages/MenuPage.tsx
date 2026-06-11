import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Heart,
  Plus,
  Minus,
  ShoppingBag,
  Trash2,
  ChefHat
} from 'lucide-react';
import { useCustomerStore, MENU_ITEMS } from '../store/customer.store';

export default function MenuPage() {
  const navigate = useNavigate();
  const { 
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
    setSearch,
    vegOnly,
    toggleVegOnly
  } = useCustomerStore();

  const cartCount = getTotalItems();
  const totalPrice = getTotalPrice();
  const [sortBy, setSortBy] = useState<'recommended' | 'priceAsc' | 'priceDesc'>('recommended');
  const [spicyOnly, setSpicyOnly] = useState(false);

  // Categories list based on Stitch design
  const categories = [
    { label: 'All', icon: '🍽️' },
    { label: 'Biryani', icon: '🍛' },
    { label: 'Pizza', icon: '🍕' },
    { label: 'Burgers', icon: '🍔' },
    { label: 'Desserts', icon: '🧁' },
    { label: 'Drinks', icon: '🥤' }
  ];

  // Filtered and Sorted Menu Items
  const filteredMenuItems = useMemo(() => {
    const items = MENU_ITEMS.filter((item) => {
      const matchesCategory = category === 'All' || item.cat === category;
      const matchesSearch = !search.trim() || `${item.name} ${item.desc} ${item.cat}`.toLowerCase().includes(search.toLowerCase());
      const matchesVeg = !vegOnly || item.veg;
      const matchesSpicy = !spicyOnly || item.name.toLowerCase().includes('biryani') || item.name.toLowerCase().includes('tikka'); // mockup spicy matching
      return matchesCategory && matchesSearch && matchesVeg && matchesSpicy;
    });

    if (sortBy === 'priceAsc') {
      return items.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      return items.sort((a, b) => b.price - a.price);
    }

    return items;
  }, [category, search, vegOnly, spicyOnly, sortBy]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Top Banner/Header Area */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 px-6 py-6 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Our Menu</h2>
            <p className="text-xs text-slate-500 mt-1">Delicious meals, freshly prepared just for you.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {/* Veg Mode Switcher */}
            <div className="flex items-center gap-2 select-none">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Veg Only</span>
              <button 
                type="button"
                onClick={toggleVegOnly}
                aria-label="Toggle Veg Only"
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                  vegOnly ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              >
                <div 
                  className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    vegOnly ? 'translate-x-4' : ''
                  }`}
                />
              </button>
            </div>

            {/* Spicy Mode Switcher */}
            <div className="flex items-center gap-2 select-none">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Spicy 🔥</span>
              <button 
                type="button"
                onClick={() => setSpicyOnly(!spicyOnly)}
                aria-label="Toggle Spicy Only"
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                  spicyOnly ? 'bg-orange-500' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              >
                <div 
                  className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    spicyOnly ? 'translate-x-4' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:p-6 flex-1 items-start">
        
        {/* Menu Listings and Filters (col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Categories Scroller */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
            {categories.map((cat) => {
              const active = category === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setCategory(cat.label)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border transition-all shrink-0 font-bold text-xs ${
                    active 
                      ? 'border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/10' 
                      : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sub-filters/Sorting Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Sort by:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as 'recommended' | 'priceAsc' | 'priceDesc')}
                className="bg-transparent border-none text-xs font-bold text-orange-500 focus:ring-0 p-0 cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>
            <span className="text-xs text-slate-400">{filteredMenuItems.length} dishes found</span>
          </div>

          {/* Food Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMenuItems.length === 0 ? (
              <div className="col-span-full py-16 text-center space-y-3">
                <ChefHat className="w-12 h-12 stroke-1 text-slate-400 mx-auto" />
                <p className="font-bold text-slate-600 dark:text-slate-400">No dishes match your filters</p>
                <p className="text-xs text-slate-400">Try adjusting your filters, search term, or select another category</p>
              </div>
            ) : (
              filteredMenuItems.map((item) => {
                const inCart = cart.find(c => c.id === item.id);
                const isFav = favourites.includes(item.id);
                return (
                  <div 
                    key={item.id} 
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:border-orange-500/10 dark:hover:border-orange-500/15 hover:shadow-md transition-all flex flex-col group"
                  >
                    <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {item.badge && (
                        <span className="absolute top-3 left-3 bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                          {item.badge}
                        </span>
                      )}
                      <button 
                        onClick={() => toggleFavourite(item.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {item.name}
                          </h3>
                          <span className="text-xs font-bold text-green-500 shrink-0">
                            {item.veg ? '🟢 Veg' : '🔴 Non-Veg'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-450 dark:text-slate-400 line-clamp-2">
                          {item.desc}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
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
                            className="px-5 py-1.5 border border-orange-500/30 text-orange-500 text-xs font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-colors"
                          >
                            ADD
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Sidebar Cart panel */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm sticky top-20 flex flex-col max-h-[calc(100vh-120px)]">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                Your Cart
                {cartCount > 0 && (
                  <span className="text-xs bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-full font-bold">
                    {cartCount}
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
                  <p className="text-xs max-w-xs">Add items from the menu or browse categories to populate your cart</p>
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
                  Checkout Now →
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
