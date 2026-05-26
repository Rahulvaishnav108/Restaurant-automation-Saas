import React, { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Star,
  Clock3,
  Moon,
  Sun,
  ShoppingCart,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

import LoginModal from "../../../auth/components/LoginModal";
import { useTheme } from "../../../app/providers/ThemeProvider";

type LandingPageProps = {
  onEnterApp?: () => void;
  initialLoginOpen?: boolean;
};

const categories = [
  "All",
  "Fine Dining",
  "Cafe",
  "Fast Food",
  "Italian",
  "Veg",
  "Non Veg",
];

const topRestaurants = [
  {
    id: 1,
    name: "Burger Barn",
    cuisine: "Fast Food • Burgers • American",
    location: "Connaught Place",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop",
    time: "5-10 mins",
    distance: "0.6 km",
    rating: 4.3,
    tables: 15,
  },
  {
    id: 2,
    name: "Cafe Heights",
    cuisine: "Cafe • Italian • Continental",
    location: "Connaught Place",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1600&auto=format&fit=crop",
    time: "15-30 mins",
    distance: "0.5 km",
    rating: 4.6,
    tables: 8,
  },
  {
    id: 3,
    name: "Olive Kitchen",
    cuisine: "Mediterranean • Vegan",
    location: "Bandra West",
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1600&auto=format&fit=crop",
    time: "10-15 mins",
    distance: "0.8 km",
    rating: 4.5,
    tables: 6,
  },
];

const trendingDishes = [
  {
    name: "Beef Cheese Burger",
    restaurant: "Burger King",
    price: "₹300",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Mixed Salad",
    restaurant: "AJAX",
    price: "₹600",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Vegan Chinese",
    restaurant: "AJAX",
    price: "₹700",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Cheesy Pizza",
    restaurant: "AJAX",
    price: "₹1200",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
  },
];

const offers = [
  {
    title: "FLAT 20% OFF",
    subtitle: "On Min Order ₹199",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "FLAT 20% OFF",
    subtitle: "On Min Order ₹199",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "FLAT 20% OFF",
    subtitle: "On Min Order ₹199",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function LandingPage({
  onEnterApp,
  initialLoginOpen = false,
}: LandingPageProps): JSX.Element {
  const { theme, toggleTheme } = useTheme();

  const [openLogin, setOpenLogin] = useState(initialLoginOpen);

  const [mobileMenu, setMobileMenu] = useState(false);

  const heroBackground = useMemo(
    () =>
      theme === "dark"
        ? "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2000&auto=format&fit=crop"
        : "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2000&auto=format&fit=crop",
    [theme]
  );

  return (
    <>
      <div className="min-h-screen overflow-hidden bg-background text-foreground">
        {/* NAVBAR */}

        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/75 backdrop-blur-xl">
          <div className="container flex h-20 items-center justify-between">
            <div className="flex items-center gap-10">
              <button className="font-display text-4xl font-semibold">
                <span className="text-foreground">Serve</span>
                <span className="text-primary">Sphere</span>
              </button>

              <nav className="hidden items-center gap-8 lg:flex">
                <a
                  href="/"
                  className="text-sm font-medium transition hover:text-primary"
                >
                  Home
                </a>

                <a
                  href="/restaurants"
                  className="text-sm font-medium text-muted-foreground transition hover:text-primary"
                >
                  Restaurants
                </a>

                <a
                  href="/offers"
                  className="text-sm font-medium text-muted-foreground transition hover:text-primary"
                >
                  Offers
                </a>

                <a
                  href="/reservations"
                  className="text-sm font-medium text-muted-foreground transition hover:text-primary"
                >
                  Reservations
                </a>
              </nav>
            </div>

            <div className="hidden items-center gap-4 lg:flex">
              <button
                onClick={toggleTheme}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card transition hover:border-primary"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              <button
                onClick={() => setOpenLogin(true)}
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Login / Sign Up
              </button>
            </div>

            <button
              onClick={() => setMobileMenu((prev) => !prev)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border lg:hidden"
            >
              {mobileMenu ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </header>

        {/* HERO */}

        <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-32">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroBackground})`,
            }}
          />

          <div className="absolute inset-0 bg-black/60" />

          <div className="container relative z-10">
            <div className="mx-auto max-w-5xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm text-white backdrop-blur-xl">
                <MapPin className="h-4 w-4 text-primary" />
                Mumbai, India
              </div>

              <h1 className="font-display text-6xl leading-[1] text-white md:text-8xl">
                Find the best
                <br />
                restaurants{" "}
                <span className="text-primary">near you</span>
              </h1>

              <p className="mx-auto mt-8 max-w-2xl text-lg text-white/80 md:text-xl">
                Explore top restaurants, check availability,
                book a table or order instantly.
              </p>

              {/* SEARCH */}

              <div className="mx-auto mt-12 flex max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur-2xl">
                <div className="flex flex-1 items-center gap-3 px-6">
                  <Search className="h-5 w-5 text-primary" />

                  <input
                    type="text"
                    placeholder="Search restaurants, cuisines, or dishes..."
                    className="h-16 w-full bg-transparent text-white outline-none placeholder:text-white/60"
                  />
                </div>

                <button className="m-2 rounded-2xl bg-primary px-8 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                  Search
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  24 Restaurants Nearby
                </div>

                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  4.5+ Avg Ratings
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-primary" />
                  Live Availability
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}

        <section className="container py-24">
          <div className="text-center">
            <h2 className="font-display text-5xl">
              Find Your Perfect Spot
            </h2>

            <p className="mt-4 text-muted-foreground">
              Explore curated dining experiences
            </p>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium transition hover:border-primary hover:text-primary"
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* RESTAURANTS */}

        <section className="container pb-24">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="font-display text-5xl">
                Top Restaurants Near You
              </h2>

              <p className="mt-4 text-muted-foreground">
                Handpicked restaurants for the best experience
              </p>
            </div>

            <button className="hidden items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium transition hover:border-primary lg:flex">
              View All
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {topRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="overflow-hidden rounded-[28px] border border-border bg-card soft-shadow transition hover:-translate-y-1"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute left-4 top-4 rounded-full bg-green-500 px-4 py-2 text-xs font-semibold text-white">
                    {restaurant.tables} Tables Available
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-3xl">
                        {restaurant.name}
                      </h3>

                      <p className="mt-2 text-sm text-muted-foreground">
                        {restaurant.cuisine}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {restaurant.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                      <Star className="h-4 w-4 fill-primary" />
                      {restaurant.rating}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock3 className="h-4 w-4" />
                        {restaurant.time}
                      </div>

                      <div>{restaurant.distance}</div>
                    </div>

                    <button
                      onClick={onEnterApp}
                      className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
                    >
                      View Menu
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TRENDING */}

        <section className="container pb-24">
          <div className="mb-12">
            <h2 className="font-display text-5xl">
              Trending Dishes
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trendingDishes.map((dish) => (
              <div
                key={dish.name}
                className="overflow-hidden rounded-[28px] border border-border bg-card p-5 soft-shadow"
              >
                <div className="relative">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="h-56 w-full rounded-2xl object-cover"
                  />

                  <button className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 backdrop-blur">
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5">
                  <h3 className="font-display text-3xl">
                    {dish.name}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {dish.restaurant}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">
                      {dish.price}
                    </div>

                    <button className="rounded-full border border-border px-4 py-2 text-sm font-medium">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* OFFERS */}

        <section className="container pb-24">
          <div className="mb-12">
            <h2 className="font-display text-5xl">
              Offers & Deals
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {offers.map((offer) => (
              <div
                key={offer.image}
                className="relative overflow-hidden rounded-[32px] border border-border"
              >
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="h-72 w-full object-cover"
                />

                <div className="absolute inset-0 bg-black/45" />

                <div className="absolute inset-0 p-8 text-white">
                  <div className="text-5xl font-bold leading-tight">
                    {offer.title}
                  </div>

                  <div className="mt-4 text-lg">
                    {offer.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}

        <footer className="border-t border-border py-16">
          <div className="container grid gap-12 lg:grid-cols-4">
            <div>
              <div className="font-display text-5xl">
                <span>Serve</span>
                <span className="text-primary">Sphere</span>
              </div>

              <p className="mt-6 max-w-sm text-muted-foreground">
                Explore top restaurants around you, enjoy
                real-time availability and modern dining
                without the hassle.
              </p>
            </div>

            <div>
              <h4 className="mb-6 text-lg font-semibold">
                Quick Links
              </h4>

              <div className="space-y-4 text-muted-foreground">
                <a href="/" className="block hover:text-primary">
                  Home
                </a>

                <a
                  href="/restaurants"
                  className="block hover:text-primary"
                >
                  Restaurants
                </a>

                <a
                  href="/offers"
                  className="block hover:text-primary"
                >
                  Offers
                </a>

                <a
                  href="/reservations"
                  className="block hover:text-primary"
                >
                  Reservations
                </a>
              </div>
            </div>

            <div>
              <h4 className="mb-6 text-lg font-semibold">
                Support
              </h4>

              <div className="space-y-4 text-muted-foreground">
                <a href="/" className="block hover:text-primary">
                  Help Center
                </a>

                <a href="/" className="block hover:text-primary">
                  Contact Us
                </a>

                <a href="/" className="block hover:text-primary">
                  Privacy Policy
                </a>

                <a href="/" className="block hover:text-primary">
                  Terms & Conditions
                </a>
              </div>
            </div>

            <div>
              <h4 className="mb-6 text-lg font-semibold">
                For Restaurants
              </h4>

              <div className="space-y-4 text-muted-foreground">
                <a href="/" className="block hover:text-primary">
                  Partner With Us
                </a>

                <a href="/" className="block hover:text-primary">
                  Restaurant Login
                </a>

                <a href="/" className="block hover:text-primary">
                  Business Solutions
                </a>

                <a href="/" className="block hover:text-primary">
                  Pricing
                </a>
              </div>
            </div>
          </div>

          <div className="container mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground lg:flex-row">
            <div>
              © 2026 ServeSphere. All rights reserved.
            </div>

            <div className="flex items-center gap-6">
              <a href="/">Privacy Policy</a>
              <a href="/">Terms & Conditions</a>
            </div>
          </div>
        </footer>
      </div>

      <LoginModal
        open={openLogin}
        onClose={() => setOpenLogin(false)}
      />
    </>
  );
}