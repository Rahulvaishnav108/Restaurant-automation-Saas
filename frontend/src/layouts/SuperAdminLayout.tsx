import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import Navbar from "../features/superAdmin/components/dashboard/Navbar";
import Sidebar from "../features/superAdmin/components/Sidebar";

export default function SuperAdminLayout() {
  const { signOut } = useAuth();
  // Initialize state from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme ? savedTheme === "dark" : true; 
    }
    return true;
  });

  // Listen for theme changes dispatched from the dashboard or other pages
  useEffect(() => {
    const handleThemeSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail !== undefined) {
        setDarkMode(customEvent.detail.darkMode);
      }
    };

    window.addEventListener("sync-app-theme", handleThemeSync);
    return () => window.removeEventListener("sync-app-theme", handleThemeSync);
  }, []);

  // Update DOM and LocalStorage when layout toggles the theme
  const toggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    
    if (nextMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    // Broadcast change to the dashboard
    window.dispatchEvent(new CustomEvent("sync-app-theme", { detail: { darkMode: nextMode } }));
  };

  return (
    <div className={`flex min-h-screen font-sans antialiased transition-colors duration-300 ${
      darkMode ? "bg-[#020817]" : "bg-[#F8FAFC]"
    }`}>
      
      {/* SIDEBAR COMPONENT */}
      <Sidebar darkMode={darkMode} toggleTheme={toggleTheme} signOut={signOut} />

      {/* DASHBOARD ROUTE OUTLET VIEWPORT */}
      {/* Added ml-[260px] for fixed sidebar offset and pt-16 h-screen for fixed navbar offset & scrolling */}
      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto ml-[260px] pt-16 h-screen">
        {/* Navbar sits on top of the layout container workspace seamlessly */}
        <Navbar darkMode={darkMode} onThemeToggle={toggleTheme} />
        
        {/* Page contents (Dashboard, Transactions, etc.) render here */}
        <div className="flex-1">
          <Outlet context={{ darkMode }} />
        </div>
      </main>
    </div>
  );
}