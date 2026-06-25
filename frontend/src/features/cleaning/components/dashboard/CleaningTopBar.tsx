import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCleaningSearch } from './CleaningSearchContext';
import { useCleaning } from '../../hooks/usecleaning';

export default function CleaningTopBar() {
  const { searchQuery, setSearchQuery } = useCleaningSearch();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { profile } = useCleaning();
  const navigate = useNavigate();

  if (mobileSearchOpen) {
    return (
      <header className="h-[72px] flex items-center px-4 bg-white dark:bg-sd-surface-container border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => { setMobileSearchOpen(false); setSearchQuery(''); }}
            className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <div className="flex-1 flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2">
            <span className="material-symbols-outlined text-slate-400 mr-2 text-[18px]">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-full font-sans text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
              placeholder="Search by ID, location, priority..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="h-[72px] flex items-center justify-between px-4 lg:px-8 bg-white dark:bg-sd-surface-container border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shrink-0">
      {/* Left side spacer */}
      <div />

      {/* Right side: Search, Notifications, Profile (all grouped at top right) */}
      <div className="flex items-center gap-4">
        {/* Desktop Search Box */}
        <div className="relative hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
          <input
            className="pl-10 pr-4 py-1.5 border border-slate-200 dark:border-slate-700 rounded-full text-xs bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cleanserve-primary w-48 lg:w-56 font-sans text-slate-800 dark:text-slate-200"
            placeholder="Search..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Mobile Search Icon Toggle */}
        <button
          onClick={() => setMobileSearchOpen(true)}
          className="flex md:hidden p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
          aria-label="Search"
        >
          <span className="material-symbols-outlined text-[22px]">search</span>
        </button>

        {/* Notifications Icon */}
        <button
          className="relative p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-1 right-1 w-4 h-4 bg-error text-white text-[9px] flex items-center justify-center rounded-full font-bold">5</span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />

        {/* Profile Card & Avatar */}
        <button
          onClick={() => navigate('/cleaning/profile')}
          className="flex items-center gap-3 text-left hover:opacity-85 transition-opacity focus:outline-none cursor-pointer"
          aria-label="View Profile"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans leading-none">{profile.name}</p>
            <p className="text-[10px] text-slate-400 font-sans leading-none mt-1">{profile.id}</p>
          </div>
          <div className="relative shrink-0">
            <img
              alt={profile.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-150 dark:border-slate-700 shadow-sm"
              src={profile.avatar}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-sd-surface-container rounded-full" />
          </div>
        </button>
      </div>
    </header>
  );
}
