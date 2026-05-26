import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import MenuItemCard, { type CustomerMenuItem } from './MenuItemCard';

type FavoriteMealsProps = {
  items: CustomerMenuItem[];
  favourites: number[];
  getCartQuantity: (id: number) => number;
  onToggleFavourite: (id: number) => void;
  onAdd: (id: number, name: string) => void;
  onRemove: (id: number) => void;
  onBrowseMenu: () => void;
};

const FavoriteMeals: React.FC<FavoriteMealsProps> = ({
  items,
  favourites,
  getCartQuantity,
  onToggleFavourite,
  onAdd,
  onRemove,
  onBrowseMenu,
}) => {
  const savedItems = items.filter((item) => favourites.includes(item.id));

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Favorite meals</h2>
          <p className="text-xs text-slate-400">{savedItems.length} saved items ready to reorder</p>
        </div>
        <Heart className="h-5 w-5 fill-red-500 text-red-500" />
      </div>

      {savedItems.length > 0 ? (
        <div className="space-y-3">
          {savedItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              isFavourite
              quantity={getCartQuantity(item.id)}
              onToggleFavourite={onToggleFavourite}
              onAdd={onAdd}
              onRemove={onRemove}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10">
            <Sparkles className="h-5 w-5 text-orange-400" />
          </div>
          <p className="text-sm font-semibold">Save dishes you love</p>
          <p className="mt-1 text-xs text-slate-400">Tap the heart on any menu item to build your quick reorder list.</p>
          <button onClick={onBrowseMenu} className="mt-4 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold transition hover:bg-orange-600">
            Browse Menu
          </button>
        </div>
      )}
    </section>
  );
};

export default FavoriteMeals;
