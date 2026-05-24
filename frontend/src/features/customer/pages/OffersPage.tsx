import React, { useState } from 'react';
import { Gift, Moon, ShoppingBag, Star, Sun, TicketPercent } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const OFFERS = [
  { title: 'FLAT 20% OFF', sub: 'On first order above ₹500', code: 'FIRST20', image: 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=800&q=80' },
  { title: 'WEEKEND 10% OFF', sub: 'Save on every restaurant this weekend', code: 'WKND10', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80' },
  { title: 'BUY 1 GET 1', sub: 'Selected pizzas, drinks, and desserts', code: 'B1G1', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80' },
];

const CustomerNav = ({ isLightMode, onToggleMode }: { isLightMode: boolean; onToggleMode: () => void }) => (
  <nav className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors ${isLightMode ? 'border-slate-200 bg-white/90 text-slate-950' : 'border-white/10 bg-[#080b14]/90 text-white'}`}>
    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-16">
      <NavLink to="/" className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500"><ShoppingBag className="h-4 w-4" /></span>
        <span className="text-xl font-bold">Serve<span className="text-orange-500">Sphere</span></span>
      </NavLink>
      <div className="flex items-center gap-4 text-sm sm:gap-8">
        {[
          ['Home', '/'],
          ['Restaurants', '/restaurants'],
          ['Offers', '/offers'],
          ['Reservations', '/reservations'],
        ].map(([label, path]) => (
          <NavLink key={path} to={path} className={({ isActive }) => `hidden font-medium transition sm:inline ${isActive ? 'text-orange-400' : isLightMode ? 'text-slate-700 hover:text-orange-500' : 'text-slate-300 hover:text-orange-400'}`}>{label}</NavLink>
        ))}
        <button
          onClick={onToggleMode}
          aria-label={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
          className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${isLightMode ? 'border-orange-200 bg-orange-50 text-orange-500' : 'border-white/10 bg-white/5 text-white hover:bg-white/10'}`}
        >
          {isLightMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </div>
  </nav>
);

const OffersPage = () => {
  const [copiedCode, setCopiedCode] = useState('');
  const [isLightMode, setIsLightMode] = useState(false);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 1800);
  };

  return (
    <div className={`min-h-screen transition-colors ${isLightMode ? 'bg-slate-50 text-slate-950' : 'bg-[#080b14] text-white'}`}>
      <CustomerNav isLightMode={isLightMode} onToggleMode={() => setIsLightMode((value) => !value)} />
      <header className="mx-auto max-w-7xl px-6 py-14 lg:px-16">
        <div className="flex items-center gap-3 text-orange-300">
          <TicketPercent className="h-5 w-5" />
          <p className="text-sm font-semibold uppercase tracking-widest">Offers</p>
        </div>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold sm:text-5xl">Deals made for better meals and easier ordering.</h1>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-6 pb-16 lg:grid-cols-3 lg:px-16">
        {OFFERS.map((offer) => (
          <article key={offer.code} className={`overflow-hidden rounded-3xl border ${isLightMode ? 'border-slate-200 bg-white shadow-sm' : 'border-white/10 bg-slate-900/70'}`}>
            <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.45)),url(${offer.image})` }} />
            <div className="space-y-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-300">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black">{offer.title}</h2>
                <p className={`mt-2 text-sm ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>{offer.sub}</p>
              </div>
              <button onClick={() => copyCode(offer.code)} className="w-full rounded-2xl border border-orange-500/30 bg-orange-500/10 py-3 text-sm font-bold text-orange-300 transition hover:bg-orange-500 hover:text-white">
                {copiedCode === offer.code ? 'Copied!' : `Use Code: ${offer.code}`}
              </button>
            </div>
          </article>
        ))}
      </main>

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-16">
        <div className={`rounded-3xl border p-6 ${isLightMode ? 'border-slate-200 bg-white shadow-sm' : 'border-white/10 bg-white/5'}`}>
          <div className="flex flex-wrap items-center gap-4">
            <Star className="h-8 w-8 fill-amber-400 text-amber-400" />
            <div>
              <h2 className="text-xl font-bold">More rewards are coming soon</h2>
              <p className={`text-sm ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>Loyalty points, restaurant coupons, and table-only dining perks will live here.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OffersPage;
