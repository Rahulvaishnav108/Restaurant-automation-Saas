import React, { useState } from 'react';
import { CalendarDays, Clock3, Moon, ShoppingBag, Sun, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

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

const ReservationsPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  return (
    <div className={`min-h-screen transition-colors ${isLightMode ? 'bg-slate-50 text-slate-950' : 'bg-[#080b14] text-white'}`}>
      <CustomerNav isLightMode={isLightMode} onToggleMode={() => setIsLightMode((value) => !value)} />
      <main className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1fr_420px] lg:px-16">
        <section>
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-300">Reservations</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">Book a table before you arrive.</h1>
          <p className={`mt-5 max-w-2xl ${isLightMode ? 'text-slate-600' : 'text-slate-300'}`}>Reserve a table, share your party size, and arrive to a smoother dining experience.</p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ['Pick a date', CalendarDays],
              ['Choose a time', Clock3],
              ['Add guests', Users],
            ].map(([label, Icon]) => {
              const IconComp = Icon as React.ElementType;
              return (
                <div key={label as string} className={`rounded-3xl border p-5 ${isLightMode ? 'border-slate-200 bg-white shadow-sm' : 'border-white/10 bg-white/5'}`}>
                  <IconComp className="h-6 w-6 text-orange-300" />
                  <p className="mt-4 font-semibold">{label as string}</p>
                </div>
              );
            })}
          </div>
        </section>

        <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }} className={`rounded-3xl border p-6 shadow-xl shadow-black/20 ${isLightMode ? 'border-slate-200 bg-white' : 'border-white/10 bg-slate-900/80'}`}>
          <h2 className="text-2xl font-bold">Reserve your table</h2>
          <div className="mt-6 space-y-4">
            <input required placeholder="Full name" className={`w-full rounded-2xl border px-4 py-3 outline-none focus:border-orange-500 ${isLightMode ? 'border-slate-200 bg-slate-50 text-slate-950' : 'border-white/10 bg-white/5 text-white'}`} />
            <input required type="tel" placeholder="Mobile number" className={`w-full rounded-2xl border px-4 py-3 outline-none focus:border-orange-500 ${isLightMode ? 'border-slate-200 bg-slate-50 text-slate-950' : 'border-white/10 bg-white/5 text-white'}`} />
            <div className="grid grid-cols-2 gap-3">
              <input required type="date" className={`w-full rounded-2xl border px-4 py-3 outline-none focus:border-orange-500 ${isLightMode ? 'border-slate-200 bg-slate-50 text-slate-950' : 'border-white/10 bg-white/5 text-white'}`} />
              <input required type="time" className={`w-full rounded-2xl border px-4 py-3 outline-none focus:border-orange-500 ${isLightMode ? 'border-slate-200 bg-slate-50 text-slate-950' : 'border-white/10 bg-white/5 text-white'}`} />
            </div>
            <select required className={`w-full rounded-2xl border px-4 py-3 outline-none focus:border-orange-500 ${isLightMode ? 'border-slate-200 bg-slate-50 text-slate-950' : 'border-white/10 bg-[#111827] text-white'}`}>
              <option value="">Guests</option>
              <option>2 guests</option>
              <option>4 guests</option>
              <option>6 guests</option>
              <option>8+ guests</option>
            </select>
            <textarea placeholder="Special request" rows={4} className={`w-full resize-none rounded-2xl border px-4 py-3 outline-none focus:border-orange-500 ${isLightMode ? 'border-slate-200 bg-slate-50 text-slate-950' : 'border-white/10 bg-white/5 text-white'}`} />
            <button className="w-full rounded-2xl bg-orange-500 py-3 font-bold transition hover:bg-orange-600">Confirm Reservation</button>
            {submitted && <p className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">Reservation request submitted successfully.</p>}
          </div>
        </form>
      </main>
    </div>
  );
};

export default ReservationsPage;
