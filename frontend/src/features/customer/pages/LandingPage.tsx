import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Star,
  MapPin,
  Clock,
  Search,
  Plus,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Send,
  CalendarCheck,
  ShieldCheck,
  Headset
} from 'lucide-react';

import LoginModal from '../../../auth/components/LoginModal';

// ─── Static Data ─────────────────────────────────────────────────────────────

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  location: string;
  image: string;
  time: string;
  priceLevel: string;
  rating: number;
}

const TOP_RESTAURANTS: Restaurant[] = [
  {
    id: 1,
    name: 'The Grand Kitchen',
    cuisine: 'Italian, Continental',
    location: 'Bandra West, Mumbai',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
    time: '30-40 mins',
    priceLevel: '₹₹₹',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Spice Route',
    cuisine: 'North Indian, Mughlai',
    location: 'Andheri East, Mumbai',
    image: 'https://images.unsplash.com/photo-1585938338996-b6ae4c4db58a?q=80&w=800&auto=format&fit=crop',
    time: '25-35 mins',
    priceLevel: '₹₹',
    rating: 4.4,
  },
  {
    id: 3,
    name: 'Ocean Delight',
    cuisine: 'Seafood, Asian',
    location: 'Juhu, Mumbai',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop',
    time: '20-30 mins',
    priceLevel: '₹₹₹',
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Urban Bites',
    cuisine: 'American, Fast Food',
    location: 'Lower Parel, Mumbai',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
    time: '20-30 mins',
    priceLevel: '₹',
    rating: 4.3,
  },
];

interface Category {
  name: string;
  emoji: string;
}

const CATEGORIES: Category[] = [
  { name: 'Pizza', emoji: '🍕' },
  { name: 'Burger', emoji: '🍔' },
  { name: 'Chinese', emoji: '🍜' },
  { name: 'Coffee', emoji: '☕' },
  { name: 'Desserts', emoji: '🧁' },
  { name: 'North Indian', emoji: '🍛' },
];

interface Dish {
  id: number;
  name: string;
  price: string;
  rating: number;
  image: string;
}

const TOP_DISHES: Dish[] = [
  {
    id: 1,
    name: 'Margherita Pizza',
    price: '$14.99',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Classic Burger',
    price: '$12.49',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Creamy Alfredo Pasta',
    price: '$13.99',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'Caesar Salad',
    price: '$9.99',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 5,
    name: 'Hyderabadi Biryani',
    price: '$11.99',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=400&auto=format&fit=crop',
  },
];

interface Offer {
  id: number;
  discount: string;
  minOrder: string;
  code: string;
  image: string;
  bgColor: string;
  borderColor: string;
}

const OFFERS: Offer[] = [
  {
    id: 1,
    discount: 'FLAT 20% OFF',
    minOrder: 'On Min Order ₹199',
    code: 'SAV22',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop',
    bgColor: 'bg-orange-950/20 dark:bg-orange-950/40',
    borderColor: 'border-orange-500/30',
  },
  {
    id: 2,
    discount: 'FLAT 20% OFF',
    minOrder: 'On Min Order ₹199',
    code: 'SAV22',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop',
    bgColor: 'bg-stone-900/30',
    borderColor: 'border-stone-500/30',
  },
  {
    id: 3,
    discount: 'FLAT 20% OFF',
    minOrder: 'On Min Order ₹199',
    code: 'SAV22',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop',
    bgColor: 'bg-purple-950/10 dark:bg-purple-950/30',
    borderColor: 'border-purple-500/30',
  },
];

interface BlogPost {
  id: number;
  category: string;
  title: string;
  desc: string;
  date: string;
  readTime: string;
  image: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    category: 'Restaurant Tips',
    title: '5 Tips to Improve Your Restaurant Customer Experience',
    desc: 'Simple ways to create memorable dining experiences for your customers.',
    date: 'May 12, 2025',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 2,
    category: 'Trends',
    title: 'Top Restaurant Trends to Watch in 2025',
    desc: 'Stay ahead with the latest restaurant industry trends and innovations.',
    date: 'May 10, 2025',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 3,
    category: 'Food & Culture',
    title: 'Exploring the Rise of Local Cuisines',
    desc: 'Why local flavors are winning hearts across the globe.',
    date: 'May 8, 2025',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=600&auto=format&fit=crop',
  },
];

interface Testimonial {
  quote: string;
  author: string;
  location: string;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: '"Amazing ambiance and top-notch service. The reservation system is so convenient!"',
    author: 'Priya S.',
    location: 'Mumbai',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
  },
  {
    quote: '"Found my favorite restaurant near me with great deals. Highly recommended!"',
    author: 'Rahul M.',
    location: 'Bangalore',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
  },
  {
    quote: '"Easy booking, great food and exclusive offers. RestoHub is my go-to platform!"',
    author: 'Anita K.',
    location: 'Delhi',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
  },
];

interface LandingPageProps {
  initialLoginOpen?: boolean;
}

export default function LandingPage({ initialLoginOpen = false }: LandingPageProps) {
  const [loginOpen, setLoginOpen] = useState(initialLoginOpen);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Pizza');
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const handlePrevTestimonial = () => {
    setTestimonialIdx((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNextTestimonial = () => {
    setTestimonialIdx((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-950 font-sans transition-colors">
      
      {/* ──────────────────────────────────────────────────────── */}
      {/* NAVBAR */}
      {/* ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 z-40 transition-colors shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="bg-[#f24e1e] p-2 rounded-full text-white flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/20">
              <span className="material-symbols-outlined text-[20px] font-bold text-white block">restaurant</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white font-sans">
              Resto<span className="text-[#f24e1e]">Hub</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7">
            <a href="#home" className="text-sm font-bold text-[#f24e1e] hover:text-[#d83c0f] font-sans">Home</a>
            <a href="#restaurants" className="text-sm font-bold text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-sans">Restaurants</a>
            <a href="#reservations" className="text-sm font-bold text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-sans">Reservations</a>
            <a href="#order-online" className="text-sm font-bold text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-sans">Order Online</a>
            <a href="#deals" className="text-sm font-bold text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-sans">Deals</a>
            <a href="#blog" className="text-sm font-bold text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-sans">Blog</a>
            <a href="#contact" className="text-sm font-bold text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-sans">Contact Us</a>
          </nav>

          {/* Login Button */}
          <button
            onClick={() => setLoginOpen(true)}
            className="px-5 py-2.5 bg-[#f24e1e] hover:bg-[#d83c0f] text-white rounded-full font-bold text-sm shadow-md shadow-orange-500/10 active:scale-[0.98] transition-all"
          >
            Login / SignUp
          </button>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────── */}
      {/* HERO SECTION */}
      {/* ──────────────────────────────────────────────────────── */}
      <section
        id="home"
        className="relative bg-slate-900 overflow-hidden flex flex-col justify-center min-h-[520px] lg:min-h-[600px] text-white"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.4) 100%), url("/Landing-Hero.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full relative z-10 flex flex-col justify-center h-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] font-sans">
              Find the Restaurant <br />
              <span className="text-[#f24e1e]">near</span> you
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-300 font-medium max-w-lg leading-relaxed">
              Discover the best restaurants, manage reservations, order online and enjoy exclusive deals.
            </p>

            {/* Search Box */}
            <div className="mt-8 flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-4 py-2.5 shadow-lg max-w-md w-full relative group transition-all focus-within:ring-2 focus-within:ring-orange-500/35">
              <Search className="text-slate-400 mr-2 w-5 h-5" />
              <input
                className="bg-transparent border-none focus:ring-0 focus:outline-none text-slate-850 dark:text-white text-sm w-full placeholder:text-slate-400 font-semibold"
                placeholder="Search restaurants, cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search restaurants or cuisines"
              />
              <button
                type="button"
                className="px-4 py-1.5 bg-[#f24e1e] hover:bg-[#d83c0f] text-white text-xs font-bold rounded-full transition-all shrink-0 active:scale-95"
              >
                Search
              </button>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <a
                href="#restaurants"
                className="px-6 py-3 bg-[#f24e1e] hover:bg-[#d83c0f] text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/10 active:scale-[0.98] transition-all flex items-center gap-1.5"
              >
                Explore Restaurants
                <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href="#deals"
                className="px-6 py-3 border border-white/60 hover:bg-white/10 text-white rounded-xl font-bold text-sm active:scale-[0.98] transition-all"
              >
                View Deals
              </a>
            </div>
          </div>
        </div>

        {/* Feature Row Overlay at Bottom */}
        <div className="bg-black/35 backdrop-blur-[2px] border-t border-white/10 py-4 z-10 shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm text-orange-400">calendar_today</span>
              </div>
              <p className="text-xs font-bold tracking-wide uppercase">Easy Reservations</p>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm text-orange-400">verified</span>
              </div>
              <p className="text-xs font-bold tracking-wide uppercase">Verified Restaurants</p>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm text-orange-400">percent</span>
              </div>
              <p className="text-xs font-bold tracking-wide uppercase">Exclusive Deals</p>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm text-orange-400">support_agent</span>
              </div>
              <p className="text-xs font-bold tracking-wide uppercase">24/7 Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────── */}
      {/* TOP RESTAURANTS */}
      {/* ──────────────────────────────────────────────────────── */}
      <section id="restaurants" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white leading-tight">
              Top Restaurants <span className="text-[#f24e1e]">Near You</span>
            </h2>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-1">Explore top-rated restaurants in your area</p>
          </div>
          <a
            href="#restaurants"
            className="hidden sm:flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#f24e1e] hover:text-[#d83c0f] transition-all"
          >
            View All Restaurants →
          </a>
        </div>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOP_RESTAURANTS.map((res) => (
            <div
              key={res.id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="h-44 overflow-hidden relative">
                  <img src={res.image} alt={res.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-green-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-0.5 shadow-sm">
                    <span>{res.rating}</span>
                    <Star className="w-2.5 h-2.5 fill-current" />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-white truncate leading-snug">{res.name}</h3>
                  <p className="text-xs text-slate-450 dark:text-slate-500 font-bold tracking-wide truncate mt-0.5">{res.cuisine}</p>

                  <div className="mt-4 pt-3.5 border-t border-slate-50 dark:border-slate-800/60 space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{res.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{res.time} • {res.priceLevel}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="px-4 pb-4 pt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLoginOpen(true)}
                  className="py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition-all text-center"
                >
                  View Menu
                </button>
                <button
                  type="button"
                  onClick={() => setLoginOpen(true)}
                  className="py-2 bg-[#f24e1e] hover:bg-[#d83c0f] text-white rounded-xl text-xs font-bold transition-all text-center shadow-md shadow-orange-500/5"
                >
                  Book Reservation
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────── */}
      {/* CORE SERVICE VALUE PROPS */}
      {/* ──────────────────────────────────────────────────────── */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm flex items-start gap-4">
            <div className="bg-orange-50 dark:bg-orange-950/20 text-[#f24e1e] p-3 rounded-xl shrink-0">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">Fresh Ingredients</h4>
              <p className="text-[11px] text-slate-450 dark:text-slate-500 font-medium leading-relaxed mt-1">
                We use only the freshest ingredients for authentic and delicious flavors.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm flex items-start gap-4">
            <div className="bg-orange-50 dark:bg-orange-950/20 text-[#f24e1e] p-3 rounded-xl shrink-0">
              <span className="material-symbols-outlined text-[24px]">local_shipping</span>
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">Fast Delivery</h4>
              <p className="text-[11px] text-slate-450 dark:text-slate-500 font-medium leading-relaxed mt-1">
                Get your favorite food delivered hot and fresh to your doorstep.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm flex items-start gap-4">
            <div className="bg-orange-50 dark:bg-orange-950/20 text-[#f24e1e] p-3 rounded-xl shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">Secure Payment</h4>
              <p className="text-[11px] text-slate-450 dark:text-slate-500 font-medium leading-relaxed mt-1">
                105% secure payment options for a smooth and safe experience.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm flex items-start gap-4">
            <div className="bg-orange-50 dark:bg-orange-950/20 text-[#f24e1e] p-3 rounded-xl shrink-0">
              <Headset className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">24/7 Support</h4>
              <p className="text-[11px] text-slate-450 dark:text-slate-500 font-medium leading-relaxed mt-1">
                Our team is always here to help you with anything you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────── */}
      {/* CATEGORIES */}
      {/* ──────────────────────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white leading-tight">Explore by Categories</h2>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-550 font-medium mt-1.5">Explore our wide range of categories</p>
        </div>

        {/* Categories Row */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => setActiveCategory(cat.name)}
                className="flex flex-col items-center gap-2.5 group focus:outline-none"
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-sm border transition-all ${
                    isSelected
                      ? 'bg-[#f24e1e] border-[#f24e1e] text-white scale-105'
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:scale-105 hover:border-orange-500/30'
                  }`}
                >
                  {cat.emoji}
                </div>
                <span
                  className={`text-xs font-bold tracking-wide uppercase transition-colors ${
                    isSelected ? 'text-[#f24e1e]' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────── */}
      {/* TOP DISHES */}
      {/* ──────────────────────────────────────────────────────── */}
      <section className="py-16 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white leading-tight">Our Top Dishes</h2>
              <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-1">Explore our customer favorites</p>
            </div>
            <a
              href="#restaurants"
              className="hidden sm:flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#f24e1e] hover:text-[#d83c0f] transition-all"
            >
              View All Dishes →
            </a>
          </div>

          {/* Dishes Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {TOP_DISHES.map((dish) => (
              <div
                key={dish.id}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="h-32 sm:h-36 overflow-hidden">
                    <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white leading-tight truncate">{dish.name}</h3>
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-current shrink-0" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{dish.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 pt-0 flex items-center justify-between gap-1 mt-1 border-t border-slate-50 dark:border-slate-800/30">
                  <span className="font-extrabold text-sm text-slate-800 dark:text-white">{dish.price}</span>
                  <button
                    type="button"
                    onClick={() => setLoginOpen(true)}
                    className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/20 text-[#f24e1e] rounded-lg text-xs font-bold transition-colors flex items-center gap-0.5 border border-orange-100 dark:border-orange-950"
                  >
                    Add
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────── */}
      {/* OFFERS & DEALS */}
      {/* ──────────────────────────────────────────────────────── */}
      <section id="deals" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white leading-tight">Offers & Deals</h2>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-1">Grab the best discounts from your favorite kitchens</p>
          </div>
          <a
            href="#deals"
            className="hidden sm:flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#f24e1e] hover:text-[#d83c0f] transition-all"
          >
            View All Deals →
          </a>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OFFERS.map((offer) => (
            <div
              key={offer.id}
              className={`border-2 border-dashed rounded-3xl p-5 flex items-center justify-between gap-5 relative overflow-hidden transition-all ${offer.bgColor} ${offer.borderColor}`}
            >
              <div className="flex-1 space-y-1 relative z-10">
                <h3 className="font-extrabold text-lg text-slate-800 dark:text-white tracking-tight">{offer.discount}</h3>
                <p className="text-xs text-slate-450 dark:text-slate-500 font-semibold">{offer.minOrder}</p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 font-mono font-bold text-xs bg-slate-900 text-white rounded-lg select-all shadow-sm">
                    Code: {offer.code}
                  </span>
                </div>
              </div>
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shrink-0 shadow-md ring-4 ring-white/10 relative z-10">
                <img src={offer.image} alt="Deal" className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────── */}
      {/* BLOG SECTION */}
      {/* ──────────────────────────────────────────────────────── */}
      <section id="blog" className="py-16 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white leading-tight">Latest from our Blog</h2>
              <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-1">Industry insights, culture stories, and restaurant tips</p>
            </div>
            <a
              href="#blog"
              className="hidden sm:flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#f24e1e] hover:text-[#d83c0f] transition-all"
            >
              View All Blogs →
            </a>
          </div>

          {/* Blogs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="h-44 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="bg-orange-50 dark:bg-orange-950/20 text-[#f24e1e] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                      {post.category}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-800 dark:text-white leading-snug group-hover:text-[#f24e1e] transition-colors">{post.title}</h3>
                    <p className="text-xs text-slate-450 dark:text-slate-500 leading-relaxed font-medium mt-1.5">{post.desc}</p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-3 border-t border-slate-50 dark:border-slate-800/30 flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────── */}
      {/* TESTIMONIALS */}
      {/* ──────────────────────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white leading-tight">What Our Customers Say</h2>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-medium mt-1">Real feedback from real customers</p>
        </div>

        {/* Desktop grid & Mobile slider hybrid */}
        <div className="relative">
          {/* Desktop Version */}
          <div className="hidden md:grid grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-5 relative">
                <span className="absolute top-4 right-4 text-orange-200 dark:text-slate-800 text-4xl font-serif leading-none select-none">“</span>
                <p className="text-slate-600 dark:text-slate-350 text-xs italic font-medium leading-relaxed pt-2 relative z-10">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3 border-t border-slate-50 dark:border-slate-800/40 pt-4 mt-2">
                  <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-white">{t.author}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Version (Carousel Card) */}
          <div className="block md:hidden max-w-md mx-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-5 min-h-[180px] relative animate-fadeIn">
              <span className="absolute top-4 right-4 text-orange-200 dark:text-slate-800 text-4xl font-serif leading-none select-none">“</span>
              <p className="text-slate-600 dark:text-slate-350 text-xs italic font-medium leading-relaxed pt-2 relative z-10">
                {TESTIMONIALS[testimonialIdx].quote}
              </p>
              <div className="flex items-center gap-3 border-t border-slate-50 dark:border-slate-800/40 pt-4 mt-2">
                <img src={TESTIMONIALS[testimonialIdx].avatar} alt={TESTIMONIALS[testimonialIdx].author} className="w-10 h-10 rounded-full object-cover shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-white">{TESTIMONIALS[testimonialIdx].author}</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">{TESTIMONIALS[testimonialIdx].location}</p>
                </div>
              </div>
            </div>

            {/* Slider Navigation Controls */}
            <div className="flex items-center justify-between mt-6 px-4">
              <button
                type="button"
                onClick={handlePrevTestimonial}
                className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[#f24e1e] flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                title="Previous Testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1.5">
                {TESTIMONIALS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTestimonialIdx(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      testimonialIdx === idx ? 'bg-[#f24e1e] w-4' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                    title={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNextTestimonial}
                className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[#f24e1e] flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                title="Next Testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────── */}
      {/* FOOTER */}
      {/* ──────────────────────────────────────────────────────── */}
      <footer id="contact" className="bg-slate-900 dark:bg-slate-950 text-slate-400 border-t border-slate-800 pt-16 pb-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-[#f24e1e] p-2 rounded-full text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] font-bold text-white block">restaurant</span>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                Resto<span className="text-[#f24e1e]">Hub</span>
              </span>
            </div>
            <p className="text-xs text-slate-450 leading-relaxed font-medium max-w-sm">
              Empowering restaurants and food businesses with smart automation and growth solutions.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-3">
              <a href="https://facebook.com" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#f24e1e] text-slate-300 hover:text-white flex items-center justify-center transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#f24e1e] text-slate-300 hover:text-white flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#f24e1e] text-slate-300 hover:text-white flex items-center justify-center transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#f24e1e] text-slate-300 hover:text-white flex items-center justify-center transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Company Col */}
          <div className="space-y-3.5">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#how" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Solutions Col */}
          <div className="space-y-3.5">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Solutions</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><a href="#pos" className="hover:text-white transition-colors">Restaurant POS</a></li>
              <li><a href="#order" className="hover:text-white transition-colors">Online Ordering</a></li>
              <li><a href="#res" className="hover:text-white transition-colors">Reservations</a></li>
              <li><a href="#inv" className="hover:text-white transition-colors">Inventory Management</a></li>
              <li><a href="#analytics" className="hover:text-white transition-colors">Analytics & Reports</a></li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className="space-y-3.5">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Newsletter</h4>
            <p className="text-[11px] leading-relaxed">Subscribe to get updates on new features and offers.</p>
            <div className="pt-1 flex items-center bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 shadow-inner focus-within:ring-2 focus-within:ring-orange-500/20 max-w-sm">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent border-none focus:ring-0 focus:outline-none text-white text-xs w-full placeholder:text-slate-500"
                aria-label="Email address for newsletter"
              />
              <button
                type="button"
                className="text-[#f24e1e] hover:text-[#d83c0f] transition-colors p-1"
                aria-label="Subscribe to newsletter"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-850 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium text-slate-500">
          <span>© 2025 RestoHub. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-slate-400">Privacy Policy</a>
            <span className="text-slate-800">|</span>
            <a href="#terms" className="hover:text-slate-400">Terms & Conditions</a>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
