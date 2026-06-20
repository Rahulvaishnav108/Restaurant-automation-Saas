import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
}

const trendingDishes: Dish[] = [
  {
    id: 1,
    name: 'Beef Cheese Burger',
    description: 'With Special Sauce',
    price: 300,
    rating: 4.3,
    reviews: 645,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Mixed Salad',
    description: 'With Special Sauce',
    price: 600,
    rating: 4.3,
    reviews: 645,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop',
    badge: 'AJAX',
  },
  {
    id: 3,
    name: 'Mixed Salad',
    description: 'With Special Sauce',
    price: 800,
    rating: 4.3,
    reviews: 645,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=400&auto=format&fit=crop',
    badge: 'AJAX',
  },
  {
    id: 4,
    name: 'Vegan Chinese',
    description: 'With Special Sauce',
    price: 700,
    rating: 4.3,
    reviews: 645,
    image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?q=80&w=400&auto=format&fit=crop',
    badge: 'AJAX',
  },
  {
    id: 5,
    name: 'Cheesy Pizza',
    description: 'With Special Sauce',
    price: 1200,
    rating: 4.3,
    reviews: 645,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400&auto=format&fit=crop',
    badge: 'AJAX',
  },
];

export default function TrendingDishes() {
  return (
    <section className="py-10">
      <h2
        className="text-xl sm:text-2xl font-bold text-white text-center mb-6"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        Trending Dishes
      </h2>

      {/* Mobile: horizontal scroll. Desktop: 5-col grid */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:pb-0">
        {trendingDishes.map((dish) => (
          <div
            key={dish.id}
            className="flex-shrink-0 w-[150px] sm:w-auto rounded-2xl bg-[#2a1800]/60 border border-amber-900/30 hover:border-amber-500/40 overflow-hidden transition-all hover:-translate-y-1 duration-200 group"
          >
            {/* Image */}
            <div className="relative h-28 sm:h-32 overflow-hidden">
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button className="absolute top-2 right-2 w-6 h-6 sm:w-7 sm:h-7 bg-[#1c0f00]/80 backdrop-blur-sm text-amber-400 hover:bg-amber-500 hover:text-stone-900 rounded-full flex items-center justify-center transition-all">
                <ShoppingCart className="w-3 h-3" />
              </button>
            </div>

            <div className="p-2.5 sm:p-3">
              <p className="font-semibold text-white text-xs sm:text-sm leading-tight mb-0.5">{dish.name}</p>
              <p className="text-stone-500 text-[10px] sm:text-xs mb-1.5">{dish.description}</p>
              {dish.badge && (
                <span className="inline-block text-[9px] sm:text-[10px] text-amber-400 font-bold bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded-full mb-1">
                  {dish.badge}
                </span>
              )}
              <div className="flex items-center justify-between mt-1">
                <span className="text-amber-400 font-bold text-xs sm:text-sm">₹{dish.price}</span>
                <div className="flex items-center gap-0.5 text-stone-400 text-[10px] sm:text-xs">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  {dish.rating}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
