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
  TrendingUp,
  RefreshCcw,
  Plus
} from "lucide-react";

// Types & Interfaces

type StatusFilter = "All" | "Active" | "Trial" | "Inactive";

export default function Restaurant() {
  // Theme state synchronized with layout
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme ? savedTheme === "dark" : true;
    }
    return true;
  });

  // Advanced Interactive States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [activeActionRow, setActiveActionRow] = useState<string | null>(null);
  
  // Dynamic Live State Management
  const [restaurants, setRestaurants] = useState<RestaurantsRow[]>(restaurantData);

  // Add Restaurant Modal visibility & form state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    owner: "",
    email: "",
    phone: "",
    location: "",
    plan: "Basic" as "Premium" | "Standard" | "Basic",
    status: "Trial" as "Active" | "Trial" | "Inactive",
    revenue: "$0",
    branches: 1
  });

  // Sync themes with global layout pipeline
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

  // Compute live dashboard metrics based on actual array states
  const metrics = useMemo(() => {
    return {
      total: restaurants.length,
      active: restaurants.filter(r => r.status === "Active").length,
      trial: restaurants.filter(r => r.status === "Trial").length,
      branches: restaurants.reduce((acc, curr) => acc + curr.branches, 0)
    };
  }, [restaurants]);

  // Multi-parameter filtering loop (Search query + Metric selector state)
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((item) => {
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }, [restaurants, searchQuery, statusFilter]);

  // Inside-UI Data mutation action handlers
  const updateRestaurantStatus = (id: string, newStatus: "Active" | "Trial" | "Inactive") => {
    setRestaurants(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    setActiveActionRow(null);
  };

  const updateRestaurantPlan = (id: string, newPlan: "Premium" | "Standard" | "Basic") => {
    setRestaurants(prev => prev.map(r => r.id === id ? { ...r, plan: newPlan } : r));
    setActiveActionRow(null);
  };

  // Submission handler for inserting data dynamically
  const handleAddRestaurantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestaurant.name || !newRestaurant.owner) return;

    const generatedRow: RestaurantsRow = {
      id: `RST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newRestaurant.name,
      owner: newRestaurant.owner,
      email: newRestaurant.email || "info@restaurant.com",
      phone: newRestaurant.phone || "+1 (555) 000-0000",
      location: newRestaurant.location || "Remote Deployment Location",
      plan: newRestaurant.plan,
      status: newRestaurant.status,
      revenue: newRestaurant.revenue || "$0",
      branches: Number(newRestaurant.branches) || 1
    };

    setRestaurants(prev => [generatedRow, ...prev]);
    setIsModalOpen(false);
    
    // ✅ Form state successfully reset using the correct setter function name
    setNewRestaurant({
      name: "",
      owner: "",
      email: "",
      phone: "",
      location: "",
      plan: "Basic",
      status: "Trial",
      revenue: "$0",
      branches: 1
    });
  };

  return (
    <div className={`min-h-screen px-6 py-8 transition-colors duration-300 ${
      darkMode ? "bg-[#020817] text-slate-100" : "bg-[#F8FAFC] text-slate-800"
    }`}>
      
      {/* LOWER ANALYTICS CARDS WITH ADAPTIVE TEXT COLOR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        <button 
          onClick={() => setStatusFilter("All")}
          className={`text-left rounded-xl p-5 border transition-all duration-200 group relative overflow-hidden ${
            statusFilter === "All"
              ? "border-orange-500 ring-2 ring-orange-500/20 bg-orange-500/5 shadow-lg"
              : darkMode ? "bg-slate-900/40 border-slate-800/80 hover:border-slate-700" : "bg-white border-slate-200/80 hover:shadow-md"
          }`}
        >
          <p className={`text-xs font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Total Restaurants</p>
          <h3 className={`text-3xl font-extrabold tracking-tight mt-2 ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{metrics.total}</h3>
          <div className={`absolute right-4 bottom-4 opacity-10 group-hover:opacity-20 transition-opacity ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            <SlidersHorizontal size={40} />
          </div>
        </button>

        <button 
          onClick={() => setStatusFilter("Active")}
          className={`text-left rounded-xl p-5 border transition-all duration-200 group relative overflow-hidden ${
            statusFilter === "Active"
              ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500/5 shadow-lg"
              : darkMode ? "bg-slate-900/40 border-slate-800/80 hover:border-slate-700" : "bg-white border-slate-200/80 hover:shadow-md"
          }`}
        >
          <p className={`text-xs font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Active Status</p>
          <h3 className="text-3xl font-extrabold tracking-tight mt-2 text-emerald-500">{metrics.active}</h3>
          <span className="text-[10px] text-emerald-500/80 font-medium flex items-center gap-1 mt-1">
            <TrendingUp size={12} /> Live Processing
          </span>
        </button>

        <button 
          onClick={() => setStatusFilter("Trial")}
          className={`text-left rounded-xl p-5 border transition-all duration-200 group relative overflow-hidden ${
            statusFilter === "Trial"
              ? "border-orange-400 ring-2 ring-orange-400/20 bg-orange-400/5 shadow-lg"
              : darkMode ? "bg-slate-900/40 border-slate-800/80 hover:border-slate-700" : "bg-white border-slate-200/80 hover:shadow-md"
          }`}
        >
          <p className={`text-xs font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Trial Mode Window</p>
          <h3 className="text-3xl font-extrabold tracking-tight mt-2 text-orange-400">{metrics.trial}</h3>
          <span className="text-[10px] text-orange-400/80 font-medium flex items-center gap-1 mt-1">
            Requires conversion pipeline
          </span>
        </button>

        <div className={`rounded-xl p-5 border transition-all ${
          darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200/80"
        }`}>
          <p className={`text-xs font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Aggregated Branches</p>
          <h3 className="text-3xl font-extrabold tracking-tight mt-2 text-blue-500">{metrics.branches}</h3>
          <span className={`text-[10px] font-medium block mt-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
            Cross-regional footprint
          </span>
        </div>
      </div>

      {/* FILTER CONTROLS BAR WITH ADAPTIVE INPUT COLORS & ADD BUTTON */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="flex flex-1 items-center gap-4 w-full max-w-lg">
          <div className="relative w-full">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
              darkMode ? "text-slate-500" : "text-slate-400"
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Live search by typing keywords..."
              className={`w-full h-11 pl-11 pr-10 rounded-xl text-sm outline-none border transition-all ${
                darkMode 
                  ? "bg-slate-900/50 border-slate-800 text-slate-100 focus:border-orange-500 placeholder:text-slate-500" 
                  : "bg-white border-slate-200 text-slate-800 focus:border-orange-500 placeholder:text-slate-400"
              }`}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                  darkMode ? "text-slate-500 hover:text-slate-200" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {statusFilter !== "All" && (
            <button 
              onClick={() => setStatusFilter("All")}
              className="flex shrink-0 items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-orange-500/10 text-orange-500 rounded-lg hover:bg-orange-500/20 transition-colors"
            >
              <span>Showing state: {statusFilter}</span>
              <RefreshCcw size={12} />
            </button>
          )}
        </div>

        {/* Global Action: Add Restaurants Trigger */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 h-11 px-5 text-sm font-bold bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all shadow-md shadow-orange-500/10 w-full sm:w-auto"
        >
          <Plus size={16} />
          <span>Add Restaurant</span>
        </button>
      </div>

      {/* RESTAURANTS DATA TABLE SHEET */}
      <div className={`rounded-2xl border overflow-visible transition-all ${
        darkMode ? "bg-[#090f1c]/40 border-slate-900" : "bg-white border-slate-200/70 shadow-sm"
      }`}>
        <div className="overflow-x-auto">
          {filteredRestaurants.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className={`border-b border-inherit text-xs font-semibold uppercase tracking-wider ${
                  darkMode ? "bg-slate-950/40 text-slate-400 border-slate-900" : "bg-slate-50/70 text-slate-400 border-slate-200/80"
                }`}>
                  <th className="py-4 px-6 font-semibold">Restaurant Node</th>
                  <th className="py-4 px-6 font-semibold">Owner</th>
                  <th className="py-4 px-6 font-semibold">Contact</th>
                  <th className="py-4 px-6 font-semibold">Geographic Coordinates</th>
                  <th className="py-4 px-6 font-semibold">Tier Bracket</th>
                  <th className="py-4 px-6 font-semibold">System Health</th>
                  <th className="py-4 px-6 font-semibold">Gross ARR</th>
                  <th className="py-4 px-6 font-semibold text-center">Operations</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-sm ${darkMode ? "divide-slate-900" : "divide-slate-100"}`}>
                {filteredRestaurants.map((row) => (
                  <tr key={row.id} className={`transition-colors ${darkMode ? "hover:bg-slate-900/20" : "hover:bg-slate-50/40"}`}>
                    
                    {/* Restaurant Name & Dynamic ID */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className={`font-bold leading-tight ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{row.name}</div>
                      <div className={`text-[11px] mt-1 font-mono tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>ID: {row.id}</div>
                    </td>

                    {/* Owner Field Text Modification */}
                    <td className={`py-4 px-6 font-medium whitespace-nowrap ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                      {row.owner}
                    </td>

                    {/* Contact Elements with Dynamic Content Typography */}
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

                    {/* Location Structure text changes */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className={`flex items-start gap-1.5 text-xs font-medium max-w-[170px] whitespace-normal ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                        <MapPin size={13} className="shrink-0 text-orange-500 mt-0.5" />
                        <span>{row.location}</span>
                      </div>
                    </td>

                    {/* Tier Badges */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                        row.plan === "Premium" 
                          ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" 
                          : row.plan === "Standard"
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                      }`}>
                        {row.plan}
                      </span>
                    </td>

                    {/* Health Badges */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        row.status === "Active" 
                          ? "bg-emerald-500/10 text-emerald-500" 
                          : row.status === "Trial"
                            ? "bg-orange-500/10 text-orange-400"
                            : "bg-slate-500/10 text-slate-400"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          row.status === "Active" ? "bg-emerald-500" : row.status === "Trial" ? "bg-orange-400" : "bg-slate-400"
                        }`} />
                        {row.status}
                      </span>
                    </td>

                    {/* Gross Revenue Text Adaptive Control */}
                    <td className={`py-4 px-6 font-extrabold whitespace-nowrap ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
                      {row.revenue}
                    </td>

                    {/* Actions Controller Dropdown Overlay */}
                    <td className="py-4 px-6 whitespace-nowrap text-center relative overflow-visible">
                      <div className={`flex items-center justify-center gap-3 ${darkMode ? "text-slate-500 hover:text-slate-400" : "text-slate-400 hover:text-slate-500"}`}>
                        <button className="p-1 hover:text-orange-500 rounded-md hover:bg-slate-500/5 transition-all">
                          <Eye size={15} />
                        </button>
                        
                        <div className="relative">
                          <button 
                            onClick={() => setActiveActionRow(activeActionRow === row.id ? null : row.id)}
                            className={`p-1 rounded-md hover:bg-slate-500/5 transition-all ${
                              activeActionRow === row.id ? "text-orange-500 bg-orange-500/5" : "hover:text-orange-500"
                            }`}
                          >
                            <Edit2 size={14} />
                          </button>

                          {activeActionRow === row.id && (
                            <>
                              <button type="button" className="fixed inset-0 z-10" onClick={() => setActiveActionRow(null)} aria-label="Close dropdown"/>
                              <div className={`absolute right-0 mt-2 w-48 rounded-xl border p-2 shadow-xl z-20 text-left ${
                                darkMode ? "bg-[#0b1324] border-slate-800 shadow-black/40" : "bg-white border-slate-200 shadow-slate-200"
                              }`}>
                                <p className={`text-[10px] font-bold uppercase px-2.5 py-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Set Status</p>
                                <button onClick={() => updateRestaurantStatus(row.id, "Active")} className="w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-500/5 text-emerald-500 flex items-center gap-1.5">
                                  <CheckCircle2 size={12} /> Active
                                </button>
                                <button onClick={() => updateRestaurantStatus(row.id, "Trial")} className="w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-500/5 text-orange-400 flex items-center gap-1.5">
                                  <AlertCircle size={12} /> Trial
                                </button>
                                <button onClick={() => updateRestaurantStatus(row.id, "Inactive")} className="w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-500/5 text-slate-400 flex items-center gap-1.5">
                                  <X size={12} /> Inactive
                                </button>
                                
                                <div className="h-px my-1.5 bg-slate-200 dark:bg-slate-800" />
                                
                                <p className={`text-[10px] font-bold uppercase px-2.5 py-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Change Tier Plan</p>
                                <button onClick={() => updateRestaurantPlan(row.id, "Premium")} className={`w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg hover:bg-slate-500/5 ${darkMode ? "text-slate-300 hover:text-slate-100" : "text-slate-700 hover:text-slate-900"}`}>Premium Tier</button>
                                <button onClick={() => updateRestaurantPlan(row.id, "Standard")} className={`w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg hover:bg-slate-500/5 ${darkMode ? "text-slate-300 hover:text-slate-100" : "text-slate-700 hover:text-slate-900"}`}>Standard Tier</button>
                                <button onClick={() => updateRestaurantPlan(row.id, "Basic")} className={`w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg hover:bg-slate-500/5 ${darkMode ? "text-slate-300 hover:text-slate-100" : "text-slate-700 hover:text-slate-900"}`}>Basic Tier</button>
                              </div>
                            </>
                          )}
                        </div>

                        <button className="p-1 hover:text-orange-500 rounded-md hover:bg-slate-500/5 transition-all">
                          <MoreVertical size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            /* Empty Data Fallback Colors */
            <div className="py-14 text-center px-4">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center mx-auto mb-3 ${darkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-400"}`}>
                <Search size={18} />
              </div>
              <h4 className={`font-bold text-sm ${darkMode ? "text-slate-200" : "text-slate-800"}`}>No matched operations found</h4>
              <p className={`text-xs mt-1 max-w-xs mx-auto ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                No system accounts match the current query parameter: &quot;{searchQuery || statusFilter}&quot;.
              </p>
              <button 
                onClick={() => { setSearchQuery(""); setStatusFilter("All"); }}
                className="mt-4 px-3 py-1.5 text-xs font-bold bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/10"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DYNAMIC MODAL BOX COMPONENT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40 animate-fade-in">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all ${
            darkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"
          }`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold tracking-tight">Register New Restaurant</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-900 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddRestaurantSubmit} className="space-y-4">
              <div>
                <label htmlFor="restaurant-name" className={`block text-xs font-semibold uppercase mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Restaurant Name</label>
                <input 
                  id="restaurant-name"
                  type="text" 
                  required
                  value={newRestaurant.name}
                  onChange={e => setNewRestaurant(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Urban Bistro HQ"
                  className={`w-full h-10 px-3 rounded-xl text-sm border outline-none transition-all ${
                    darkMode ? "bg-slate-900/50 border-slate-800 text-white focus:border-orange-500" : "bg-slate-50 border-slate-200 focus:border-orange-500"
                  }`}
                />
              </div>

              <div>
                <label htmlFor="owner-name" className={`block text-xs font-semibold uppercase mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Owner Full Name</label>
                <input 
                  id="owner-name"
                  type="text" 
                  required
                  value={newRestaurant.owner}
                  onChange={e => setNewRestaurant(prev => ({ ...prev, owner: e.target.value }))}
                  placeholder="e.g. John Doe"
                  className={`w-full h-10 px-3 rounded-xl text-sm border outline-none transition-all ${
                    darkMode ? "bg-slate-900/50 border-slate-800 text-white focus:border-orange-500" : "bg-slate-50 border-slate-200 focus:border-orange-500"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="restaurant-email" className={`block text-xs font-semibold uppercase mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Email</label>
                  <input 
                    id="restaurant-email"
                    type="email"
                    value={newRestaurant.email}
                    onChange={e => setNewRestaurant(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contact@brand.com"
                    className={`w-full h-10 px-3 rounded-xl text-sm border outline-none transition-all ${
                      darkMode ? "bg-slate-900/50 border-slate-800 text-white focus:border-orange-500" : "bg-slate-50 border-slate-200 focus:border-orange-500"
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="restaurant-phone" className={`block text-xs font-semibold uppercase mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Phone</label>
                  <input 
                    id="restaurant-phone"
                    type="text"
                    value={newRestaurant.phone}
                    onChange={e => setNewRestaurant(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 019-2834"
                    className={`w-full h-10 px-3 rounded-xl text-sm border outline-none transition-all ${
                      darkMode ? "bg-slate-900/50 border-slate-800 text-white focus:border-orange-500" : "bg-slate-50 border-slate-200 focus:border-orange-500"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="restaurant-location" className={`block text-xs font-semibold uppercase mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Location Coordinates</label>
                <input 
                  id="restaurant-location"
                  type="text"
                  value={newRestaurant.location}
                  onChange={e => setNewRestaurant(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g. Broadway, New York, NY"
                  className={`w-full h-10 px-3 rounded-xl text-sm border outline-none transition-all ${
                    darkMode ? "bg-slate-900/50 border-slate-800 text-white focus:border-orange-500" : "bg-slate-50 border-slate-200 focus:border-orange-500"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="tier-bracket" className={`block text-xs font-semibold uppercase mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Tier Bracket</label>
                  <select
                    id="tier-bracket"
                    value={newRestaurant.plan}
                    onChange={e => setNewRestaurant(prev => ({ ...prev, plan: e.target.value as "Premium" | "Standard" | "Basic" }))}
                    className={`w-full h-10 px-2 rounded-xl text-sm border outline-none transition-all ${
                      darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-orange-500" : "bg-slate-50 border-slate-200 focus:border-orange-500"
                    }`}
                  >
                    <option value="Basic">Basic Tier</option>
                    <option value="Standard">Standard Tier</option>
                    <option value="Premium">Premium Tier</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="initial-status" className={`block text-xs font-semibold uppercase mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Initial Status</label>
                  <select
                    id="initial-status"
                    value={newRestaurant.status}
                    onChange={e => setNewRestaurant(prev => ({ ...prev, status: e.target.value as "Active" | "Trial" | "Inactive" }))}
                    className={`w-full h-10 px-2 rounded-xl text-sm border outline-none transition-all ${
                      darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-orange-500" : "bg-slate-50 border-slate-200 focus:border-orange-500"
                    }`}
                  >
                    <option value="Trial">Trial</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="est-revenue" className={`block text-xs font-semibold uppercase mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Est. Revenue ($)</label>
                  <input 
                    id="est-revenue"
                    type="text"
                    value={newRestaurant.revenue}
                    onChange={e => setNewRestaurant(prev => ({ ...prev, revenue: e.target.value }))}
                    placeholder="e.g. $12,500"
                    className={`w-full h-10 px-3 rounded-xl text-sm border outline-none transition-all ${
                      darkMode ? "bg-slate-900/50 border-slate-800 text-white focus:border-orange-500" : "bg-slate-50 border-slate-200 focus:border-orange-500"
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="total-branches" className={`block text-xs font-semibold uppercase mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Total Branches</label>
                  <input 
                    id="total-branches"
                    type="number"
                    min="1"
                    value={newRestaurant.branches}
                    onChange={e => setNewRestaurant(prev => ({ ...prev, branches: Number(e.target.value) }))}
                    className={`w-full h-10 px-3 rounded-xl text-sm border outline-none transition-all ${
                      darkMode ? "bg-slate-900/50 border-slate-800 text-white focus:border-orange-500" : "bg-slate-50 border-slate-200 focus:border-orange-500"
                    }`}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`flex-1 h-11 text-xs font-bold rounded-xl transition-colors border ${
                    darkMode ? "border-slate-800 hover:bg-slate-900 text-slate-300" : "border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 text-xs font-bold bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/10"
                >
                  Save Nodes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}