import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from './CartContext';
import { useSearch } from './SearchContext';

interface Props {
  onToggleCart: () => void;
}

export default function CustomerTopBar({ onToggleCart }: Props) {
  const { itemCount } = useCart();
  const { query, setQuery } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();
  const isCheckoutPage = location.pathname.includes('/checkout');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // If mobile search overlay is active, show the full-width search bar
  if (mobileSearchOpen) {
    return (
      <header className="h-16 flex items-center px-4 bg-sd-surface border-b border-sd-surface-variant sticky top-0 z-30 shrink-0 animate-fadeIn">
        <div className="flex items-center gap-3 w-full">
          {/* Back Button */}
          <button
            onClick={() => {
              setMobileSearchOpen(false);
              setQuery(''); // Reset search text when closing mobile search
            }}
            className="p-2 text-sd-on-surface-variant hover:bg-sd-surface-container rounded-full transition-colors shrink-0"
            title="Back"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>

          {/* Search Input container */}
          <div className="flex-1 flex items-center bg-sd-surface-container-low border border-sd-outline-variant rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-sd-primary-container focus-within:border-sd-primary-container transition-all">
            <span className="material-symbols-outlined text-sd-on-surface-variant mr-2 text-[20px]">search</span>
            <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-full p-0 font-sans text-sd-on-surface placeholder:text-sd-on-surface-variant/50"
              placeholder="Search for dishes, cuisines..."
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-sd-on-surface-variant hover:text-sd-primary p-0.5"
                title="Clear"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-sd-surface border-b border-sd-surface-variant sticky top-0 z-30 shrink-0">
      {/* Left: Brand Logo (mobile-only) or Search Bar (desktop-only) */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        {/* Mobile Logo */}
        <div className="flex sm:hidden items-center gap-2 shrink-0">
          <div className="bg-sd-primary-container w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              restaurant
            </span>
          </div>
          <span className="text-base font-bold text-sd-primary font-sans whitespace-nowrap">Smart Dining</span>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden sm:flex items-center bg-sd-surface-container-low border border-sd-outline-variant rounded-full px-4 py-2 w-full focus-within:ring-2 focus-within:ring-sd-primary-container focus-within:border-sd-primary-container transition-all">
          <span className="material-symbols-outlined text-sd-on-surface-variant mr-2 text-[20px]">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-full p-0 font-sans text-sd-on-surface placeholder:text-sd-on-surface-variant/50"
            placeholder="Search for dishes, cuisines..."
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-sd-on-surface-variant hover:text-sd-primary" title="Clear">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Right: Icons — Search (mobile-only), Profile, Cart, Notifications */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Mobile Search Button */}
        <button
          onClick={() => setMobileSearchOpen(true)}
          className="flex sm:hidden p-2.5 bg-white border border-sd-outline-variant rounded-full text-sd-on-surface-variant hover:bg-sd-surface-container-low transition-colors"
          title="Search"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>

        {!isCheckoutPage && (
          <button
            onClick={onToggleCart}
            className="p-2.5 bg-white border border-sd-outline-variant rounded-full text-sd-on-surface-variant hover:bg-sd-surface-container-low transition-colors relative"
            title="Cart"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-sd-primary-container text-white text-[10px] flex items-center justify-center rounded-full border-2 border-sd-surface font-bold">
                {itemCount}
              </span>
            )}
          </button>
        )}

        <button
          className="p-2.5 bg-white border border-sd-outline-variant rounded-full text-sd-on-surface-variant hover:bg-sd-surface-container-low transition-colors relative"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sd-primary-container rounded-full border-2 border-sd-surface" />
        </button>

        <button
          onClick={() => navigate('/customer/profile')}
          className="p-2.5 bg-white border border-sd-outline-variant rounded-full text-sd-on-surface-variant hover:bg-sd-surface-container-low transition-colors"
          title="Profile"
        >
          <span className="material-symbols-outlined text-[20px]">account_circle</span>
        </button>
      </div>
    </header>
  );
}
