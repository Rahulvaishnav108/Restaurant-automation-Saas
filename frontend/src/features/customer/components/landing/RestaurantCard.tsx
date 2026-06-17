import React from 'react';
import { Star, Clock, MapPin, Tag } from 'lucide-react';

export interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  location: string;
  image: string;
  time: string;
  distance: string;
  rating: number;
  reviews: number;
  tables: number;
  discount?: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  onViewMenu?: (id: number) => void;
}

export default function RestaurantCard({ restaurant, onViewMenu }: RestaurantCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden bg-[#2a1800]/60 border border-amber-900/30 hover:border-amber-500/40 transition-all group hover:-translate-y-1 duration-200">
      {/* Image */}
      <div className="relative h-40 sm:h-44 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
          {restaurant.tables} Tables Available
        </div>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-white text-sm sm:text-base leading-tight">{restaurant.name}</h3>
          <div className="flex items-center gap-1 text-amber-400 flex-shrink-0">
            <Star className="w-3 h-3 fill-amber-400" />
            <span className="text-xs sm:text-sm font-semibold">{restaurant.rating}</span>
            <span className="text-stone-500 text-[10px] sm:text-xs">({restaurant.reviews})</span>
          </div>
        </div>

        <p className="text-stone-400 text-[10px] sm:text-xs mb-2">{restaurant.cuisine}</p>
        <p className="text-stone-500 text-[10px] sm:text-xs mb-3">{restaurant.location}</p>

        <div className="flex items-center gap-3 text-stone-500 text-[10px] sm:text-xs mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {restaurant.time}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {restaurant.distance}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {restaurant.discount && (
            <span className="flex items-center gap-1 text-amber-400 text-[10px] sm:text-xs font-bold bg-amber-400/10 border border-amber-400/20 px-2 py-1 rounded-full whitespace-nowrap">
              <Tag className="w-2.5 h-2.5" /> {restaurant.discount}
            </span>
          )}
          <button
            onClick={() => onViewMenu?.(restaurant.id)}
            className="ml-auto bg-[#3a2200] hover:bg-amber-500 hover:text-stone-900 text-amber-400 text-[10px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 rounded-full border border-amber-800/40 hover:border-amber-500 transition-all whitespace-nowrap"
          >
            View Menu
          </button>
        </div>
      </div>
    </div>
  );
}
