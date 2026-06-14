import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import Navbar from "../features/superAdmin/components/dashboard/Navbar";
import Sidebar from "../features/superAdmin/components/Sidebar";

export default function SuperAdminLayout() {
  const { signOut } = useAuth();

  // ── Theme state (persisted) ──────────────────────────────────────────────
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme ? savedTheme === "dark" : true;
    }
    return true;
  });

  // ── Mobile sidebar drawer state ──────────────────────────────────────────
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close drawer on window resize to desktop breakpoint
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Prevent body scroll when drawer is open on mobile
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSidebarOpen]);

  // ── Theme sync listener (from dashboard / child pages) ───────────────────
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

  // ── Theme toggle ─────────────────────────────────────────────────────────
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
    window.dispatchEvent(
      new CustomEvent("sync-app-theme", { detail: { darkMode: nextMode } })
    );
  };

  return (
    <div
      className={`flex min-h-screen font-sans antialiased transition-colors duration-300 ${
        darkMode ? "bg-[#020817]" : "bg-[#F8FAFC]"
      }`}
    >
      {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
      {/*
        Desktop: renders as a fixed left panel (lg:w-[260px]).
        Mobile:  renders as a slide-in drawer controlled by mobileSidebarOpen.
      */}
      <Sidebar
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        signOut={signOut}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* ── MAIN CONTENT AREA ───────────────────────────────────────────── */}
      {/*
        lg:ml-[260px]  → offset for fixed desktop sidebar.
        pt-16          → offset for fixed navbar height.
        On mobile, no left margin (sidebar is an overlay drawer).
      */}
      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto lg:ml-[260px] pt-16 h-screen">
        {/* ── NAVBAR ────────────────────────────────────────────────────── */}
        <Navbar
          darkMode={darkMode}
          onThemeToggle={toggleTheme}
          onMobileMenuToggle={() => setMobileSidebarOpen((v) => !v)}
          mobileMenuOpen={mobileSidebarOpen}
        />

        {/* ── PAGE CONTENT ──────────────────────────────────────────────── */}
        <div className="flex-1">
          <Outlet context={{ darkMode }} />
        </div>
      </main>
    </div>
  );
}