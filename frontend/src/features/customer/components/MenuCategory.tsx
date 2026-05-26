import React from 'react';

export type MenuCategoryItem = {
  label: string;
  icon: string;
};

type MenuCategoryProps = {
  categories: MenuCategoryItem[];
  activeCategory: string;
  onSelect: (category: string) => void;
  compact?: boolean;
};

const MenuCategory: React.FC<MenuCategoryProps> = ({ categories, activeCategory, onSelect, compact = false }) => {
  return (
    <div className="overflow-x-auto flex gap-2 pb-1 scrollbar-none">
      {categories.map((category) => (
        <button
          key={category.label}
          onClick={() => onSelect(category.label)}
          className={`flex-shrink-0 font-semibold transition ${
            compact ? 'rounded-xl px-4 py-2 text-xs' : 'flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm'
          } ${
            activeCategory === category.label
              ? 'bg-orange-500 text-white'
              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
          }`}
        >
          <span>{category.icon}</span>
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default MenuCategory;
