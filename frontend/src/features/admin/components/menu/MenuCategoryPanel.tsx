import React from 'react';
import { Plus, Settings2 } from 'lucide-react';
import { useMenuStore } from '../../store/menu.store';

export function MenuCategoryPanel(): JSX.Element {
  const { categories, activeCategory, setActiveCategory } = useMenuStore();
  return (
    <aside className="w-[200px] flex-shrink-0 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">Categories</h3>
        <button className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-500 transition-colors">
          <Plus className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      <div className="flex flex-col gap-0.5 flex-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all text-left ${
              activeCategory === cat.id
                ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <span className="truncate">{cat.name}</span>
            <span className={`text-xs ml-2 flex-shrink-0 ${
              activeCategory === cat.id
                ? 'text-orange-500 dark:text-orange-400 font-bold'
                : 'text-gray-400 dark:text-gray-500'
            }`}>{cat.count}</span>
          </button>
        ))}
      </div>
      <button className="flex items-center gap-2 mt-3 px-3 py-2 rounded-xl text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
        <Settings2 className="w-3.5 h-3.5" />
        Manage Categories
      </button>
    </aside>
  );
}