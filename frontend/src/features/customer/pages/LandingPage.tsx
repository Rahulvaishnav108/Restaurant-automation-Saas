import React, { useState } from 'react';
import { Search, MapPin, Bell, Star, ChevronDown, X, ShoppingBag, Menu as MenuIcon, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../../auth/components/AuthForm';

interface Props { onEnterApp: () => void; }

const CATEGORIES = ['All','Pizza','Burger','Biryani','Desserts','Drinks','Chinese'];
const LOCATIONS = ['Mulund, Mumbai', 'Thane, Mumbai', 'Bandra, Mumbai', 'Andheri, Mumbai', 'Powai, Mumbai', 'Dadar, Mumbai'];

const TESTIMONIALS = [
  { name:'Aarav M.', role:'Food Enthusiast', rating:5, msg:'QR ordering is seamless. Scanned, ordered, food arrived in minutes!' },
  { name:'Nisha K.', role:'Regular Diner', rating:5, msg:'Love the clean interface and live order tracking feature.' },
  { name:'Rahul S.', role:'Office Lead', rating:4, msg:'Perfect for team lunches. Everyone orders from their phone.' },
];

const LandingPage: React.FC<Props> = ({ onEnterApp }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [loginOpen, setLoginOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [locationOpen, setLocationOpen] = useState(false);
  const lightTextShadow = isLightMode ? { textShadow: '0 2px 10px rgba(0, 0, 0, 0.45)' } : undefined;
  const lightSubtleTextShadow = isLightMode ? { textShadow: '0 1px 6px rgba(0, 0, 0, 0.38)' } : undefined;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const goToPage = (path: string) => {
    setMobileNav(false);
    navigate(path);
  };

  return (
    <div
      className={`relative isolate min-h-screen bg-cover bg-center bg-fixed bg-no-repeat transition-colors duration-500 ${isLightMode ? 'text-white' : 'text-white'}`}
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80)' }}
    >
      <div className={`fixed inset-0 z-0 pointer-events-none transition-colors duration-500 ${isLightMode ? 'bg-black/20' : 'bg-[#050814]/55'}`} />
      <div className="relative z-10">
      {/* Toast */}
      {toast && (
          <div className={`fixed top-5 left-1/2 z-[100] -translate-x-1/2 rounded-2xl border px-6 py-3 text-sm shadow-2xl backdrop-blur-xl ${isLightMode ? 'border-slate-200 bg-white/95 text-slate-900' : 'border-white/10 bg-slate-800/95 text-white'}`}>
          {toast}
        </div>
      )}

      {/* Login Modal */}
      {loginOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-sm sm:p-5">
          <div className="relative w-full max-w-6xl">
            <button
              onClick={() => setLoginOpen(false)}
              aria-label="Close login"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition hover:bg-orange-500 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <AuthForm
              onLogin={() => { setLoginOpen(false); onEnterApp(); }}
              onOtpLogin={() => { setLoginOpen(false); onEnterApp(); }}
              onSignUp={() => { setLoginOpen(false); onEnterApp(); }}
            />
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-500 ${isLightMode ? 'border-white/40 bg-white/25 shadow-sm' : 'border-white/10 bg-transparent'}`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-16">
          <div className="flex items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-orange-500 flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold" style={lightTextShadow}><span className="text-white">Serve</span><span className="text-orange-500">Sphere</span></span>
            </div>

            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setLocationOpen((open) => !open)}
                aria-expanded={locationOpen}
                className={`flex min-w-[236px] items-center justify-between gap-2 rounded-full border px-4 py-2 transition ${isLightMode ? 'border-white/40 bg-white/20 text-white shadow-sm hover:bg-white/30' : 'border-white/10 bg-white/5 text-white hover:bg-white/10'}`}
                style={lightSubtleTextShadow}
              >
                <span className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  {selectedLocation}
                </span>
                <ChevronDown className={`h-3 w-3 transition ${isLightMode ? 'text-white' : 'text-slate-400'} ${locationOpen ? 'rotate-180' : ''}`} />
              </button>
              {locationOpen && (
                <div className={`absolute left-0 top-12 w-full overflow-hidden rounded-2xl border py-2 shadow-xl backdrop-blur-xl ${isLightMode ? 'border-white/40 bg-white/95 text-slate-900 shadow-slate-900/10' : 'border-white/10 bg-[#101522]/95 text-white shadow-black/30'}`}>
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

            <div className="hidden lg:flex items-center gap-8">
              {[
                ['Home', '/'],
                ['Restaurants', '/restaurants'],
                ['Offers', '/offers'],
                ['Reservations', '/reservations'],
              ].map(([label, path]) => (
                <button key={label} onClick={() => goToPage(path)} className={`text-sm transition font-medium ${isLightMode ? 'text-white hover:text-orange-200' : 'text-gray-300 hover:text-orange-400'}`} style={lightSubtleTextShadow}>{label}</button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIsLightMode(v => !v);
                  showToast(!isLightMode ? 'Light mode enabled' : 'Dark mode enabled');
                }}
                aria-label={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
                className={`relative hidden h-10 w-[76px] items-center rounded-full border p-1 transition sm:flex ${isLightMode ? 'border-orange-200 bg-orange-50 shadow-lg shadow-orange-100' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
              >
                <span className={`absolute inset-y-1 flex h-8 w-8 items-center justify-center rounded-full shadow-md transition-all duration-300 ${isLightMode ? 'left-[38px] bg-white text-orange-500' : 'left-1 bg-orange-500 text-white'}`}>
                  {isLightMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </span>
                <span className={`ml-2 text-[10px] font-bold transition ${isLightMode ? 'text-orange-500 opacity-0' : 'text-orange-200 opacity-100'}`}>Dark</span>
                <span className={`ml-auto mr-2 text-[10px] font-bold transition ${isLightMode ? 'text-orange-500 opacity-100' : 'text-slate-400 opacity-0'}`}>Light</span>
              </button>
              <button onClick={() => showToast('No new notifications')} className={`hidden sm:flex h-9 w-9 items-center justify-center rounded-full border transition ${isLightMode ? 'border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50' : 'border-white/10 bg-white/5 text-white hover:bg-white/10'}`}>
                <Bell className="h-4 w-4" />
              </button>
              <button onClick={() => setLoginOpen(true)} className="px-5 py-2 rounded-full bg-orange-500 text-sm font-semibold hover:bg-orange-600 transition">Login / Sign Up</button>
              <button onClick={() => setMobileNav(!mobileNav)} className={`lg:hidden p-2 rounded-full transition ${isLightMode ? 'text-white hover:bg-white/20' : 'text-white hover:bg-white/10'}`} style={lightSubtleTextShadow}>
                <MenuIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          {mobileNav && (
            <div className={`lg:hidden border-t py-3 space-y-1 ${isLightMode ? 'border-slate-200' : 'border-white/10'}`}>
              {[
                ['Home', '/'],
                ['Restaurants', '/restaurants'],
                ['Offers', '/offers'],
                ['Reservations', '/reservations'],
              ].map(([label, path]) => (
                <button key={label} onClick={() => goToPage(path)} className={`block w-full text-left px-4 py-3 text-sm rounded-xl transition ${isLightMode ? 'text-white hover:bg-white/20 hover:text-orange-200' : 'text-gray-300 hover:text-orange-400 hover:bg-white/5'}`} style={lightSubtleTextShadow}>{label}</button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-16 flex flex-col items-center text-center">
        
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white"
            style={{ fontFamily: '"Instrument Serif", "Instrumental Serif", Georgia, "Times New Roman", serif', ...(lightTextShadow ?? {}) }}
          >
            Find the best<br /><span className={isLightMode ? 'text-orange-500' : ''}>restaurants </span><span className={isLightMode ? 'text-orange-500' : 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400'}>near you</span>
          </h1>
          <p
            className={`mt-6 max-w-xl text-lg ${isLightMode ? 'text-white' : 'text-slate-300'}`}
            style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', ...(lightSubtleTextShadow ?? {}) }}
          >
            Explore top restaurants, scan your table QR, order instantly, and pay without waiting.
          </p>

          <div className="mt-10 w-full max-w-2xl flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className={`absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`} />
              <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key==='Enter' && navigate('/restaurants')} placeholder="Search restaurants, cuisines, dishes..." className={`w-full pl-14 pr-4 py-4 rounded-full border outline-none transition ${isLightMode ? 'border-slate-200 bg-white/90 text-slate-950 placeholder-slate-500 shadow-xl shadow-slate-300/40 focus:border-orange-500' : 'border-white/20 bg-white/10 text-white placeholder-slate-400 focus:border-orange-500'}`} />
            </div>
            <button onClick={() => navigate('/restaurants')} className="px-8 py-4 rounded-full bg-orange-500 font-semibold hover:bg-orange-600 transition whitespace-nowrap">Search</button>
          </div>

          <div className={`mt-12 flex flex-wrap justify-center gap-8 text-sm ${isLightMode ? 'text-white' : 'text-slate-300'}`} style={lightSubtleTextShadow}>
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
            <button key={cat} onClick={() => { setActiveCat(cat); navigate('/restaurants'); }} className={`flex flex-col items-center gap-2 rounded-2xl border py-4 px-2 transition hover:-translate-y-1 ${activeCat===cat ? 'bg-orange-500 border-orange-500 text-white' : isLightMode ? 'border-slate-200 bg-white text-slate-800 shadow-sm hover:border-orange-300 hover:bg-orange-50' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-orange-500/40'}`}>
              <span className="text-3xl">{cat==='All'?'🍽️':cat==='Pizza'?'🍕':cat==='Burger'?'🍔':cat==='Biryani'?'🍛':cat==='Desserts'?'🧁':cat==='Drinks'?'🥤':'🥡'}</span>
              <span className="text-xs font-semibold">{cat}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 lg:px-16 py-12">
        <p className="text-sm uppercase tracking-widest text-orange-400 mb-2">Happy Customers</p>
        <h2 className="text-3xl font-bold mb-8">What customers say</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className={`rounded-3xl border p-6 backdrop-blur-sm hover:border-orange-500/20 transition ${isLightMode ? 'border-slate-200 bg-white shadow-sm' : 'border-white/10 bg-white/5'}`}>
              <div className="flex gap-1 mb-4">{Array.from({length:t.rating}).map((_,i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
              <p className={`leading-relaxed ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>"{t.msg}"</p>
              <div className={`mt-5 flex items-center gap-3 border-t pt-4 ${isLightMode ? 'border-slate-200' : 'border-white/10'}`}>
                <div className="h-9 w-9 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-sm">{t.name[0]}</div>
                <div>
                  <p className={`font-semibold text-sm ${isLightMode ? 'text-slate-950' : 'text-white'}`}>{t.name}</p>
                  <p className={`text-xs ${isLightMode ? 'text-slate-500' : 'text-slate-500'}`}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={`mt-8 border-t ${isLightMode ? 'border-slate-200 bg-white/90 text-slate-950' : 'border-white/10 bg-[#171008] text-white'}`}>
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-16 lg:py-16">
          <div>
            <button onClick={() => goToPage('/')} className="text-left">
              <span
                className="text-4xl font-bold leading-none tracking-normal sm:text-5xl"
                style={{ fontFamily: '"Instrument Serif", "Instrumental Serif", Georgia, "Times New Roman", serif' }}
              >
                <span className={isLightMode ? 'text-slate-950' : 'text-white'}>Serve</span><span className="text-orange-500">Sphere</span>
              </span>
            </button>
            <p className={`mt-8 max-w-xs text-sm leading-relaxed ${isLightMode ? 'text-slate-700' : 'text-slate-200'}`}>
              Explore top restaurants around you, enjoy real-time availability, and experience modern dining without the hassle.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold">Quick Links</h3>
            <div className={`mt-8 flex flex-col items-start gap-2 text-sm ${isLightMode ? 'text-slate-700' : 'text-slate-100'}`}>
              {[
                ['Home', '/'],
                ['Restaurants', '/restaurants'],
                ['Reservations', '/reservations'],
                ['Queue Status', '/restaurants'],
                ['Offers', '/offers'],
                ['My Orders', '/dashboard'],
              ].map(([label, path]) => (
                <button key={label} onClick={() => goToPage(path)} className="transition hover:text-orange-400">
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold">Support</h3>
            <div className={`mt-8 flex flex-col items-start gap-2 text-sm ${isLightMode ? 'text-slate-700' : 'text-slate-100'}`}>
              {['Help Center', 'Contact Us', 'FAQs', 'Privacy Policy', 'Terms & Conditions', 'Refund Policy'].map((label) => (
                <button key={label} onClick={() => showToast(`${label} coming soon`)} className="transition hover:text-orange-400">
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold">For Restaurants</h3>
            <div className={`mt-8 flex flex-col items-start gap-2 text-sm ${isLightMode ? 'text-slate-700' : 'text-slate-100'}`}>
              {['Partner With Us', 'Restaurant Login', 'Business Solutions', 'Pricing', 'Resources'].map((label) => (
                <button key={label} onClick={() => showToast(`${label} coming soon`)} className="transition hover:text-orange-400">
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default LandingPage;
