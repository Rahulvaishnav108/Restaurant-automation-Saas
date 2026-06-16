import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, MapPin, ChevronDown, Menu, X } from 'lucide-react';

interface LandingNavbarProps {
  onLoginClick: () => void;
}

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Restaurants', path: '/restaurants' },
  { name: 'Offers', path: '/offers' },
  { name: 'Reservations', path: '/reservations' },
];

export default function LandingNavbar({ onLoginClick }: LandingNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#1a0e00]/98 backdrop-blur-md shadow-lg shadow-black/50'
          : 'bg-[#1a0e00]/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Logo */}
          <a href="/" className="flex items-center select-none flex-shrink-0">
            <span className="text-[#FF9F00] font-bold text-4lg sm:text-4xl" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Serve
            </span>
            <span className="text-white font-bold text-4lg sm:text-4xl" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Sphere
            </span>
          </a>

          {/* Location — desktop only */}
          <button className="hidden md:flex items-center gap-1.5 text-[#FF9F00]/75 hover:text-[#FF9F00] transition-colors text-sm ml-4">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Mulund, Mumbai</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 ml-auto mr-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors whitespace-nowrap ${
                  link.name === 'Home'
                    ? 'text-[#FF9F00] border-b border-[#FF9F00] pb-0.5'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button className="hidden md:flex w-8 h-8 items-center justify-center rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={onLoginClick}
              className="bg-[#FF9F00] hover:bg-[#FF9F00] text-stone-900 font-semibold text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors whitespace-nowrap"
            >
              Login / Sign Up
            </button>
            <button
              className="md:hidden w-8 h-8 flex items-center justify-center text-stone-300 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-[#1a0e00]/99 backdrop-blur-md border-t border-[#FF9F00]/30 px-4 pt-2 pb-4">
          <div className="flex items-center gap-1.5 text-[#FF9F00]/60 text-xs py-2.5 border-b border-[#FF9F00]/30 mb-2">
            <MapPin className="w-3 h-3 text-[#FF9F00]" />
            <span>Mulund, Mumbai</span>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium py-2.5 px-2 rounded-lg transition-colors ${
                link.name === 'Home' ? 'text-[#FF9F00]' : 'text-stone-300 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
