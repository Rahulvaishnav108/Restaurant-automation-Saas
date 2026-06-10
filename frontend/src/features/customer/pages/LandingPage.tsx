import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

import LoginModal from '../../../auth/components/LoginModal';
import {
  LandingNavbar,
  HeroSection,
  CategoryFilterBar,
  ExploreCategoriesGrid,
  RestaurantCard,
  TrendingDishes,
  OffersDeals,
  BlogSection,
  TestimonialsSection,
  LandingFooter,
} from '../components/landing';
import type { Restaurant } from '../components/landing/RestaurantCard';

// ─── Static Data ─────────────────────────────────────────────────────────────

const topRestaurants: Restaurant[] = [
  {
    id: 1,
    name: 'Burger Barn',
    cuisine: 'Fast Food • Burgers • American',
    location: 'Connaught Place',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
    time: '5-10 mins',
    distance: '0.6 km away',
    rating: 4.3,
    reviews: 645,
    tables: 15,
    discount: 'Flat 15% OFF',
  },
  {
    id: 2,
    name: 'Cafe Heights',
    cuisine: 'Cafe • Italian • Continental',
    location: 'Connaught Place',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop',
    time: '15-30 mins',
    distance: '0.5 km away',
    rating: 4.3,
    reviews: 645,
    tables: 8,
    discount: 'Flat 15% OFF',
  },
  {
    id: 3,
    name: 'Cafe Heights',
    cuisine: 'Cafe • Italian • Continental',
    location: 'Connaught Place',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop',
    time: '15-30 mins',
    distance: '0.5 km away',
    rating: 4.3,
    reviews: 645,
    tables: 8,
    discount: 'Flat 15% OFF',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

type LandingPageProps = {
  initialLoginOpen?: boolean;
};

export default function LandingPage({ initialLoginOpen = false }: LandingPageProps) {
  const [loginOpen, setLoginOpen] = useState(initialLoginOpen);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  function handleSearch() {
    console.log('Search:', searchQuery);
  }

  return (
    /*
      Root background: deep warm brown #1c0f00 matching the design's dark
      amber-brown tone (not pure black). The gradient image in the design
      is approximated with a radial glow at the top-left via ::before pseudoelement,
      replicated here with a fixed background gradient layer.
    */
    <div
      className="min-h-screen text-white relative overflow-x-hidden"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 15% 10%, #4a2800 0%, #1c0f00 45%, #0d0800 100%)',
        backgroundColor: '#0d0800',
      }}
    >
      {/* Subtle warm glow that persists down the page — matches Image 2 */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 20% 15%, rgba(120,60,0,0.18) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />

      {/* All content sits above the fixed glow */}
      <div className="relative z-10">

        {/* Navbar */}
        <LandingNavbar onLoginClick={() => setLoginOpen(true)} />

        {/* Hero */}
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
        />

        {/* Main sections */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Find Your Perfect Spot + Filters */}
          <section className="py-8 sm:py-10">
            <h2
              className="text-xl sm:text-2xl font-bold text-white text-center mb-5 sm:mb-6"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Find Your Perfect Spot
            </h2>
            <CategoryFilterBar active={activeCategory} onChange={setActiveCategory} />
          </section>

          {/* Explore Categories */}
          <ExploreCategoriesGrid />

          {/* Top Restaurants */}
          <section className="py-10">
            <div className="text-center mb-6">
              <h2
                className="text-xl sm:text-2xl font-bold text-white"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Top Restaurants Near you
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1.5">
                Handpicked restaurants for the best dining experience
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {topRestaurants.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold text-sm transition-colors">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* Trending Dishes */}
          <TrendingDishes />

          {/* Offers & Deals */}
          <OffersDeals />

          {/* Blog */}
          <BlogSection />

          {/* Testimonials */}
          <TestimonialsSection />
        </main>

        {/* Footer */}
        <LandingFooter />
      </div>

      {/* Login Modal */}
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
      />
    </div>
  );
}
