import React from 'react';
import { MapPin, Star } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onSearch: () => void;
}

export default function HeroSection({ searchQuery, onSearchChange, onSearch }: HeroSectionProps) {
  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-center items-center text-center px-4 pt-14 sm:pt-16 pb-12 overflow-hidden">
      {/* Background restaurant image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/Restaurant Image.png')" }}
      />
      {/* Gradient overlay — matches design: dark at edges, slightly lighter in center */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[#1c0f00]/95" />
      {/* Extra vignette sides for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <h1
          className="text-[2rem] leading-tight sm:text-5xl lg:text-6xl font-bold text-white mb-4"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Find the best
          <br />
          restaurants{' '}
          <em className="text-[#FF9F00] italic">near you</em>
        </h1>

        <p className="text-stone-300 text-sm sm:text-base mb-7 leading-relaxed max-w-sm sm:max-w-md mx-auto">
          Explore top restaurants, check availability, book a table or order instantly.
        </p>

        {/* Search bar */}
        <div className="flex items-center bg-[#1c1000]/90 backdrop-blur-md border border-[#FF9F00]/40 rounded-full pl-3 pr-1.5 py-1.5 w-full max-w-lg mx-auto shadow-2xl shadow-black/60 gap-2">
          <MapPin className="w-4 h-4 text-[#FF9F00] flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            placeholder="Search restaurants, cuisines, or dishes..."
            className="flex-1 min-w-0 bg-transparent text-white placeholder-stone-500 text-xs sm:text-sm outline-none py-1.5"
          />
          <button
            onClick={onSearch}
            className="bg-[#FF9F00] hover:bg-[#FF9F00] active:bg-[#FF9F00] text-stone-900 font-bold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-colors flex-shrink-0"
          >
            Search
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-5 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 text-[#FF9F00]/80">
            <MapPin className="w-3.5 h-3.5 text-[#FF9F00] flex-shrink-0" />
            <span>24 Restaurants Nearby</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#FF9F00]/80">
            <Star className="w-3.5 h-3.5 text-[#FF9F00] fill-[#FF9F00] flex-shrink-0" />
            <span>4.5+ Avg Ratings</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#FF9F00]/80">
            <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 animate-pulse" />
            <span>Live Availability</span>
          </div>
        </div>
      </div>

      {/* Bottom fade into page background */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#1c0f00] to-transparent" />
    </section>
  );
}
