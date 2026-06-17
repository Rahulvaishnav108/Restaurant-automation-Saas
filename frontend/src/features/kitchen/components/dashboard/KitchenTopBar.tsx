import React, { useState } from 'react';
import { useKitchenSearch } from './KitchenSearchContext';

export default function KitchenTopBar() {
  const { query, setQuery } = useKitchenSearch();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateStr = formatDate(now);

  if (mobileSearchOpen) {
    return (
      <header className="h-16 flex items-center px-4 bg-white border-b border-slate-200 sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-3 w-full">
          <button onClick={() => { setMobileSearchOpen(false); setQuery(''); }} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full">
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-full px-4 py-2">
            <span className="material-symbols-outlined text-slate-400 mr-2 text-[18px]">search</span>
            <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-full font-sans text-slate-800 placeholder:text-slate-400"
              placeholder="Search orders..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined text-[16px]">close</span></button>}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-white border-b border-slate-200 sticky top-0 z-30 shrink-0">
      {/* Left: Stats */}
      <div className="hidden md:flex gap-8 lg:gap-12 items-center">
        <div>
          <p className="text-[10px] text-slate-400 font-sans mb-0.5">Time</p>
          <p className="text-lg font-bold text-orange-600 font-sans">{timeStr}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-sans mb-0.5">Date</p>
          <p className="text-lg font-bold text-slate-800 font-sans">{dateStr}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-green-50 text-green-600 px-3 py-1.5 rounded-lg flex items-center gap-2 font-bold text-xs border border-green-100 font-sans">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            LIVE
          </div>
        </div>
        <div className="hidden xl:flex gap-8">
          <div className="text-center">
            <p className="text-[10px] text-slate-400 mb-0.5 font-sans">Active Orders</p>
            <p className="text-xl font-bold text-orange-600 font-sans">24</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-slate-400 mb-0.5 font-sans">Avg. Prep Time</p>
            <p className="text-xl font-bold text-blue-600 font-sans">14:32</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 mb-0.5 font-sans">Kitchen Load</p>
            <div className="flex items-end gap-3">
              <p className="text-xl font-bold text-green-600 font-sans">78%</p>
              <div className="flex items-end gap-0.5 h-6">
                {[40, 55, 35, 70, 80, 100, 85, 60].map((h, i) => (
                  <div key={i} className={`w-1 rounded-t-sm ${i >= 4 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Brand */}
      <div className="flex md:hidden items-center gap-2">
        <div className="bg-orange-100 p-1.5 rounded-lg">
          <span className="material-symbols-outlined text-orange-600 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
        </div>
        <span className="font-bold text-sm text-slate-800 font-sans">Flavoroast</span>
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Desktop Search */}
        <div className="relative hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
          <input
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-full text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500 w-48 font-sans"
            placeholder="Search orders..."
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Mobile Search Button */}
        <button onClick={() => setMobileSearchOpen(true)} className="flex md:hidden p-2 text-slate-400 hover:bg-slate-100 rounded-full">
          <span className="material-symbols-outlined text-[22px]">search</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] flex items-center justify-center rounded-full font-bold">4</span>
        </button>

        {/* Profile */}
        <div className="w-9 h-9 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-bold text-xs cursor-pointer hover:ring-2 hover:ring-orange-300 transition-all">
          CA
        </div>
      </div>
    </header>
  );
}
