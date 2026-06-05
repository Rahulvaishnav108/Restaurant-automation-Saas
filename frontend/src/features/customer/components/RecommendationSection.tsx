import React from 'react';
import { Flame, Sparkles, TrendingUp } from 'lucide-react';
import MenuItemCard, { type CustomerMenuItem } from './MenuItemCard';

type RecommendationSectionProps = {
  recommendations: CustomerMenuItem[];
  popularItems: CustomerMenuItem[];
  favourites: number[];
  getCartQuantity: (id: number) => number;
  onToggleFavourite: (id: number) => void;
  onAdd: (id: number, name: string) => void;
  onRemove: (id: number) => void;
  onViewAll: () => void;
};

const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  recommendations,
  popularItems,
  favourites,
  getCartQuantity,
  onToggleFavourite,
  onAdd,
  onRemove,
  onViewAll,
}) => {
  return (
    <section className="space-y-5">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-orange-400" />
              <h2 className="text-lg font-bold">AI recommendations</h2>
            </div>
            <p className="mt-1 text-xs text-slate-400">Picked from your favorites, cart, and top-rated meals</p>
          </div>
          <button onClick={onViewAll} className="text-sm text-orange-400 hover:underline">View all</button>
        </div>
        <div className="space-y-3">
          {recommendations.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              isFavourite={favourites.includes(item.id)}
              quantity={getCartQuantity(item.id)}
              onToggleFavourite={onToggleFavourite}
              onAdd={onAdd}
              onRemove={onRemove}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-amber-400" />
          <h2 className="text-lg font-bold">Popular right now</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {popularItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onAdd(item.id, item.name)}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left transition hover:border-orange-500/40 hover:bg-white/10"
            >
              <div className="relative h-24">
                <img src={item.img} alt={item.name} className="h-full w-full object-cover" />
                <span className="absolute left-2 top-2 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-[10px] font-bold text-amber-300 backdrop-blur">
                  <Flame className="h-3 w-3" />
                  {item.rating}
                </span>
              </div>
              <div className="p-3">
                <p className="line-clamp-1 text-sm font-semibold">{item.name}</p>
                <p className="mt-1 text-xs text-slate-400">₹{item.price} · {item.reviews} reviews</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendationSection;
