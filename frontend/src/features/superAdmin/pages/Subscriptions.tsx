import { useState, useEffect, useMemo } from "react";
import {
  restaurantData,
  type RestaurantsRow,
} from "../store/Restaurants";
import { 
  Search, 
  Eye, 
  Edit2, 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin,
  SlidersHorizontal,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
  Plus,
  Package,
  Zap,
  Crown,
  Building2,
  BarChart3,
  ArrowUpRight
} from "lucide-react";

type StatusFilter = "All" | "Active" | "Trial" | "Inactive";
type TierFilter = "All" | "Basic" | "Standard" | "Premium" | "Enterprise";
type PlanType = "Premium" | "Standard" | "Basic" | "Enterprise";
type StatusType = "Active" | "Trial" | "Inactive";

export default function AdvancedRestaurantDashboard() {
  // Theme state synchronization
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme ? savedTheme === "dark" : true;
    }
    return true;
  });

  // Interactive Query and Filtering States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [tierFilter, setTierFilter] = useState<TierFilter>("All");
  const [activeActionRow, setActiveActionRow] = useState<string | null>(null);
  
  // Live State Array Handler with Type Assertion to accommodate Enterprise tier
  const [restaurants, setRestaurants] = useState<RestaurantsRow[]>(restaurantData as RestaurantsRow[]);

  // Modal view states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    owner: "",
    email: "",
    phone: "",
    location: "",
    plan: "Basic" as PlanType,
    status: "Trial" as StatusType,
    revenue: "$0",
    branches: 1
  });

  // Track global theme triggers
  useEffect(() => {
    const handleThemeSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ darkMode: boolean }>;
      if (customEvent.detail !== undefined) {
        setDarkMode(customEvent.detail.darkMode);
      }
    };
    window.addEventListener("sync-app-theme", handleThemeSync);
    return () => window.removeEventListener("sync-app-theme", handleThemeSync);
  }, []);

  // Compute live breakdown analytics mapping
  const tierMetrics = useMemo(() => {
    const calculateMetrics = (planName: string) => {
      const subset = restaurants.filter(r => String(r.plan).toLowerCase() === planName.toLowerCase());
      const rawRevenue = subset.reduce((acc, curr) => {
        const num = parseInt(curr.revenue.replace(/[^0-9]/g, ""), 10);
        return acc + (isNaN(num) ? 0 : num);
      }, 0);
      return {
        count: subset.length,
        revenue: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(rawRevenue)
      };
    };

    return {
      basic: calculateMetrics("Basic"),
      standard: calculateMetrics("Standard"),
      premium: calculateMetrics("Premium"),
      enterprise: calculateMetrics("Enterprise"),
      totalRevenue: restaurants.reduce((acc, curr) => {
        const num = parseInt(curr.revenue.replace(/[^0-9]/g, ""), 10);
        return acc + (isNaN(num) ? 0 : num);
      }, 0)
    };
  }, [restaurants]);

  // Combined Multi-parameter Search Filter Pipeline
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((item) => {
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      const matchesTier = tierFilter === "All" || String(item.plan).toLowerCase() === tierFilter.toLowerCase();
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesTier && matchesSearch;
    });
  }, [restaurants, searchQuery, statusFilter, tierFilter]);

  // In-line Data Handlers
  const updateRestaurantStatus = (id: string, newStatus: StatusType) => {
    setRestaurants(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    setActiveActionRow(null);
  };

  const updateRestaurantPlan = (id: string, newPlan: PlanType) => {
    setRestaurants(prev => prev.map(r => r.id === id ? { ...r, plan: newPlan as unknown as RestaurantsRow["plan"] } : r));
    setActiveActionRow(null);
  };

  const handleAddRestaurantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestaurant.name || !newRestaurant.owner) return;

    const generatedRow = {
      id: `RST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newRestaurant.name,
      owner: newRestaurant.owner,
      email: newRestaurant.email || "info@restaurant.com",
      phone: newRestaurant.phone || "+1 (555) 000-0000",
      location: newRestaurant.location || "Default Regional Hub",
      plan: newRestaurant.plan as unknown as RestaurantsRow["plan"],
      status: newRestaurant.status,
      revenue: newRestaurant.revenue.startsWith("$") ? newRestaurant.revenue : `$${newRestaurant.revenue}`,
      branches: Number(newRestaurant.branches) || 1
    };

    setRestaurants(prev => [generatedRow, ...prev] as RestaurantsRow[]);
    setIsModalOpen(false);
    setNewRestaurant({
      name: "", owner: "", email: "", phone: "", location: "",
      plan: "Basic", status: "Trial", revenue: "$0", branches: 1
    });
  };

  return (
    <div className={`min-h-screen px-6 py-8 transition-colors duration-300 ${
      darkMode ? "bg-[#020817] text-slate-100" : "bg-[#F8FAFC] text-slate-800"
    }`}>
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-2xl font-extrabold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
            SUBSCRIPTIONS
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Real-time control node handling pricing matrices, usage monitoring parameters, and client operations.
          </p>
        </div>
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-xs font-semibold ${
          darkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <BarChart3 className="text-orange-500 w-4 h-4" />
          <span>Total Platform Flow:</span>
          <span className="text-emerald-500 font-bold text-sm">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(tierMetrics.totalRevenue)}
          </span>
        </div>
      </div>

      {/* TIER SUBSCRIPTION GRID CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        {/* BASIC TIER CARD */}
        <div 
          role="button"
          tabIndex={0}
          onClick={() => setTierFilter(tierFilter === "Basic" ? "All" : "Basic")}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setTierFilter(tierFilter === "Basic" ? "All" : "Basic"); } }}
          className={`cursor-pointer group relative rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.01] ${
            tierFilter === "Basic" ? "ring-2 ring-orange-500 bg-orange-500/5" : ""
          } ${darkMode ? "bg-slate-900/40 border-slate-800/80 hover:border-slate-700" : "bg-white border-slate-200/80 hover:shadow-lg"}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2.5 rounded-xl ${darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
              <Package size={20} />
            </div>
            <span className="text-xs font-bold text-orange-500 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              Filter <ArrowUpRight size={14} />
            </span>
          </div>
          <p className={`text-sm font-bold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Basic Plan</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-2xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>$299</span>
            <span className="text-xs text-slate-500">/month</span>
          </div>
          <div className={`mt-4 pt-4 border-t space-y-2 text-xs ${darkMode ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}>
            <div className="flex justify-between"><span>Subscribers:</span><span className="font-bold text-slate-400">{tierMetrics.basic.count} nodes</span></div>
            <div className="flex justify-between"><span>Est. Revenue:</span><span className="font-bold text-emerald-500">{tierMetrics.basic.revenue}</span></div>
          </div>
        </div>

        {/* STANDARD TIER CARD */}
        <div 
          role="button"
          tabIndex={0}
          onClick={() => setTierFilter(tierFilter === "Standard" ? "All" : "Standard")}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setTierFilter(tierFilter === "Standard" ? "All" : "Standard"); } }}
          className={`cursor-pointer group relative rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.01] ${
            tierFilter === "Standard" ? "ring-2 ring-blue-500 bg-blue-500/5" : ""
          } ${darkMode ? "bg-slate-900/40 border-slate-800/80 hover:border-slate-700" : "bg-white border-slate-200/80 hover:shadow-lg"}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2.5 rounded-xl ${darkMode ? "bg-blue-50/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
              <Zap size={20} />
            </div>
            <span className="text-xs font-bold text-blue-500 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              Filter <ArrowUpRight size={14} />
            </span>
          </div>
          <p className={`text-sm font-bold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Standard Plan</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-2xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>$599</span>
            <span className="text-xs text-slate-500">/month</span>
          </div>
          <div className={`mt-4 pt-4 border-t space-y-2 text-xs ${darkMode ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}>
            <div className="flex justify-between"><span>Subscribers:</span><span className="font-bold text-slate-400">{tierMetrics.standard.count} nodes</span></div>
            <div className="flex justify-between"><span>Est. Revenue:</span><span className="font-bold text-emerald-500">{tierMetrics.standard.revenue}</span></div>
          </div>
        </div>

        {/* PREMIUM TIER CARD */}
        <div 
          role="button"
          tabIndex={0}
          onClick={() => setTierFilter(tierFilter === "Premium" ? "All" : "Premium")}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setTierFilter(tierFilter === "Premium" ? "All" : "Premium"); } }}
          className={`cursor-pointer group relative rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.01] ${
            tierFilter === "Premium" ? "ring-2 ring-purple-500 bg-purple-500/5" : ""
          } ${darkMode ? "bg-slate-900/40 border-slate-800/80 hover:border-slate-700" : "bg-white border-slate-200/80 hover:shadow-lg"}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2.5 rounded-xl ${darkMode ? "bg-purple-500/10 text-purple-400" : "bg-purple-50 text-purple-600"}`}>
              <Crown size={20} />
            </div>
            <span className="text-xs font-bold text-purple-500 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              Filter <ArrowUpRight size={14} />
            </span>
          </div>
          <p className={`text-sm font-bold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Premium Plan</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-2xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>$999</span>
            <span className="text-xs text-slate-500">/month</span>
          </div>
          <div className={`mt-4 pt-4 border-t space-y-2 text-xs ${darkMode ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}>
            <div className="flex justify-between"><span>Subscribers:</span><span className="font-bold text-slate-400">{tierMetrics.premium.count} nodes</span></div>
            <div className="flex justify-between"><span>Est. Revenue:</span><span className="font-bold text-emerald-500">{tierMetrics.premium.revenue}</span></div>
          </div>
        </div>

        {/* ENTERPRISE TIER CARD */}
        <div 
          role="button"
          tabIndex={0}
          onClick={() => setTierFilter(tierFilter === "Enterprise" ? "All" : "Enterprise")}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setTierFilter(tierFilter === "Enterprise" ? "All" : "Enterprise"); } }}
          className={`cursor-pointer group relative rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.01] ${
            tierFilter === "Enterprise" ? "ring-2 ring-emerald-500 bg-emerald-500/5" : ""
          } ${darkMode ? "bg-slate-900/40 border-slate-800/80 hover:border-slate-700" : "bg-white border-slate-200/80 hover:shadow-lg"}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2.5 rounded-xl ${darkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
              <Building2 size={20} />
            </div>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              Filter <ArrowUpRight size={14} />
            </span>
          </div>
          <p className={`text-sm font-bold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Enterprise Plan</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-2xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>$1,999</span>
            <span className="text-xs text-slate-500">/month</span>
          </div>
          <div className={`mt-4 pt-4 border-t space-y-2 text-xs ${darkMode ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}>
            <div className="flex justify-between"><span>Subscribers:</span><span className="font-bold text-slate-400">{tierMetrics.enterprise.count} nodes</span></div>
            <div className="flex justify-between"><span>Est. Revenue:</span><span className="font-bold text-emerald-500">{tierMetrics.enterprise.revenue}</span></div>
          </div>
        </div>
      </div>

      {/* FILTER CONTROL PANEL */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
        <div className="flex flex-col sm:flex-row flex-1 items-center gap-3 w-full">
          {/* Search Inputs */}
          <div className="relative w-full max-w-md">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
              darkMode ? "text-slate-500" : "text-slate-400"
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by restaurant node, owner, or identifier..."
              className={`w-full h-11 pl-11 pr-10 rounded-xl text-sm outline-none border transition-all ${
                darkMode 
                  ? "bg-slate-900/50 border-slate-800 text-slate-100 focus:border-orange-500 placeholder:text-slate-500" 
                  : "bg-white border-slate-200 text-slate-800 focus:border-orange-500 placeholder:text-slate-400"
              }`}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Quick Filter Selection Segment buttons */}
          <div className="flex gap-1.5 p-1 rounded-xl border overflow-x-auto w-full sm:w-auto text-xs font-medium bg-slate-500/5 dark:border-slate-800">
            {(["All", "Active", "Trial", "Inactive"] as StatusFilter[]).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  statusFilter === st 
                    ? "bg-orange-500 text-white font-bold shadow-sm" 
                    : darkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Right Operations Panel triggers */}
        <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
          {(tierFilter !== "All" || statusFilter !== "All" || searchQuery) && (
            <button 
              onClick={() => { setStatusFilter("All"); setTierFilter("All"); setSearchQuery(""); }}
              className={`flex items-center justify-center gap-2 h-11 px-4 text-xs font-bold border rounded-xl transition-colors ${
                darkMode ? "border-slate-800 text-slate-400 hover:bg-slate-900" : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>Reset Filters</span>
              <RefreshCcw size={13} />
            </button>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex flex-1 lg:flex-none items-center justify-center gap-2 h-11 px-5 text-sm font-bold bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all shadow-md shadow-orange-500/10"
          >
            <Plus size={16} />
            <span>Add Restaurant</span>
          </button>
        </div>
      </div>

      {/* CORE SYSTEM DATA DATA-SHEET GRID */}
      <div className={`rounded-2xl border overflow-visible transition-all ${
        darkMode ? "bg-[#090f1c]/40 border-slate-900" : "bg-white border-slate-200/70 shadow-sm"
      }`}>
        <div className="overflow-x-auto">
          {filteredRestaurants.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className={`border-b border-inherit text-xs font-semibold uppercase tracking-wider ${
                  darkMode ? "bg-slate-950/40 text-slate-400 border-slate-900" : "bg-slate-50/70 text-slate-400 border-slate-200/80"
                }`}>
                  <th className="py-4 px-6">Restaurant Deployment</th>
                  <th className="py-4 px-6">Account Director</th>
                  <th className="py-4 px-6">System Handshake</th>
                  <th className="py-4 px-6">Hub Coordinates</th>
                  <th className="py-4 px-6">Tier Architecture</th>
                  <th className="py-4 px-6">Platform Lifecycle</th>
                  <th className="py-4 px-6 text-center">Aggregated Flow</th>
                  <th className="py-4 px-6 text-center">System Management</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-sm ${darkMode ? "divide-slate-900" : "divide-slate-100"}`}>
                {filteredRestaurants.map((row) => (
                  <tr key={row.id} className={`transition-colors ${darkMode ? "hover:bg-slate-900/20" : "hover:bg-slate-50/40"}`}>
                    
                    {/* Node Metadata identity */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className={`font-bold leading-tight ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{row.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-mono tracking-wider px-1.5 py-0.5 rounded ${darkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                          ID: {row.id}
                        </span>
                        <span className={`text-[10px] ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                          {row.branches} {row.branches === 1 ? "branch" : "branches"}
                        </span>
                      </div>
                    </td>

                    {/* Ownership parameters */}
                    <td className={`py-4 px-6 font-medium whitespace-nowrap ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                      {row.owner}
                    </td>

                    {/* Integrated Communications pipeline data */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className={`flex items-center gap-2 text-xs font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        <Mail size={13} className="shrink-0 text-slate-400" />
                        <span>{row.email}</span>
                      </div>
                      <div className={`flex items-center gap-2 text-xs font-medium mt-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        <Phone size={13} className="shrink-0 text-slate-400" />
                        <span>{row.phone}</span>
                      </div>
                    </td>

                    {/* Regional Geographic location matrix mapping */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className={`flex items-start gap-1.5 text-xs font-medium max-w-[180px] whitespace-normal ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                        <MapPin size={13} className="shrink-0 text-orange-500 mt-0.5" />
                        <span>{row.location}</span>
                      </div>
                    </td>

                    {/* Dynamic Subscription Architecture Tier Alignment Badge */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                        String(row.plan) === "Premium" 
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                          : String(row.plan) === "Standard"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : String(row.plan) === "Enterprise"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                      }`}>
                        {String(row.plan)}
                      </span>
                    </td>

                    {/* Lifecycle operations tracking badge */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        row.status === "Active" 
                          ? "bg-emerald-500/10 text-emerald-500" 
                          : row.status === "Trial"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-slate-500/10 text-slate-400"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          row.status === "Active" ? "bg-emerald-500" : row.status === "Trial" ? "bg-amber-400" : "bg-slate-400"
                        }`} />
                        {row.status}
                      </span>
                    </td>

                    {/* Revenue pipeline formatting indicators */}
                    <td className={`py-4 px-6 font-mono font-bold tracking-tight text-right pr-12 whitespace-nowrap text-sm ${darkMode ? "text-white" : "text-slate-900"}`}>
                      {row.revenue}
                    </td>

                    {/* Actions and Dynamic state manipulation drop-triggers */}
                    <td className="py-4 px-6 whitespace-nowrap text-center relative overflow-visible">
                      <div className={`flex items-center justify-center gap-2 ${darkMode ? "text-slate-500 hover:text-slate-400" : "text-slate-400 hover:text-slate-500"}`}>
                        <button className="p-1.5 hover:text-orange-500 rounded-lg hover:bg-slate-500/5 transition-all">
                          <Eye size={14} />
                        </button>
                        
                        <div className="relative">
                          <button 
                            onClick={() => setActiveActionRow(activeActionRow === row.id ? null : row.id)}
                            className={`p-1.5 rounded-lg transition-all ${
                              activeActionRow === row.id ? "text-orange-500 bg-orange-500/10" : "hover:text-orange-500 hover:bg-slate-500/5"
                            }`}
                          >
                            <Edit2 size={14} />
                          </button>

                          {activeActionRow === row.id && (
                            <>
                              <button type="button" className="fixed inset-0 z-10" onClick={() => setActiveActionRow(null)} aria-label="Close user settings view" />
                              <div className={`absolute right-0 mt-2 w-48 rounded-xl border p-2 shadow-2xl z-20 text-left ${
                                darkMode ? "bg-[#0b1324] border-slate-800 shadow-black/60" : "bg-white border-slate-200 shadow-slate-200/50"
                              }`}>
                                <p className={`text-[10px] font-bold uppercase px-2.5 py-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Lifecycle Status</p>
                                <button onClick={() => updateRestaurantStatus(row.id, "Active")} className="w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-500/5 text-emerald-500 flex items-center gap-1.5">
                                  <CheckCircle2 size={12} /> Set Active
                                </button>
                                <button onClick={() => updateRestaurantStatus(row.id, "Trial")} className="w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-500/5 text-amber-500 flex items-center gap-1.5">
                                  <AlertCircle size={12} /> Set Trial
                                </button>
                                <button onClick={() => updateRestaurantStatus(row.id, "Inactive")} className="w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-500/5 text-slate-400 flex items-center gap-1.5">
                                  <X size={12} /> Set Inactive
                                </button>
                                
                                <div className="h-px my-1.5 bg-slate-200 dark:bg-slate-800" />
                                
                                <p className={`text-[10px] font-bold uppercase px-2.5 py-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Reassign Architecture Tier</p>
                                {(["Basic", "Standard", "Premium", "Enterprise"] as PlanType[]).map((planOpt) => (
                                  <button 
                                    key={planOpt}
                                    onClick={() => updateRestaurantPlan(row.id, planOpt)} 
                                    className={`w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg hover:bg-slate-500/5 ${
                                      darkMode ? "text-slate-300 hover:text-slate-100" : "text-slate-700 hover:text-slate-900"
                                    }`}
                                  >
                                    {planOpt} System Plan
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        <button className="p-1.5 hover:text-orange-500 rounded-lg hover:bg-slate-500/5 transition-all">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-16 text-center px-4">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                darkMode ? "bg-slate-900 text-slate-500" : "bg-slate-100 text-slate-400"
              }`}>
                <SlidersHorizontal size={20} />
              </div>
              <h4 className={`font-bold text-base ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                No active nodes found
              </h4>
              <p className={`text-xs mt-1 max-w-sm mx-auto ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                No dataset parameters evaluate to true for query profile match: &quot;{searchQuery || statusFilter || tierFilter}&quot;.
              </p>
              <button 
                onClick={() => { setSearchQuery(""); setStatusFilter("All"); setTierFilter("All"); }}
                className="mt-5 px-4 py-2 text-xs font-bold bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors shadow-md"
              >
                Clear Structural Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* REGISTRATION SYSTEM MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50 transition-all">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all ${
            darkMode ? "bg-[#0b1324] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"
          }`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold tracking-tight">Register System Hub Node</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-900 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddRestaurantSubmit} className="space-y-4">
              <div>
                <label htmlFor="entName" className={`block text-[10px] font-bold uppercase mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Restaurant Entity Name</label>
                <input 
                  id="entName"
                  type="text" required value={newRestaurant.name}
                  onChange={e => setNewRestaurant(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Apex Culina Terminal"
                  className={`w-full h-10 px-3 rounded-xl text-sm border outline-none transition-all ${
                    darkMode ? "bg-slate-900/50 border-slate-800 text-white focus:border-orange-500" : "bg-slate-50 border-slate-200 focus:border-orange-500"
                  }`}
                />
              </div>

              <div>
                <label htmlFor="leadDir" className={`block text-[10px] font-bold uppercase mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Account Lead Director</label>
                <input 
                  id="leadDir"
                  type="text" required value={newRestaurant.owner}
                  onChange={e => setNewRestaurant(prev => ({ ...prev, owner: e.target.value }))}
                  placeholder="e.g. Marcus Vance"
                  className={`w-full h-10 px-3 rounded-xl text-sm border outline-none transition-all ${
                    darkMode ? "bg-slate-900/50 border-slate-800 text-white focus:border-orange-500" : "bg-slate-50 border-slate-200 focus:border-orange-500"
                  }`}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}