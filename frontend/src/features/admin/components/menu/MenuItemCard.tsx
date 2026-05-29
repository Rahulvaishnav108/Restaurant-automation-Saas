import React from 'react';
import { PackageOpen, TrendingDown } from 'lucide-react';
import type { MenuItem } from '../../store/menu.store';
import { useMenuStore } from '../../store/menu.store';
import { MenuStatusBadge } from './MenuStatusBadge';

interface Props { item: MenuItem; }

export function MenuItemCard({ item }: Props): JSX.Element {
  const toggleItemEnabled = useMenuStore((s) => s.toggleItemEnabled);

  const stockIcon =
    item.status === 'Out of Stock' ? <PackageOpen className="w-3.5 h-3.5 text-red-400" /> :
    item.status === 'Low Stock'    ? <TrendingDown className="w-3.5 h-3.5 text-amber-400" /> :
                                     <PackageOpen className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />;

  const stockLabel =
    item.status === 'Out of Stock' ? 'Out of Stock' :
    item.status === 'Low Stock'    ? `Low Stock (${item.stock})` :
                                     `In Stock (${item.stock})`;

  const stockLabelClass =
    item.status === 'Out of Stock' ? 'text-red-400' :
    item.status === 'Low Stock'    ? 'text-amber-500 dark:text-amber-400' :
                                     'text-gray-400 dark:text-gray-500';

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 flex gap-3 hover:shadow-md transition-shadow relative overflow-hidden">
      <button
        onClick={() => toggleItemEnabled(item.id)}
        className={`absolute top-3 right-3 w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${
          item.enabled ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-700'
        }`}
        title={item.enabled ? 'Disable item' : 'Enable item'}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
          item.enabled ? 'left-[22px]' : 'left-0.5'
        }`} />
      </button>
      <div className="w-[70px] h-[70px] flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = 'https://via.placeholder.com/70x70/f3f4f6/9ca3af?text=dish';
          }}
        />
      </div>
      <div className="flex-1 min-w-0 pr-8">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate leading-tight">{item.name}</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{item.description}</p>
        <p className="text-base font-extrabold text-gray-800 dark:text-gray-100 mt-1.5">
          &#8377;{item.price.toLocaleString('en-IN')}
        </p>
        <div className="mt-1.5"><MenuStatusBadge status={item.status} /></div>
        <div className={`flex items-center gap-1 mt-1.5 text-xs ${stockLabelClass}`}>
          {stockIcon}
          <span>{stockLabel}</span>
        </div>
      </div>
    </div>
  );
}