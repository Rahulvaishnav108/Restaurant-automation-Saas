import React, { useState, useMemo } from 'react';
import { Search, Bell, User, Home, ShoppingBag, QrCode, ClipboardList, Heart, Star, Clock3, Plus, Minus, X, ChevronLeft, SlidersHorizontal, Truck, Leaf, Wifi, Percent } from 'lucide-react';

interface Props {
  onBack?: () => void;
}

const CATS = [
  { label:'All', icon:'🍽️' }, { label:'Biryani', icon:'🍛' }, { label:'Pizza', icon:'🍕' },
  { label:'Burgers', icon:'🍔' }, { label:'Desserts', icon:'🧁' }, { label:'Drinks', icon:'🥤' },
];

const MENU = [
  { id:1, name:'Hyderabadi Biryani', desc:'Aromatic basmati rice cooked with spices', price:249, rating:4.6, reviews:230, cat:'Biryani', veg:false, img:'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80', badge:'Bestseller' },
  { id:2, name:'Butter Chicken', desc:'Creamy tomato gravy with tender chicken', price:229, rating:4.5, reviews:186, cat:'Biryani', veg:false, img:'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', badge:'' },
  { id:3, name:'Veg Pizza', desc:'Loaded with veggies & extra cheese', price:199, rating:4.4, reviews:182, cat:'Pizza', veg:true, img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', badge:'' },
  { id:4, name:'Smash Burger', desc:'Double patty with cheese & crispy fries', price:259, rating:4.8, reviews:95, cat:'Burgers', veg:false, img:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', badge:'Hot 🔥' },
  { id:5, name:'Gulab Jamun', desc:'Soft milk-solid dumplings in sugar syrup', price:99, rating:4.7, reviews:148, cat:'Desserts', veg:true, img:'https://images.unsplash.com/photo-1542828183-4e0a0d95f83d?w=400&q=80', badge:'' },
  { id:6, name:'Mango Lassi', desc:'Chilled yogurt drink with fresh mango', price:89, rating:4.5, reviews:112, cat:'Drinks', veg:true, img:'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80', badge:'' },
  { id:7, name:'Paneer Tikka', desc:'Grilled cottage cheese with mint chutney', price:189, rating:4.6, reviews:204, cat:'Biryani', veg:true, img:'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80', badge:'Chef Special' },
  { id:8, name:'Cold Coffee', desc:'Blended iced coffee with cream', price:129, rating:4.3, reviews:89, cat:'Drinks', veg:true, img:'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80', badge:'' },
];

type CartItem = { id: number; qty: number };
type Tab = 'home' | 'menu' | 'orders' | 'profile';

const CustomerDashboard: React.FC<Props> = ({ onBack = () => undefined }) => {
  const [tab, setTab] = useState<Tab>('home');
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [favs, setFavs] = useState<number[]>([]);
  const [orders] = useState([
    { id:'#ORD-2841', items:'Hyderabadi Biryani x1, Mango Lassi x1', total:338, status:'Preparing', eta:'12 min' },
    { id:'#ORD-2840', items:'Smash Burger x2', total:518, status:'Served', eta:'-' },
  ]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2200); };

  const addToCart = (id: number, name: string) => {
    setCart(p => { const ex = p.find(c => c.id===id); return ex ? p.map(c => c.id===id ? {...c,qty:c.qty+1} : c) : [...p,{id,qty:1}]; });
    showToast(`${name} added to cart 🛒`);
  };

  const removeFromCart = (id: number) => setCart(p => p.map(c => c.id===id ? {...c,qty:Math.max(0,c.qty-1)} : c).filter(c => c.qty>0));
  const toggleFav = (id: number) => { setFavs(p => p.includes(id)?p.filter(f=>f!==id):[...p,id]); showToast(favs.includes(id)?'Removed from favourites':'Saved ❤️'); };

  const cartQty = (id: number) => cart.find(c=>c.id===id)?.qty ?? 0;
  const totalItems = cart.reduce((a,c)=>a+c.qty,0);
  const totalPrice = cart.reduce((a,c)=>{ const item=MENU.find(m=>m.id===c.id); return a+(item?.price??0)*c.qty; },0);

  const filtered = useMemo(() => MENU.filter(m => {
    const matchCat = cat==='All' || m.cat===cat;
    const matchSearch = !search.trim() || m.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }), [cat, search]);

  const MenuCard = ({ item }: { item: typeof MENU[0] }) => (
    <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 hover:border-orange-500/30 transition">
      <div className="relative h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden">
        <img src={item.img} alt={item.name} className="h-full w-full object-cover" />
        {item.badge && <span className="absolute top-1 left-1 rounded-md bg-orange-500 px-1.5 py-0.5 text-[9px] font-bold">{item.badge}</span>}
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm text-white leading-tight">{item.name}</h3>
          <button onClick={() => toggleFav(item.id)} className="flex-shrink-0">
            <Heart className={`h-4 w-4 ${favs.includes(item.id)?'fill-red-500 text-red-500':'text-slate-400'}`} />
          </button>
        </div>
        <p className="text-xs text-slate-400 line-clamp-1">{item.desc}</p>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{item.rating}
          <span className="text-slate-600">·</span>{item.reviews} reviews
          {item.veg && <span className="rounded border border-green-500 px-1 text-green-400 text-[9px]">VEG</span>}
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="font-bold text-white">₹{item.price}</span>
          {cartQty(item.id) === 0 ? (
            <button onClick={() => addToCart(item.id, item.name)} className="rounded-xl bg-orange-500 px-4 py-1.5 text-xs font-bold hover:bg-orange-600 transition">ADD</button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-orange-500 px-2 py-1">
              <button onClick={() => removeFromCart(item.id)}><Minus className="h-3 w-3" /></button>
              <span className="text-xs font-bold w-4 text-center">{cartQty(item.id)}</span>
              <button onClick={() => addToCart(item.id, item.name)}><Plus className="h-3 w-3" /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0d17] text-white max-w-md mx-auto relative">
      {/* Toast */}
      {toast && <div className="fixed top-4 left-1/2 z-[100] -translate-x-1/2 w-[90%] max-w-xs rounded-2xl border border-white/10 bg-slate-800/95 px-4 py-3 text-sm text-center shadow-2xl backdrop-blur-xl">{toast}</div>}

      {/* Cart Drawer */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
          role="button"
          tabIndex={0}
          aria-label="Close cart drawer"
          onClick={event => {
            if (event.target === event.currentTarget) {
              setCartOpen(false);
            }
          }}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setCartOpen(false);
            }
          }}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md rounded-t-3xl bg-[#0e1221] border-t border-white/10 p-5 pb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Your Cart ({totalItems})</h3>
              <button onClick={() => setCartOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            {cart.length === 0 ? (
              <p className="text-center text-slate-400 py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map(c => { const item = MENU.find(m=>m.id===c.id)!; return (
                    <div key={c.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 p-3">
                      <span className="text-sm font-medium flex-1">{item.name}</span>
                      <div className="flex items-center gap-2 rounded-xl bg-orange-500 px-2 py-1">
                        <button onClick={() => removeFromCart(c.id)}><Minus className="h-3 w-3" /></button>
                        <span className="text-xs font-bold w-4 text-center">{c.qty}</span>
                        <button onClick={() => addToCart(c.id, item.name)}><Plus className="h-3 w-3" /></button>
                      </div>
                      <span className="text-sm font-bold w-16 text-right">₹{item.price*c.qty}</span>
                    </div>
                  ); })}
                </div>
                <div className="mt-4 border-t border-white/10 pt-4 flex items-center justify-between">
                  <div><p className="text-xs text-slate-400">Total</p><p className="text-xl font-bold">₹{totalPrice}</p></div>
                  <button onClick={() => { setCartOpen(false); showToast('Order placed successfully! 🎉'); setCart([]); }} className="rounded-2xl bg-orange-500 px-6 py-3 font-bold hover:bg-orange-600 transition">Place Order</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0d17]/95 backdrop-blur-xl px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1.5 rounded-full hover:bg-white/10 transition"><ChevronLeft className="h-5 w-5" /></button>
            <div>
              <div className="flex items-center gap-1 text-sm font-semibold"><span className="text-orange-500">🍽️</span> Smart Dining</div>
              <p className="text-xs text-slate-400">Table T07 ▾</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => showToast('No new notifications')} className="p-2 rounded-full hover:bg-white/10 transition"><Bell className="h-5 w-5 text-slate-300" /></button>
            <button onClick={() => setTab('profile')} className="p-2 rounded-full hover:bg-white/10 transition"><User className="h-5 w-5 text-slate-300" /></button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pb-24 min-h-[calc(100vh-130px)]">
        {/* HOME TAB */}
        {tab === 'home' && (
          <div>
            {/* Greeting */}
            <div className="px-4 pt-5 pb-4">
              <h1 className="text-2xl font-bold">Good Evening! 👋</h1>
              <p className="text-slate-400 text-sm mt-1">What would you like to order today?</p>
            </div>

            {/* Search */}
            <div className="px-4 mb-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search dishes, cuisines..." className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 outline-none focus:border-orange-500 transition" />
                </div>
                <button onClick={() => showToast('Filters coming soon!')} className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"><SlidersHorizontal className="h-4 w-4" /></button>
              </div>
            </div>

            {/* Hero Banner */}
            <div className="mx-4 mb-5 rounded-3xl overflow-hidden relative" style={{ background:'linear-gradient(135deg,#1a0a02,#2d1200)' }}>
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage:'url(https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80)', backgroundSize:'cover', backgroundPosition:'center' }} />
              <div className="relative p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-300 font-semibold mb-1">Delicious food</p>
                  <p className="text-lg font-bold leading-tight">Delivered to<br />your table</p>
                  <p className="text-xs text-slate-400 mt-1">Fresh, hot & made for you.</p>
                  <button onClick={() => setTab('menu')} className="mt-3 flex items-center gap-1 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold hover:bg-orange-600 transition">Order Now →</button>
                </div>
                <div className="flex flex-col items-center justify-center h-16 w-16 rounded-full bg-orange-500 text-center flex-shrink-0">
                  <span className="text-xs font-black leading-tight">20%<br />OFF</span>
                </div>
              </div>
              {/* Dots */}
              <div className="flex justify-center gap-1 pb-3">
                {[0,1,2].map(i => <div key={i} className={`h-1.5 rounded-full transition-all ${i===0?'w-4 bg-orange-500':'w-1.5 bg-white/30'}`} />)}
              </div>
            </div>

            {/* Category Tabs */}
            <div className="px-4 mb-5 overflow-x-auto flex gap-2 pb-1 scrollbar-none">
              {CATS.map(c => (
                <button key={c.label} onClick={() => { setCat(c.label); setTab('menu'); }} className={`flex-shrink-0 flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${cat===c.label?'bg-orange-500 text-white':'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'}`}>
                  <span>{c.icon}</span>{c.label}
                </button>
              ))}
            </div>

            {/* Recommended */}
            <div className="px-4 mb-4 flex items-center justify-between">
              <h2 className="font-bold text-lg">Recommended for you</h2>
              <button onClick={() => setTab('menu')} className="text-orange-400 text-sm hover:underline">View all →</button>
            </div>
            <div className="px-4 space-y-3">
              {MENU.slice(0,4).map(item => <MenuCard key={item.id} item={item} />)}
            </div>

            {/* Stats Bar */}
            <div className="mx-4 mt-5 rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="grid grid-cols-4 gap-2 text-center">
                {([['Fast Delivery', Truck],['Fresh Food', Leaf],['Live Tracking', Wifi],['Best Offers', Percent]] as [string, React.ElementType][]).map(([label, IconComp]) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <div className="h-8 w-8 rounded-xl bg-orange-500/10 flex items-center justify-center">
                      <IconComp className="h-4 w-4 text-orange-400" />
                    </div>
                    <p className="text-[9px] text-slate-400 leading-tight">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MENU TAB */}
        {tab === 'menu' && (
          <div>
            <div className="px-4 pt-5 pb-3">
              <h2 className="text-xl font-bold mb-3">Menu</h2>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search dishes..." className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 outline-none focus:border-orange-500 transition" />
              </div>
              <div className="overflow-x-auto flex gap-2 pb-1 scrollbar-none">
                {CATS.map(c => (
                  <button key={c.label} onClick={() => setCat(c.label)} className={`flex-shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition ${cat===c.label?'bg-orange-500 text-white':'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'}`}>{c.icon} {c.label}</button>
                ))}
              </div>
            </div>
            <div className="px-4 space-y-3">
              {filtered.length===0 ? <p className="text-center py-10 text-slate-400">No dishes found</p> : filtered.map(item => <MenuCard key={item.id} item={item} />)}
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <div className="px-4 pt-5">
            <h2 className="text-xl font-bold mb-4">My Orders</h2>
            <div className="space-y-3">
              {orders.map(o => (
                <div key={o.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{o.id}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${o.status==='Preparing'?'bg-amber-500/20 text-amber-400':'bg-green-500/20 text-green-400'}`}>{o.status}</span>
                  </div>
                  <p className="text-xs text-slate-400">{o.items}</p>
                  <div className="flex items-center justify-between border-t border-white/10 pt-3">
                    <span className="font-bold text-white">₹{o.total}</span>
                    {o.status==='Preparing' && <span className="flex items-center gap-1 text-xs text-orange-400"><Clock3 className="h-3 w-3" />ETA: {o.eta}</span>}
                    <button onClick={() => showToast(`Reordering ${o.id}...`)} className="rounded-xl bg-orange-500/10 border border-orange-500/30 px-3 py-1.5 text-xs font-semibold text-orange-400 hover:bg-orange-500 hover:text-white transition">Reorder</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {tab === 'profile' && (
          <div className="px-4 pt-5">
            <h2 className="text-xl font-bold mb-5">Profile</h2>
            <div className="flex flex-col items-center mb-6">
              <div className="h-20 w-20 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center text-3xl mb-3">👤</div>
              <h3 className="font-bold text-lg">Guest User</h3>
              <p className="text-sm text-slate-400">Table T07 · Smart Dining</p>
            </div>
            <div className="space-y-3">
              {[['🛒','My Orders','View order history'],['❤️','Favourites','Saved dishes'],['🎁','Loyalty Points','124 pts'],['🔔','Notifications','Manage alerts'],['❓','Help & Support','Contact us']].map(([icon,label,sub]) => (
                <button key={label} onClick={() => label==='My Orders'?setTab('orders'):showToast(`${label} coming soon!`)} className="w-full flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 hover:border-orange-500/30 transition text-left">
                  <span className="text-2xl">{icon}</span>
                  <div className="flex-1"><p className="font-semibold text-sm">{label}</p><p className="text-xs text-slate-400">{sub}</p></div>
                  <span className="text-slate-500 text-sm">→</span>
                </button>
              ))}
            </div>
            <button onClick={onBack} className="mt-5 w-full rounded-2xl border border-red-500/30 bg-red-500/10 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition">← Back to Restaurant List</button>
          </div>
        )}
      </main>

      {/* Cart FAB - sits above the bottom nav */}
      {totalItems > 0 && (
        <button onClick={() => setCartOpen(true)} className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 shadow-lg shadow-orange-500/40 hover:bg-orange-600 transition">
          <ShoppingBag className="h-4 w-4" />
          <span className="font-bold text-sm">{totalItems} items · ₹{totalPrice}</span>
        </button>
      )}

      {/* Bottom Nav — full viewport width so clicks register correctly */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0a0d17]/95 backdrop-blur-xl px-4 py-2">
        <div className="flex items-end justify-around">

          <button onClick={() => setTab('home')} className="flex flex-col items-center gap-1 hover:text-orange-400 transition">
            <Home className={`h-5 w-5 ${tab==='home' ? 'text-orange-500' : 'text-slate-400'}`} />
            <span className={`text-[10px] font-semibold ${tab==='home' ? 'text-orange-500' : 'text-slate-500'}`}>Home</span>
          </button>

          <button onClick={() => setTab('menu')} className="flex flex-col items-center gap-1 hover:text-orange-400 transition">
            <ClipboardList className={`h-5 w-5 ${tab==='menu' ? 'text-orange-500' : 'text-slate-400'}`} />
            <span className={`text-[10px] font-semibold ${tab==='menu' ? 'text-orange-500' : 'text-slate-500'}`}>Menu</span>
          </button>

          <button onClick={() => showToast('Point your camera at the table QR code!')} className="flex flex-col items-center gap-1">
            <div className="flex h-14 w-14 -mt-6 items-center justify-center rounded-full bg-orange-500 shadow-lg shadow-orange-500/40 hover:bg-orange-600 transition">
              <QrCode className="h-6 w-6 text-white" />
            </div>
            <span className="text-[10px] font-semibold text-orange-400">Scan QR</span>
          </button>

          <button onClick={() => setTab('orders')} className="flex flex-col items-center gap-1 hover:text-orange-400 transition">
            <ShoppingBag className={`h-5 w-5 ${tab==='orders' ? 'text-orange-500' : 'text-slate-400'}`} />
            <span className={`text-[10px] font-semibold ${tab==='orders' ? 'text-orange-500' : 'text-slate-500'}`}>Orders</span>
          </button>

          <button onClick={() => setTab('profile')} className="flex flex-col items-center gap-1 hover:text-orange-400 transition">
            <User className={`h-5 w-5 ${tab==='profile' ? 'text-orange-500' : 'text-slate-400'}`} />
            <span className={`text-[10px] font-semibold ${tab==='profile' ? 'text-orange-500' : 'text-slate-500'}`}>Profile</span>
          </button>

        </div>
      </nav>
    </div>
  );
};

export default CustomerDashboard;
