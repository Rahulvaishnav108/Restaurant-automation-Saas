import React from 'react';
import { Heart, Minus, Plus, Star } from 'lucide-react';

export type CustomerMenuItem = {
  id: number;
  name: string;
  desc: string;
  price: number;
  rating: number;
  reviews: number;
  cat: string;
  veg: boolean;
  img: string;
  badge: string;
};

type MenuItemCardProps = {
  item: CustomerMenuItem;
  isFavourite: boolean;
  quantity: number;
  onToggleFavourite: (id: number) => void;
  onAdd: (id: number, name: string) => void;
  onRemove: (id: number) => void;
};

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, isFavourite, quantity, onToggleFavourite, onAdd, onRemove }) => {
  return (
    <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 hover:border-orange-500/30 transition">
      <div className="relative h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden">
        <img src={item.img} alt={item.name} className="h-full w-full object-cover" />
        {item.badge && <span className="absolute top-1 left-1 rounded-md bg-orange-500 px-1.5 py-0.5 text-[9px] font-bold">{item.badge}</span>}
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm text-white leading-tight">{item.name}</h3>
          <button onClick={() => onToggleFavourite(item.id)} className="flex-shrink-0">
            <Heart className={`h-4 w-4 ${isFavourite ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
          </button>
        </div>
        <p className="text-xs text-slate-400 line-clamp-1">{item.desc}</p>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          {item.rating}
          <span className="text-slate-600">·</span>
          {item.reviews} reviews
          {item.veg && <span className="rounded border border-green-500 px-1 text-green-400 text-[9px]">VEG</span>}
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="font-bold text-white">₹{item.price}</span>
          {quantity === 0 ? (
            <button onClick={() => onAdd(item.id, item.name)} className="rounded-xl bg-orange-500 px-4 py-1.5 text-xs font-bold hover:bg-orange-600 transition">ADD</button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-orange-500 px-2 py-1">
              <button onClick={() => onRemove(item.id)}><Minus className="h-3 w-3" /></button>
              <span className="text-xs font-bold w-4 text-center">{quantity}</span>
              <button onClick={() => onAdd(item.id, item.name)}><Plus className="h-3 w-3" /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
