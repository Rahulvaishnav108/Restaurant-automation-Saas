import { useState, useEffect, useMemo } from "react";
import { restaurantData } from "../store/Restaurants";
import type { RestaurantsRow, StatusFilter, NewRestaurantForm } from "../components/Restaurants/Restauranttypes";

import MetricCards from "../components/Restaurants/Metriccards";
import FilterBar from "../components/Restaurants/Filterbar";
import RestaurantTable from "../components/Restaurants/RestaurantTable"; 
import ViewModal from "../components/Restaurants/Viewmodal";
import AddRestaurantModal from "../components/Restaurants/AddRestaurantModal";

const DEFAULT_FORM: NewRestaurantForm = {
  name: "",
  owner: "",
  email: "",
  phone: "",
  location: "",
  plan: "Basic",
  status: "Trial",
  revenue: "$0",
  branches: 1,
};

export default function Restaurant() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      return saved ? saved === "dark" : true;
    }
    return true;
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [restaurants, setRestaurants] = useState<RestaurantsRow[]>(restaurantData);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [viewingRestaurant, setViewingRestaurant] = useState<RestaurantsRow | null>(null);
  const [newRestaurant, setNewRestaurant] = useState<NewRestaurantForm>(DEFAULT_FORM);

  // Sync dark mode from parent
  useEffect(() => {
    const handleThemeSync = (e: Event) => {
      const custom = e as CustomEvent<{ darkMode: boolean }>;
      if (custom.detail !== undefined) setDarkMode(custom.detail.darkMode);
    };
    window.addEventListener("sync-app-theme", handleThemeSync);
    return () => window.removeEventListener("sync-app-theme", handleThemeSync);
  }, []);

  // Escape key closes everything
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
        setViewingRestaurant(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const metrics = useMemo(() => ({
    total: restaurants.length,
    active: restaurants.filter((r) => r.status === "Active").length,
    trial: restaurants.filter((r) => r.status === "Trial").length,
    branches: restaurants.reduce((acc, r) => acc + r.branches, 0),
  }), [restaurants]);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((item) => {
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.owner.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [restaurants, searchQuery, statusFilter]);

  const updateStatus = (id: string, status: "Active" | "Trial" | "Inactive") =>
    setRestaurants((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

  const updatePlan = (id: string, plan: "Premium" | "Standard" | "Basic") =>
    setRestaurants((prev) => prev.map((r) => (r.id === id ? { ...r, plan } : r)));

  const deleteRestaurant = (id: string) =>
    setRestaurants((prev) => prev.filter((r) => r.id !== id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestaurant.name || !newRestaurant.owner) return;

    const row: RestaurantsRow = {
      id: `RST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newRestaurant.name,
      owner: newRestaurant.owner,
      email: newRestaurant.email || "info@restaurant.com",
      phone: newRestaurant.phone || "+1 (555) 000-0000",
      location: newRestaurant.location || "Remote Deployment Location",
      plan: newRestaurant.plan,
      status: newRestaurant.status,
      revenue: newRestaurant.revenue.startsWith("$")
        ? newRestaurant.revenue
        : `$${newRestaurant.revenue}`,
      branches: Number(newRestaurant.branches) || 1,
    };

    setRestaurants((prev) => [row, ...prev]);
    setIsModalOpen(false);
    setNewRestaurant(DEFAULT_FORM);
  };

  return (
    <div className={`min-h-screen px-6 py-8 transition-colors duration-300 ${
      darkMode ? "bg-[#020817] text-slate-100" : "bg-[#F8FAFC] text-slate-800"
    }`}>

      <MetricCards
        metrics={metrics}
        statusFilter={statusFilter}
        darkMode={darkMode}
        onFilterChange={setStatusFilter}
      />

      <FilterBar
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        darkMode={darkMode}
        onSearchChange={setSearchQuery}
        onResetFilter={() => setStatusFilter("All")}
        onAddClick={() => setIsModalOpen(true)}
      />

      <RestaurantTable
        restaurants={filteredRestaurants}
        darkMode={darkMode}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onView={setViewingRestaurant}
        onUpdateStatus={updateStatus}
        onUpdatePlan={updatePlan}
        onDelete={deleteRestaurant}
        onResetFilters={() => { setSearchQuery(""); setStatusFilter("All"); }}
      />

      {viewingRestaurant && (
        <ViewModal
          restaurant={viewingRestaurant}
          darkMode={darkMode}
          onClose={() => setViewingRestaurant(null)}
        />
      )}

      {isModalOpen && (
        <AddRestaurantModal
          darkMode={darkMode}
          formData={newRestaurant}
          onChange={(data) => setNewRestaurant((prev) => ({ ...prev, ...data }))}
          onSubmit={handleSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      )}

    </div>
  );
}