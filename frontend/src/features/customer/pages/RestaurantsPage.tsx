import React, { useMemo, useState } from 'react';
import { Bell, ChevronDown, Clock3, Heart, MapPin, Moon, Search, ShoppingBag, Star, Sun } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface Props {
  onEnterApp: () => void;
}

const CATEGORIES = ['All', 'Pizza', 'Burger', 'Biryani', 'Desserts', 'Drinks', 'Chinese'];
const LOCATIONS = ['Mulund, Mumbai', 'Thane, Mumbai', 'Bandra, Mumbai', 'Andheri, Mumbai', 'Powai, Mumbai', 'Dadar, Mumbai'];

const RESTAURANTS = [
  { id: 1, name: 'The Grill House', desc: 'Cheesy burgers & loaded fries', eta: '15-20 min', rating: 4.8, reviews: 230, price: 250, cat: 'Burger', badge: 'Best Seller', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80' },
  { id: 2, name: 'Pizza Corner', desc: 'Italian stone-baked pizza', eta: '20-25 min', rating: 4.7, reviews: 186, price: 399, cat: 'Pizza', badge: 'Popular', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80' },
  { id: 3, name: 'Spice Route', desc: 'Slow-cooked aromatic biryani', eta: '25-30 min', rating: 4.9, reviews: 342, price: 299, cat: 'Biryani', badge: 'Top Rated', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80' },
  { id: 4, name: 'Sweet Treats', desc: 'Artisan desserts & shakes', eta: '10-15 min', rating: 4.6, reviews: 118, price: 199, cat: 'Desserts', badge: 'New', img: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80' },
  { id: 5, name: 'Dragon Palace', desc: 'Authentic Chinese dim sum', eta: '20-30 min', rating: 4.5, reviews: 95, price: 350, cat: 'Chinese', badge: '', img: 'https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=600&q=80' },
  { id: 6, name: 'Bubble Tea Bar', desc: 'Fresh fruit teas & smoothies', eta: '5-10 min', rating: 4.4, reviews: 74, price: 180, cat: 'Drinks', badge: '', img: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&q=80' },
];

const CustomerTopNav = ({ isLightMode, onToggleMode }: { isLightMode: boolean; onToggleMode: () => void }) => {
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [locationOpen, setLocationOpen] = useState(false);

  return (
    <nav className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors ${isLightMode ? 'border-slate-200 bg-white/90 text-slate-950' : 'border-white/10 bg-[#080b14]/90 text-white'}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-16">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500"><ShoppingBag className="h-4 w-4" /></span>
          <span className="text-xl font-bold"><span>Serve</span><span className="text-orange-500">Sphere</span></span>
        </NavLink>
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setLocationOpen((open) => !open)}
            aria-expanded={locationOpen}
            className={`flex min-w-[236px] items-center justify-between gap-2 rounded-full border px-4 py-2 text-sm transition ${isLightMode ? 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-white' : 'border-white/10 bg-white/5 text-white hover:bg-white/10'}`}
          >
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-500" />
              {selectedLocation}
            </span>
            <ChevronDown className={`h-3 w-3 text-slate-400 transition ${locationOpen ? 'rotate-180' : ''}`} />
          </button>
          {locationOpen && (
            <div className={`absolute left-0 top-12 w-full overflow-hidden rounded-2xl border py-2 shadow-xl backdrop-blur-xl ${isLightMode ? 'border-slate-200 bg-white text-slate-900 shadow-slate-300/30' : 'border-white/10 bg-[#101522]/95 text-white shadow-black/30'}`}>
              {LOCATIONS.map((location) => (
                <button
                  key={location}
                  type="button"
                  onClick={() => {
                    setSelectedLocation(location);
                    setLocationOpen(false);
                  }}
                  className={`block w-full px-4 py-2.5 text-left text-sm transition ${selectedLocation === location ? 'bg-orange-500 text-white' : isLightMode ? 'hover:bg-orange-50 hover:text-orange-600' : 'hover:bg-white/10 hover:text-orange-300'}`}
                >
                  {location}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="hidden items-center gap-8 lg:flex">
          {[
            ['Home', '/'],
            ['Restaurants', '/restaurants'],
            ['Offers', '/offers'],
            ['Reservations', '/reservations'],
          ].map(([label, path]) => (
            <NavLink key={path} to={path} className={({ isActive }) => `text-sm font-medium transition ${isActive ? 'text-orange-400' : isLightMode ? 'text-slate-700 hover:text-orange-500' : 'text-slate-300 hover:text-orange-400'}`}>{label}</NavLink>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMode}
            aria-label={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${isLightMode ? 'border-orange-200 bg-orange-50 text-orange-500' : 'border-white/10 bg-white/5 text-white hover:bg-white/10'}`}
          >
            {isLightMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button className={`hidden h-9 w-9 items-center justify-center rounded-full border sm:flex ${isLightMode ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-white/10 bg-white/5 text-white'}`}><Bell className="h-4 w-4" /></button>
          <NavLink to="/login" className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600">Login / Sign Up</NavLink>
        </div>
      </div>
    </nav>
  );
};

const RestaurantsPage: React.FC<Props> = ({ onEnterApp }) => {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [favs, setFavs] = useState<number[]>([]);
  const [isLightMode, setIsLightMode] = useState(false);

  const filtered = useMemo(() => RESTAURANTS.filter((restaurant) => {
    const matchCat = activeCat === 'All' || restaurant.cat === activeCat;
    const matchQuery = !query.trim() || `${restaurant.name} ${restaurant.desc} ${restaurant.cat}`.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  }), [activeCat, query]);

  return (
    <div
      className={`relative isolate min-h-screen bg-cover bg-center bg-fixed bg-no-repeat transition-colors ${isLightMode ? 'text-slate-950' : 'text-white'}`}
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80)' }}
    >
      <div className={`fixed inset-0 z-0 pointer-events-none transition-colors ${isLightMode ? 'bg-white/55' : 'bg-[#050814]/70'}`} />
      <div className="relative z-10">
        <CustomerTopNav isLightMode={isLightMode} onToggleMode={() => setIsLightMode((value) => !value)} />
        <section className={`border-b ${isLightMode ? 'border-white/50' : 'border-white/10'}`}>
          <div className="mx-auto flex min-h-[430px] max-w-7xl flex-col justify-center px-6 py-16 text-center lg:px-16">
            <p className={`text-sm font-semibold uppercase tracking-widest ${isLightMode ? 'text-orange-600' : 'text-orange-300'}`}>Restaurants</p>
            <h1
              className={`mx-auto mt-3 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl ${isLightMode ? 'text-slate-950' : 'text-white'}`}
              style={isLightMode ? undefined : { textShadow: '0 2px 12px rgba(0,0,0,0.45)' }}
            >
              Choose your next table or start ordering now.
            </h1>
            <div className="mx-auto mt-8 w-full max-w-2xl">
              <div className="relative">
                <Search className={`absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 ${isLightMode ? 'text-slate-500' : 'text-slate-300'}`} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search restaurants, cuisines, dishes..." className={`w-full rounded-full border py-4 pl-14 pr-5 outline-none backdrop-blur focus:border-orange-500 ${isLightMode ? 'border-slate-200 bg-white/95 text-slate-950 placeholder-slate-500 shadow-lg shadow-slate-300/30' : 'border-white/25 bg-black/35 text-white placeholder-slate-300'}`} />
              </div>
            </div>
          </div>
        </section>

        <main className="mx-auto max-w-7xl px-6 py-10 lg:px-16">
          <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
            {CATEGORIES.map((category) => (
              <button key={category} onClick={() => setActiveCat(category)} className={`flex-shrink-0 rounded-full border px-5 py-2 text-sm font-semibold transition ${activeCat === category ? 'border-orange-500 bg-orange-500 text-white' : isLightMode ? 'border-slate-200 bg-white/90 text-slate-700 hover:border-orange-300 hover:text-orange-500' : 'border-white/10 bg-white/10 text-slate-200 hover:border-orange-500/50 hover:text-orange-300'}`}>
                {category}
              </button>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((restaurant) => (
              <article key={restaurant.id} className={`overflow-hidden rounded-3xl border backdrop-blur-sm transition hover:-translate-y-1 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10 ${isLightMode ? 'border-slate-200 bg-white/95 shadow-sm' : 'border-white/10 bg-slate-900/75'}`}>
                <div className="relative h-56 bg-cover bg-center" style={{ backgroundImage: `url(${restaurant.img})` }}>
                  {restaurant.badge && <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold">{restaurant.badge}</span>}
                  <button onClick={() => setFavs((prev) => prev.includes(restaurant.id) ? prev.filter((id) => id !== restaurant.id) : [...prev, restaurant.id])} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur">
                    <Heart className={`h-4 w-4 ${favs.includes(restaurant.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </button>
                </div>
                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wider text-slate-400">
                    <span>{restaurant.cat}</span>
                    <span className="flex items-center gap-1"><Clock3 className="h-3 w-3" />{restaurant.eta}</span>
                  </div>
                  <h2 className="text-xl font-bold">{restaurant.name}</h2>
                  <p className={`text-sm ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>{restaurant.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-sm"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{restaurant.rating} <span className="text-slate-500">({restaurant.reviews})</span></span>
                    <span className="font-bold">From ₹{restaurant.price}</span>
                  </div>
                  <button onClick={onEnterApp} className="w-full rounded-2xl border border-orange-500/30 bg-orange-500/10 py-3 text-sm font-bold text-orange-300 transition hover:bg-orange-500 hover:text-white">Order Now</button>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RestaurantsPage;
