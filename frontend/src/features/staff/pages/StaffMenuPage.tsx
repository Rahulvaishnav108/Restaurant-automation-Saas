import React, { useState } from 'react';
import { useStaffSearch } from '../components/dashboard/StaffSearchContext';

interface MenuItem {
  id: number;
  name: string;
  category: 'Starters' | 'Mains' | 'Desserts' | 'Beverages';
  price: number;
  available: boolean;
  spicy?: boolean;
  veg: boolean;
  description: string;
}

export default function StaffMenuPage() {
  const { query } = useStaffSearch();
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Starters' | 'Mains' | 'Desserts' | 'Beverages'>('All');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 1, name: 'Paneer Tikka Masala', category: 'Mains', price: 340, available: true, spicy: true, veg: true, description: 'Clay-oven roasted cottage cheese cubes cooked in spicy rich tomato-based gravy.' },
    { id: 2, name: 'Butter Naan', category: 'Mains', price: 60, available: true, veg: true, description: 'Leavened flatbread made of white flour, baked in tandoor and brushed with butter.' },
    { id: 3, name: 'Virgin Mojito', category: 'Beverages', price: 160, available: true, veg: true, description: 'Refreshing cocktail containing lime juice, mint leaves, sugar syrup, and soda.' },
    { id: 4, name: 'Chocolate Lava Cake', category: 'Desserts', price: 190, available: true, veg: true, description: 'Rich chocolate cake with a molten chocolate core, served with vanilla ice cream.' },
    { id: 5, name: 'Spring Rolls', category: 'Starters', price: 180, available: true, veg: true, description: 'Crispy fried rolled pastry filled with seasoned vegetables.' },
    { id: 6, name: 'Chicken Biryani', category: 'Mains', price: 420, available: true, spicy: true, veg: false, description: 'Slow-cooked aromatic basmati rice layered with marinated chicken, saffron, and spices.' },
    { id: 7, name: 'Dal Makhani', category: 'Mains', price: 280, available: false, veg: true, description: 'Creamy black lentils slow-cooked overnight with spices, butter, and cream.' },
    { id: 8, name: 'French Fries', category: 'Starters', price: 120, available: true, veg: true, description: 'Golden, crispy, lightly salted deep-fried potato strips.' },
  ]);

  const toggleAvailability = (id: number) => {
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, available: !item.available } : item));
  };

  const filteredByCategory = menuItems.filter(item => 
    selectedCategory === 'All' ? true : item.category === selectedCategory
  );

  const searchedItems = filteredByCategory.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-sans tracking-tight">Menu Browser</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Browse menu items and manage real-time availability status.</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {(['All', 'Starters', 'Mains', 'Desserts', 'Beverages'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold py-2 px-3 rounded-lg border transition-all ${
                selectedCategory === cat
                  ? 'bg-dine-orange text-white border-dine-orange shadow-sm'
                  : 'bg-white text-slate-655 border border-slate-100 hover:bg-slate-55'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {searchedItems.length > 0 ? (
          searchedItems.map(item => (
            <div
              key={item.id}
              className={`bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-soft transition-all flex flex-col justify-between`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-slate-405 font-bold uppercase font-sans bg-slate-55 px-2.5 py-0.5 rounded border border-slate-100">
                    {item.category}
                  </span>
                  <div className="flex gap-1.5">
                    {item.veg ? (
                      <span className="w-4.5 h-4.5 border border-green-500 rounded flex items-center justify-center text-[8px] text-green-500 font-black" title="Vegetarian">🟢</span>
                    ) : (
                      <span className="w-4.5 h-4.5 border border-red-500 rounded flex items-center justify-center text-[8px] text-red-500 font-black" title="Non-Vegetarian">🔴</span>
                    )}
                    {item.spicy && (
                      <span className="text-xs" title="Spicy">🌶️</span>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 font-sans">{item.name}</h3>
                  <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="font-black text-sm text-slate-800 dark:text-slate-150 font-sans">₹{item.price}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-semibold font-sans">{item.available ? 'In Stock' : 'Out of Stock'}</span>
                  <button
                    onClick={() => toggleAvailability(item.id)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      item.available ? 'bg-dine-orange' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        item.available ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400">
            No matching menu items found.
          </div>
        )}
      </div>
    </div>
  );
}
