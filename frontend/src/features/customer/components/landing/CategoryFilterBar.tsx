import React from 'react';
import { ChevronDown } from 'lucide-react';

const filters = ['All', 'Fine Dining', 'Cafe', 'Fast Food', 'Italian', 'Veg', 'Non Veg'];

interface CategoryFilterBarProps {
  active: string;
  onChange: (cat: string) => void;
}

export default function CategoryFilterBar({ active, onChange }: CategoryFilterBarProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Scrollable filter pills row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => onChange(f)}
            className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all border whitespace-nowrap ${
              active === f
                ? 'bg-amber-500 text-stone-900 border-amber-500'
                : 'bg-[#2a1800]/70 text-stone-300 border-amber-900/30 hover:border-amber-500/60 hover:text-amber-300'
            }`}
          >
            {f}
          </button>
        ))}
        <button className="flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border bg-[#2a1800]/70 text-stone-300 border-amber-900/30 hover:border-amber-500/60 whitespace-nowrap">
          ··· More
        </button>
      </div>
      {/* Sort button — separate row on mobile */}
      <div className="flex justify-end">
        <button className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border bg-[#2a1800]/70 text-stone-300 border-amber-900/30 hover:border-amber-500/60 whitespace-nowrap">
          Sort by Popular <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
