import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingHeader from "../components/landing/LandingHeader";
import LandingHero from "../components/landing/LandingHero";
import LandingRestaurants from "../components/landing/LandingRestaurants";
import LandingDishes from "../components/landing/LandingDishes";
import LandingOffers from "../components/landing/LandingOffers";
import LandingBlogs from "../components/landing/LandingBlogs";
import LandingTestimonials from "../components/landing/LandingTestimonials";
import LandingFooter from "../components/landing/LandingFooter";

type LandingPageProps = {
  initialLoginOpen?: boolean;
};

export default function LandingPage({ initialLoginOpen = false }: LandingPageProps): JSX.Element {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const handleActionClick = () => {
    navigate("/auth/customer");
  };

  const handleSearchSubmit = () => {
    // Scroll smoothly to restaurants section when search is submitted
    const element = document.getElementById("restaurants");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen text-slate-800 bg-white font-sans transition-colors relative">
      {/* Navbar header */}
      <LandingHeader onLoginClick={() => navigate("/auth/customer")} />

      {/* Hero section */}
      <LandingHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        locationQuery={locationQuery}
        setLocationQuery={setLocationQuery}
        onSearch={handleSearchSubmit}
      />

      {/* Top Restaurants Section */}
      <LandingRestaurants
        searchQuery={searchQuery}
        locationQuery={locationQuery}
        onActionClick={handleActionClick}
      />

      {/* Top Dishes Section */}
      <LandingDishes
        searchQuery={searchQuery}
        onActionClick={handleActionClick}
      />

      {/* Promo Offers Section */}
      <LandingOffers />

      {/* Blogs Section */}
      <LandingBlogs />

      {/* Testimonials Reviews Section */}
      <LandingTestimonials />

      {/* Main Footer */}
      <LandingFooter />
    </div>
  );
}
