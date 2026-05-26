// LandingPage.tsx

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  MoonStar,
  Search,
  ShoppingCart,
  Star,
  SunMedium,
  UtensilsCrossed,
} from "lucide-react";

import { useTheme } from "../../../app/providers/ThemeProvider";
import LoginModal from "../../../auth/components/LoginModal";

// HERO IMAGES
const hero1 =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop";

const hero2 =
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1974&auto=format&fit=crop";

const hero3 =
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2070&auto=format&fit=crop";

type LandingPageProps = {
  initialLoginOpen?: boolean;
};

const heroSlides = [
  {
    image: hero1,
    title: "Find the best restaurants",
    accent: "near you",
    subtitle:
      "Explore top restaurants, check availability, book a table or order instantly.",
  },
  {
    image: hero2,
    title: "Reserve your table",
    accent: "instantly",
    subtitle:
      "Real-time booking, live table availability and smooth dining experience.",
  },
  {
    image: hero3,
    title: "Dining experience",
    accent: "reimagined",
    subtitle:
      "Premium restaurant automation with QR ordering and modern operations.",
  },
];

const categories = [
  { name: "Pizza", icon: "🍕" },
  { name: "Burger", icon: "🍔" },
  { name: "Chinese", icon: "🍜" },
  { name: "Coffee", icon: "☕" },
  { name: "Desserts", icon: "🧁" },
  { name: "North Indian", icon: "🥘" },
];

const restaurants = [
  {
    name: "Burger Barn",
    image: hero1,
    category: "Fast Food, Burgers, American",
    location: "Connaught Place",
  },
  {
    name: "Cafe Heights",
    image: hero2,
    category: "Cafe, Italian, Continental",
    location: "Connaught Place",
  },
  {
    name: "Spice Deck",
    image: hero3,
    category: "Indian, Multi Cuisine",
    location: "Khan Market",
  },
];

const dishes = [
  {
    name: "Beef Cheese Burger",
    price: "₹300",
    restaurant: "Burger King",
    image: hero1,
  },
  {
    name: "Mixed Salad",
    price: "₹600",
    restaurant: "AJAX",
    image: hero2,
  },
  {
    name: "Vegan Chinese",
    price: "₹700",
    restaurant: "AJAX",
    image: hero3,
  },
  {
    name: "Cheesy Pizza",
    price: "₹1200",
    restaurant: "AJAX",
    image: hero1,
  },
];

const blogs = [
  {
    title: "Taste the delicious foods in Asia",
    image: hero1,
  },
  {
    title: "Taste the delicious foods in Asia",
    image: hero2,
  },
  {
    title: "Taste the delicious foods in Asia",
    image: hero3,
  },
];

const testimonials = [
  {
    name: "Burger Kings",
    role: "CUSTOMER",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400",
  },
  {
    name: "Burger Kings",
    role: "CUSTOMER",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400",
  },
  {
    name: "Burger Kings",
    role: "CUSTOMER",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400",
  },
];

export default function LandingPage({
  initialLoginOpen = false,
}: LandingPageProps) {
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();

  const [heroIndex, setHeroIndex] = useState(0);
  const [loginOpen, setLoginOpen] = useState(initialLoginOpen);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const activeHero = heroSlides[heroIndex];

  const navLinks = useMemo(
    () => [
      { label: "Home", path: "/" },
      { label: "Restaurants", path: "/restaurants" },
      { label: "Offers", path: "/offers" },
      { label: "Reservations", path: "/reservations" },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1f1f1f] dark:bg-[#070707] dark:text-white">
      {/* NAVBAR */}

      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-black/70">
        <div className="mx-auto flex max-w-[1450px] items-center justify-between px-6 py-4">
          {/* LOGO */}

          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff9d00] text-white shadow-xl">
              <UtensilsCrossed className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-[30px] font-black leading-none tracking-tight">
                <span className="text-white dark:text-white">Serve</span>
                <span className="text-[#ff9d00]">Sphere</span>
              </h2>

              <p className="text-xs text-neutral-500">
                Restaurant automation SaaS
              </p>
            </div>
          </Link>

          {/* LOCATION */}

          <div className="hidden items-center gap-2 rounded-full border border-black/10 px-4 py-2 dark:border-white/10 lg:flex">
            <MapPin className="h-4 w-4 text-[#ff9d00]" />
            <span className="text-sm">Mumbai, India</span>
          </div>

          {/* NAV */}

          <nav className="hidden items-center gap-10 lg:flex">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="text-sm font-semibold transition hover:text-[#ff9d00]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ACTIONS */}

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 transition hover:border-[#ff9d00] dark:border-white/10"
            >
              {theme === "dark" ? (
                <SunMedium className="h-5 w-5" />
              ) : (
                <MoonStar className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={() => setLoginOpen(true)}
              className="rounded-full bg-[#ff9d00] px-6 py-3 text-sm font-bold text-white transition hover:scale-[1.02]"
            >
              Login / Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}

      <main className="mx-auto max-w-[1450px] px-4 pb-20 pt-4">
        {/* HERO */}

        <section className="relative overflow-hidden rounded-[34px]">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{
              backgroundImage: `url(${activeHero.image})`,
            }}
          />

          <div className="absolute inset-0 bg-black/55" />

          <div className="relative flex min-h-[720px] flex-col items-center justify-center px-6 text-center text-white">
            <h1 className="max-w-4xl font-display text-6xl leading-[0.9] tracking-[-0.04em] md:text-8xl">
              {activeHero.title}{" "}
              <span className="italic text-[#ff9d00]">
                {activeHero.accent}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-xl text-white/90">
              {activeHero.subtitle}
            </p>

            {/* SEARCH */}

            <div className="mt-10 flex w-full max-w-4xl items-center overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex flex-1 items-center gap-3 px-5">
                <Search className="h-5 w-5 text-[#ff9d00]" />

                <input
                  type="text"
                  placeholder="Search restaurants, cuisines, or dishes..."
                  className="h-16 w-full bg-transparent text-black outline-none"
                />
              </div>

              <button className="m-2 rounded-xl bg-[#ff9d00] px-8 py-4 font-semibold text-white transition hover:bg-[#f08f00]">
                Search
              </button>
            </div>

            {/* STATS */}

            <div className="mt-7 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#ff9d00]" />
                24 Restaurants Nearby
              </div>

              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-[#ff9d00] text-[#ff9d00]" />
                4.5+ Avg Ratings
              </div>

              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-[#ff9d00]" />
                Live Availability
              </div>
            </div>

            {/* SLIDER BUTTONS */}

            <div className="absolute bottom-10 right-10 flex gap-3">
              <button
                onClick={() =>
                  setHeroIndex(
                    (prev) =>
                      (prev - 1 + heroSlides.length) % heroSlides.length,
                  )
                }
                className="rounded-full bg-white/10 p-3 backdrop-blur-xl transition hover:bg-white/20"
              >
                <ChevronLeft />
              </button>

              <button
                onClick={() =>
                  setHeroIndex((prev) => (prev + 1) % heroSlides.length)
                }
                className="rounded-full bg-white/10 p-3 backdrop-blur-xl transition hover:bg-white/20"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </section>

        {/* FILTERS */}

        <section className="mt-16">
          <SectionTitle title="Find Your Perfect Spot" />

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              {[
                "All",
                "Fine Dining",
                "Cafe",
                "Fast Food",
                "Italian",
                "Veg",
                "Non Veg",
                "More",
              ].map((item, idx) => (
                <button
                  key={item}
                  className={`rounded-xl border px-5 py-2 text-sm font-medium transition ${
                    idx === 0
                      ? "border-[#ff9d00] bg-[#ff9d00] text-white"
                      : "border-black/10 bg-white hover:border-[#ff9d00] dark:border-white/10 dark:bg-[#101010]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <button className="rounded-xl border border-black/10 bg-white px-5 py-2 text-sm dark:border-white/10 dark:bg-[#101010]">
              Sort by: Popular
            </button>
          </div>
        </section>

        {/* CATEGORIES */}

        <section className="mt-20">
          <SectionTitle title="Explore by Categories" />

          <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((item) => (
              <button
                key={item.name}
                className="group rounded-[26px] border border-black/10 bg-white p-7 transition hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-[#101010]"
              >
                <div className="mb-4 text-6xl transition group-hover:scale-110">
                  {item.icon}
                </div>

                <div className="text-lg font-semibold">{item.name}</div>
              </button>
            ))}
          </div>
        </section>

        {/* RESTAURANTS */}

        <section className="mt-20">
          <SectionTitle
            title="Top Restaurants Near You"
            subtitle="Handpicked restaurants for the best dining experience"
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {restaurants.map((item) => (
              <article
                key={item.name}
                className="overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-xl transition hover:-translate-y-1 dark:border-white/10 dark:bg-[#101010]"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-56 w-full object-cover"
                  />

                  <div className="absolute left-4 top-4 rounded-full bg-[#5d8f2a] px-4 py-1 text-xs font-semibold text-white">
                    8 Tables Available
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold">{item.name}</h3>

                      <p className="mt-1 text-sm text-neutral-500">
                        {item.category}
                      </p>

                      <p className="text-sm text-neutral-500">
                        {item.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-sm font-semibold">
                      <Star className="h-4 w-4 fill-[#ff9d00] text-[#ff9d00]" />
                      4.3
                    </div>
                  </div>

                  <div className="flex items-center gap-5 text-sm text-neutral-500">
                    <span>🕒 15-30 mins</span>
                    <span>📍 0.5 km away</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="rounded-full bg-[#f4f8ec] px-4 py-2 text-sm font-medium text-[#5d8f2a]">
                      Flat 15% OFF
                    </div>

                    <button
                      onClick={() => navigate("/restaurants")}
                      className="rounded-xl bg-[#ff9d00] px-5 py-2 text-sm font-semibold text-white"
                    >
                      View Menu
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* TRENDING */}

        <section className="mt-20">
          <SectionTitle title="Trending Dishes" />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dishes.map((dish) => (
              <article
                key={dish.name}
                className="rounded-[28px] border border-black/10 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-[#101010]"
              >
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="h-48 w-full object-cover"
                  />

                  <button className="absolute right-3 top-3 rounded-full bg-white/80 p-2 backdrop-blur-xl dark:bg-black/60">
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5">
                  <h3 className="text-2xl font-semibold">{dish.name}</h3>

                  <p className="mt-1 text-sm text-neutral-500">
                    With Special Sauce
                  </p>

                  <div className="mt-3 text-sm font-semibold text-[#ff9d00]">
                    {dish.restaurant}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-neutral-500">
                      ★ 4.3(645)
                    </div>

                    <div className="text-3xl font-black text-[#ff9d00]">
                      {dish.price}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* BLOG */}

        <section className="mt-20">
          <SectionTitle title="Blog" />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {blogs.map((blog) => (
              <article
                key={blog.title}
                className="overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-xl dark:border-white/10 dark:bg-[#101010]"
              >
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="h-56 w-full object-cover"
                />

                <div className="p-5">
                  <div className="text-xs text-neutral-500">
                    Sept. 06, 2026
                  </div>

                  <h3 className="mt-3 text-2xl font-semibold">
                    {blog.title}
                  </h3>

                  <button className="mt-5 text-sm font-semibold text-[#ff9d00]">
                    Read more
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}

        <section className="mt-20">
          <SectionTitle title="What customers says?" />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {testimonials.map((item) => (
              <article
                key={item.image}
                className="rounded-[30px] border border-black/10 bg-white p-8 text-center shadow-xl dark:border-white/10 dark:bg-[#101010]"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="mx-auto h-24 w-24 rounded-full object-cover"
                />

                <p className="mt-6 leading-8 text-neutral-500">
                  Far far away, behind the word mountains, far from the
                  countries Vokalia and Consonantia, there live the blind texts.
                </p>

                <div className="mt-6 text-2xl font-bold text-[#ff9d00]">
                  {item.name}
                </div>

                <div className="mt-1 text-xs tracking-[0.3em] text-neutral-500">
                  {item.role}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* FOOTER */}

        <footer className="mt-24 rounded-[32px] border border-black/10 bg-white p-10 shadow-xl dark:border-white/10 dark:bg-[#101010]">
          <div className="grid gap-10 lg:grid-cols-4">
            <div>
              <div className="text-5xl font-black">
                <span>Serve</span>
                <span className="text-[#ff9d00]">Sphere</span>
              </div>

              <p className="mt-5 text-sm leading-7 text-neutral-500">
                Explore top restaurants around you and enjoy modern dining
                without the hassle.
              </p>
            </div>

            <FooterColumn
              title="Quick Links"
              links={[
                { label: "Home", to: "/" },
                { label: "Restaurants", to: "/restaurants" },
                { label: "Reservations", to: "/reservations" },
                { label: "Offers", to: "/offers" },
              ]}
            />

            <FooterColumn
              title="Support"
              links={[
                { label: "Help Center", to: "/help" },
                { label: "Contact", to: "/contact" },
                { label: "FAQs", to: "/faqs" },
                { label: "Privacy Policy", to: "/privacy" },
              ]}
            />

            <FooterColumn
              title="For Restaurants"
              links={[
                { label: "Partner With Us", to: "/partner" },
                { label: "Restaurant Login", to: "/login" },
                { label: "Business Solutions", to: "/business" },
                { label: "Pricing", to: "/pricing" },
              ]}
            />
          </div>

          <div className="mt-10 border-t border-black/10 pt-6 text-sm text-neutral-500 dark:border-white/10">
            © 2026 ServeSphere. All rights reserved.
          </div>
        </footer>
      </main>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
      />
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center">
      <h2 className="font-display text-5xl tracking-tight">{title}</h2>

      {subtitle && (
        <p className="mt-3 text-neutral-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string }[];
}) {
  return (
    <div>
      <h3 className="mb-5 text-lg font-bold">{title}</h3>

      <div className="space-y-4">
        {links.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex items-center gap-2 text-neutral-500 transition hover:text-[#ff9d00]"
          >
            {item.label}

            <ArrowRight className="h-4 w-4" />
          </Link>
        ))}
      </div>
    </div>
  );
}