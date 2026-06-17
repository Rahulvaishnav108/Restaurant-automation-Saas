import React from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../components/dashboard/SearchContext';
import FoodCard from '../components/dashboard/FoodCard';
import CategoryFilter from '../components/dashboard/CategoryFilter';
import QuickActions from '../components/dashboard/QuickActions';
import { useCustomerStore } from '../store/customer.store';

export default function CustomerHomePage() {
  const { filteredItems } = useSearch();
  const { profile } = useCustomerStore();
  const recommended = filteredItems.slice(0, 8);

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto h-full sd-custom-scrollbar">
      {/* Greeting */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-sd-on-surface font-sans">Good Evening, {profile.name.split(' ')[0]}! 👋</h2>
        <p className="text-sm text-sd-on-surface-variant font-sans">What would you like to order today?</p>
      </div>

      {/* Hero Banner */}
      <section className="mb-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#FFF2EA] dark:bg-[#1a110c] border border-sd-surface-variant/40 dark:border-sd-primary/10 h-48 md:h-64 flex items-center">
          <div className="relative z-10 pl-6 md:pl-10 w-full md:w-1/2">
            <span className="inline-block px-3 py-1 bg-sd-primary/10 text-sd-primary font-bold text-xs rounded-full mb-2 font-sans">
              Today&apos;s Special
            </span>
            <h3 className="text-xl md:text-3xl font-bold text-sd-on-surface leading-tight mb-3 font-sans">
              Delicious food delivered to your table
            </h3>
            <p className="text-sm text-sd-on-surface-variant mb-4 hidden sm:block font-sans">
              Fresh, hot & made for you with the finest ingredients.
            </p>
            <Link
              to="/customer/menu"
              className="inline-block bg-sd-primary-container text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all active:scale-95 font-sans"
            >
              Order Now
            </Link>
          </div>
          <div className="hidden md:flex relative w-1/2 h-full items-center justify-end pr-10">
            <div className="absolute top-6 right-12 bg-sd-primary-container text-white p-3 rounded-full w-16 h-16 flex flex-col items-center justify-center rotate-12 shadow-xl z-20 border-4 border-white dark:border-[#1a110c]">
              <span className="text-lg font-bold font-sans">20%</span>
              <span className="text-[8px] font-bold uppercase tracking-widest font-sans">OFF</span>
            </div>
            <img
              alt="Gourmet dish"
              className="h-[120%] w-auto object-contain drop-shadow-2xl translate-x-4 rotate-3"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGtNpJIABfHBSUxs1rtXkf40UZs4dyGWwvfNutUy2EsY7p1HA79fNZe_xbenHUzeaydKEZ1wlnS0QiaigaySy6aWezO43K_ZpZWKVJ4IE4fxOcJ4uTyD3ODFudCn0hTtemF89vLqsR3TNFwBjDIhZUJyoyRgyxLP0tUx4mmBHf_hLN1tE1r6lyiuM1pxxdBjfiQoW5cR3XnyfHYNUqV-vgrevyU8h6i7QVaJho7t3i03uWI2N_OMVDkTYOR2dAk_XafXFSqTt-SYc"
            />
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            <div className="w-8 h-1.5 bg-sd-primary-container rounded-full" />
            <div className="w-1.5 h-1.5 bg-sd-primary-container/20 rounded-full" />
            <div className="w-1.5 h-1.5 bg-sd-primary-container/20 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: 'bolt', label: 'Fast Delivery', desc: 'On-time service', color: 'bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400' },
          { icon: 'ecg_heart', label: 'Fresh Food', desc: 'Hygienic & tasty', color: 'bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400' },
          { icon: 'location_on', label: 'Live Tracking', desc: 'Track your order', color: 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' },
          { icon: 'verified', label: 'Best Offers', desc: 'Exciting deals', color: 'bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400' },
        ].map(({ icon, label, desc, color }) => (
          <div
            key={label}
            className="bg-white dark:bg-sd-surface-container p-5 rounded-2xl border border-sd-outline-variant dark:border-sd-outline-variant/40 flex flex-col items-center text-center gap-2.5 hover:shadow-md transition-all"
          >
            <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center shrink-0`}>
              <span className="material-symbols-outlined text-[24px]">{icon}</span>
            </div>
            <div>
              <p className="text-sm font-bold font-sans text-sd-on-surface">{label}</p>
              <p className="text-[11px] text-sd-on-surface-variant font-sans mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Quick Actions — extra features */}
      <QuickActions />

      {/* Categories */}
      <section className="mb-8 mt-4">
        <CategoryFilter />
      </section>

      {/* Recommended */}
      <section className="mb-8 food-grid-container">
        <div className="flex justify-between items-end mb-5">
          <div>
            <h3 className="text-base font-bold text-sd-on-surface font-sans">Recommended for you</h3>
            <p className="text-xs text-sd-on-surface-variant font-sans">Handpicked dishes based on your taste</p>
          </div>
        </div>
        <div className="cq-food-grid-5">
          {recommended.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link
            to="/customer/menu"
            className="px-6 py-2.5 border-2 border-sd-primary text-sd-primary hover:bg-sd-primary hover:text-white rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center gap-2 font-sans"
          >
            View All Menu
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
