import React, { useState, useMemo, useRef } from 'react';
import { Search, MapPin, Bell, Star, ChevronDown, Heart, Clock3, X, ShoppingBag, Flame, Zap, Menu as MenuIcon } from 'lucide-react';

interface Props { onEnterApp: () => void; }

const CATEGORIES = ['All','Pizza','Burger','Biryani','Desserts','Drinks','Chinese'];

const RESTAURANTS = [
  { id:1, name:'The Grill House', desc:'Cheesy burgers & loaded fries', eta:'15-20 min', rating:4.8, reviews:230, price:250, cat:'Burger', badge:'Best Seller', img:'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80' },
  { id:2, name:'Pizza Corner', desc:'Italian stone-baked pizza', eta:'20-25 min', rating:4.7, reviews:186, price:399, cat:'Pizza', badge:'Popular', img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80' },
  { id:3, name:'Spice Route', desc:'Slow-cooked aromatic biryani', eta:'25-30 min', rating:4.9, reviews:342, price:299, cat:'Biryani', badge:'Top Rated', img:'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&q=80' },
  { id:4, name:'Sweet Treats', desc:'Artisan desserts & shakes', eta:'10-15 min', rating:4.6, reviews:118, price:199, cat:'Desserts', badge:'New', img:'https://images.unsplash.com/photo-1542828183-4e0a0d95f83d?w=600&q=80' },
  { id:5, name:'Dragon Palace', desc:'Authentic Chinese dim sum', eta:'20-30 min', rating:4.5, reviews:95, price:350, cat:'Chinese', badge:'', img:'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80' },
  { id:6, name:'Bubble Tea Bar', desc:'Fresh fruit teas & smoothies', eta:'5-10 min', rating:4.4, reviews:74, price:180, cat:'Drinks', badge:'', img:'https://images.unsplash.com/photo-1558857563-b371033873b8?w=600&q=80' },
];

const TRENDING = [
  { title:'Hyderabadi Biryani', restaurant:'Spice Route', price:299, rating:4.9, img:'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80' },
  { title:'Butter Chicken', restaurant:'Spice Route', price:329, rating:4.8, img:'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80' },
  { title:'Veg Pizza', restaurant:'Pizza Corner', price:379, rating:4.7, img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80' },
  { title:'Smash Burger', restaurant:'Grill House', price:259, rating:4.8, img:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' },
];

const OFFERS = [
  { title:'FLAT 20% OFF', sub:'On first order above ₹500', code:'FIRST20', gradient:'from-orange-600 to-red-700' },
  { title:'FLAT 10% OFF', sub:'All orders this weekend', code:'WKND10', gradient:'from-amber-500 to-orange-600' },
  { title:'BUY 1 GET 1', sub:'Selected items today only', code:'B1G1', gradient:'from-rose-600 to-pink-700' },
];

const TESTIMONIALS = [
  { name:'Aarav M.', role:'Food Enthusiast', rating:5, msg:'QR ordering is seamless. Scanned, ordered, food arrived in minutes!' },
  { name:'Nisha K.', role:'Regular Diner', rating:5, msg:'Love the clean interface and live order tracking feature.' },
  { name:'Rahul S.', role:'Office Lead', rating:4, msg:'Perfect for team lunches. Everyone orders from their phone.' },
];

const LandingPage: React.FC<Props> = ({ onEnterApp }) => {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [favs, setFavs] = useState<number[]>([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');
  const restaurantsRef = useRef<HTMLElement>(null);
  const offersRef = useRef<HTMLElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const toggleFav = (id: number) => {
    setFavs(p => p.includes(id) ? p.filter(f => f !== id) : [...p, id]);
    showToast(favs.includes(id) ? 'Removed from favourites' : 'Added to favourites ❤️');
  };

  const copyCode = (code: string) => {
    setCopiedCode(code);
    showToast(`Code "${code}" copied! 🎉`);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const scrollTo = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setMobileNav(false);
  };

  const filtered = useMemo(() =>
    RESTAURANTS.filter(r => {
      const matchCat = activeCat === 'All' || r.cat === activeCat;
      const matchQ = !query.trim() || r.name.toLowerCase().includes(query.toLowerCase()) || r.desc.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQ;
    }), [activeCat, query]);

  return (
    <div className="min-h-screen bg-[#050814] text-white">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 z-[100] -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-800/95 px-6 py-3 text-sm shadow-2xl backdrop-blur-xl">
          {toast}
        </div>
      )}

      {/* Login Modal */}
      {loginOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0a0d17] p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Welcome back 👋</h2>
              <button onClick={() => setLoginOpen(false)} className="p-2 rounded-full hover:bg-white/10 transition"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Email or mobile number" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-orange-500 transition" />
              <input type="password" placeholder="Password" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-orange-500 transition" />
              <button onClick={() => { setLoginOpen(false); onEnterApp(); }} className="w-full rounded-2xl bg-orange-500 py-3 font-semibold hover:bg-orange-600 transition">Login</button>
              <button onClick={() => { setLoginOpen(false); onEnterApp(); }} className="w-full rounded-2xl border border-white/10 py-3 text-sm text-slate-300 hover:bg-white/5 transition">Send OTP instead</button>
              <p className="text-center text-sm text-slate-400">
                No account? <button onClick={() => { setLoginOpen(false); onEnterApp(); }} className="text-orange-400 hover:underline">Sign up free</button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#050814]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 lg:px-16">
          <div className="flex items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-orange-500 flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold"><span className="text-white">Serve</span><span className="text-orange-500">Sphere</span></span>
            </div>

            <button onClick={() => showToast('Location selector — coming soon!')} className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition">
              <MapPin className="h-4 w-4 text-orange-500" />
              <span className="text-sm">Mulund, Mumbai</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            <div className="hidden lg:flex items-center gap-8">
              {[['Home', null], ['Restaurants', restaurantsRef], ['Offers', offersRef]].map(([label, ref]) => (
                <button key={label as string} onClick={() => ref ? scrollTo(ref as React.RefObject<HTMLElement>) : showToast('Home')} className="text-sm text-gray-300 hover:text-orange-400 transition font-medium">{label as string}</button>
              ))}
              <button onClick={() => showToast('Reservations coming soon!')} className="text-sm text-gray-300 hover:text-orange-400 transition font-medium">Reservations</button>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => showToast('No new notifications')} className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition">
                <Bell className="h-4 w-4" />
              </button>
              <button onClick={() => setLoginOpen(true)} className="px-5 py-2 rounded-full bg-orange-500 text-sm font-semibold hover:bg-orange-600 transition">Login / Sign Up</button>
              <button onClick={() => setMobileNav(!mobileNav)} className="lg:hidden p-2 rounded-full hover:bg-white/10 transition">
                <MenuIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          {mobileNav && (
            <div className="lg:hidden border-t border-white/10 py-3 space-y-1">
              {['Restaurants','Offers','Reservations'].map(l => (
                <button key={l} onClick={() => l==='Restaurants' ? scrollTo(restaurantsRef) : l==='Offers' ? scrollTo(offersRef) : showToast('Coming soon!')} className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-orange-400 hover:bg-white/5 rounded-xl transition">{l}</button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0" style={{ backgroundImage:'linear-gradient(rgba(5,8,20,0.75),rgba(5,8,20,0.9)),url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80)', backgroundSize:'cover', backgroundPosition:'center' }} />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-16 flex flex-col items-center text-center">
        
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            Find the best<br />restaurants <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">near you</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-300">Explore top restaurants, scan your table QR, order instantly, and pay without waiting.</p>

          <div className="mt-10 w-full max-w-2xl flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key==='Enter' && scrollTo(restaurantsRef)} placeholder="Search restaurants, cuisines, dishes..." className="w-full pl-14 pr-4 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-slate-400 outline-none focus:border-orange-500 transition" />
            </div>
            <button onClick={() => { if(!query.trim()){showToast('Enter something to search');return;} scrollTo(restaurantsRef); }} className="px-8 py-4 rounded-full bg-orange-500 font-semibold hover:bg-orange-600 transition whitespace-nowrap">Search</button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-slate-300">
            {[['🍽️','500+ Dishes'],['⭐','4.5+ Avg Rating'],['⚡','Live Table Ordering'],['🎁','Daily Offers']].map(([icon,label]) => (
              <div key={label} className="flex items-center gap-2"><span className="text-xl">{icon}</span>{label}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 lg:px-16 py-12">
        <p className="text-sm uppercase tracking-widest text-orange-400 mb-2">Browse By Type</p>
        <h2 className="text-3xl font-bold mb-8">Explore by Category</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => { setActiveCat(cat); scrollTo(restaurantsRef); }} className={`flex flex-col items-center gap-2 rounded-2xl border py-4 px-2 transition hover:-translate-y-1 ${activeCat===cat ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-orange-500/40'}`}>
              <span className="text-3xl">{cat==='All'?'🍽️':cat==='Pizza'?'🍕':cat==='Burger'?'🍔':cat==='Biryani'?'🍛':cat==='Desserts'?'🧁':cat==='Drinks'?'🥤':'🥡'}</span>
              <span className="text-xs font-semibold">{cat}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Restaurants */}
      <section ref={restaurantsRef} className="mx-auto max-w-7xl px-6 lg:px-16 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-widest text-orange-400 mb-1">Featured</p>
            <h2 className="text-3xl font-bold">Top Restaurants Near You</h2>
          </div>
          <button onClick={() => setActiveCat('All')} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm hover:bg-white/10 transition">View all</button>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No restaurants found for "<span className="text-white">{query}</span>"</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(r => (
              <article key={r.id} className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-500/30">
                <div className="relative h-52 bg-cover bg-center" style={{ backgroundImage:`url(${r.img})` }}>
                  {r.badge && <span className="absolute top-3 left-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold">{r.badge}</span>}
                  <button onClick={() => toggleFav(r.id)} className="absolute top-3 right-3 h-9 w-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition">
                    <Heart className={`h-4 w-4 ${favs.includes(r.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </button>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider">
                    <span>{r.cat}</span>
                    <span className="flex items-center gap-1"><Clock3 className="h-3 w-3" />{r.eta}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{r.name}</h3>
                  <p className="text-sm text-slate-400">{r.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-sm"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /><span className="font-semibold text-white">{r.rating}</span><span className="text-slate-500">({r.reviews})</span></span>
                    <span className="font-bold text-white">₹{r.price}</span>
                  </div>
                  <button onClick={() => { showToast(`Opening ${r.name}...`); setTimeout(onEnterApp, 600); }} className="w-full rounded-2xl bg-orange-500/10 border border-orange-500/30 py-2.5 text-sm font-semibold text-orange-400 hover:bg-orange-500 hover:text-white transition">Order Now →</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-7xl px-6 lg:px-16 py-12">
        <div className="flex items-center gap-2 mb-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <p className="text-sm uppercase tracking-widest text-orange-400">Hot Right Now</p>
        </div>
        <h2 className="text-3xl font-bold mb-8">Trending Dishes</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TRENDING.map(d => (
            <div key={d.title} className="group rounded-3xl border border-white/10 bg-slate-900/60 overflow-hidden hover:-translate-y-1 transition hover:shadow-lg hover:shadow-orange-500/10">
              <div className="h-44 bg-cover bg-center" style={{ backgroundImage:`url(${d.img})` }} />
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-white">{d.title}</h3>
                <p className="text-xs text-slate-400">{d.restaurant}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{d.rating}</span>
                  <span className="font-bold text-orange-400">₹{d.price}</span>
                </div>
                <button onClick={() => { showToast(`Added ${d.title} to cart! 🛒`); }} className="w-full rounded-xl bg-orange-500 py-2 text-xs font-bold hover:bg-orange-600 transition">ADD</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Offers */}
      <section ref={offersRef} className="mx-auto max-w-7xl px-6 lg:px-16 py-12">
        <p className="text-sm uppercase tracking-widest text-orange-400 mb-2">Save More</p>
        <h2 className="text-3xl font-bold mb-8">Offers & Deals</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {OFFERS.map(o => (
            <div key={o.code} className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${o.gradient} p-6`}>
              <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
              <div className="absolute -right-2 -bottom-8 h-24 w-24 rounded-full bg-white/10" />
              <p className="text-3xl font-black">{o.title}</p>
              <p className="mt-2 text-sm text-white/80">{o.sub}</p>
              <button onClick={() => copyCode(o.code)} className={`mt-4 rounded-xl border-2 border-white/40 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur hover:bg-white/20 transition ${copiedCode===o.code ? 'bg-white/30' : ''}`}>
                {copiedCode===o.code ? '✓ Copied!' : `Use: ${o.code}`}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 lg:px-16 py-12">
        <p className="text-sm uppercase tracking-widest text-orange-400 mb-2">Happy Customers</p>
        <h2 className="text-3xl font-bold mb-8">What customers say</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:border-orange-500/20 transition">
              <div className="flex gap-1 mb-4">{Array.from({length:t.rating}).map((_,i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
              <p className="text-slate-300 leading-relaxed">"{t.msg}"</p>
              <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                <div className="h-9 w-9 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-sm">{t.name[0]}</div>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#050814] mt-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-16 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-orange-500 flex items-center justify-center"><ShoppingBag className="h-4 w-4 text-white" /></div>
            <span className="text-xl font-bold"><span className="text-white">Serve</span><span className="text-orange-500">Sphere</span></span>
          </div>
          <p className="text-sm text-slate-500">© 2026 ServeSphere. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-slate-400">
            {['Privacy','Terms','Support'].map(l => <button key={l} onClick={() => showToast(`${l} page coming soon`)} className="hover:text-orange-400 transition">{l}</button>)}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
