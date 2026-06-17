import React from 'react';

const categories = [
  { label: 'Pizza',       emoji: '🍕' },
  { label: 'Burger',      emoji: '🍔' },
  { label: 'Chinese',     emoji: '🍜' },
  { label: 'Coffee',      emoji: '☕' },
  { label: 'Desserts',    emoji: '🧁' },
  { label: 'North Indian',emoji: '🍛' },
];

export default function ExploreCategoriesGrid() {
  return (
    <section className="py-10">
      <h2
        className="text-xl sm:text-2xl font-bold text-white text-center mb-6"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        Explore by Categories
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
        {categories.map(({ label, emoji }) => (
          <button
            key={label}
            className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-5 rounded-2xl bg-[#2a1800]/60 border border-amber-900/30 hover:border-amber-500/50 hover:bg-[#3a2200]/70 transition-all group"
          >
            <span className="text-2xl sm:text-3xl">{emoji}</span>
            <span className="text-stone-300 group-hover:text-amber-300 text-xs sm:text-sm font-medium transition-colors text-center leading-tight">
              {label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
