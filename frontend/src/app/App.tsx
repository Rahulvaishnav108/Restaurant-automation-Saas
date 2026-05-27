import React from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";

import { QueryProvider } from "./providers/QueryProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { SocketProvider } from "./providers/SocketProvider";
import { ProtectedRoute } from "./guards/ProtectedRoute";
import { RoleGuard } from "./guards/RoleGuard";
import { useAuth, type AppRole } from "../auth/AuthProvider";
import { appRoutes } from "../shared/constants/routes";

import LandingPage from "../features/customer/pages/LandingPage";
import LoginPage from "../auth/pages/LoginPage";
import CustomerDashboard from "../features/customer/pages/CustomerDashboard";
import RestaurantsPage from "../features/customer/pages/RestaurantsPage";
import ReservationsPage from "../features/customer/pages/ReservationsPage";
import PaymentPage from "../features/customer/pages/PaymentPage";
import FeedbackPage from "../features/customer/pages/FeedbackPage";
import KitchenLayout from "../layouts/KitchenLayout";
import KitchenDashboard from "../features/kitchen/pages/KitchenDashboard";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../features/admin/pages/AdminDashboard";

// Home page that lets you pick a role (for demo/dev)
function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const { signInAs } = useAuth();

  const roleCards: Array<{ role: AppRole; title: string; description: string }> = [
    { role: "customer", title: "Customer PWA", description: "QR-first guest ordering with frictionless upsell and live status." },
    { role: "staff", title: "Staff PWA", description: "Floor operations, guest requests, billing support, and table turnover." },
    { role: "kitchen", title: "Kitchen PWA", description: "Ticket batching, SLA pressure, prep sequencing, and delay control." },
    { role: "cleaning", title: "Cleaning PWA", description: "Task queue, cleanup verification, and rapid table availability resets." },
    { role: "admin", title: "Restaurant Admin", description: "Revenue, menu, staffing, and performance insights for each location." },
    { role: "super-admin", title: "SaaS Platform", description: "Tenant governance, subscriptions, feature rollout, and audit posture." },
  ];

  function handleRoleSelect(role: AppRole): void {
    signInAs(role);
    navigate(role === "super-admin" ? appRoutes.superAdmin : `/${role}`);
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#1c1917_0%,#431407_40%,#f97316_100%)] px-4 py-10 text-stone-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-200">Industry-standard baseline</p>
          <h1 className="mt-4 text-5xl font-black leading-tight sm:text-6xl">
            Restaurant operations software should feel like a real product on day one.
          </h1>
          <p className="mt-6 text-lg leading-8 text-orange-50/85">
            This upgraded foundation gives the project typed config, guarded routing, operational shells, and a stronger production posture.
          </p>
        </div>
        <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {roleCards.map((card) => (
            <button
              key={card.role}
              className="rounded-[2rem] border border-white/15 bg-white/10 p-6 text-left backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
              onClick={() => handleRoleSelect(card.role)}
              type="button"
            >
              <p className="text-sm uppercase tracking-[0.25em] text-amber-200">{card.title}</p>
              <p className="mt-4 text-sm leading-7 text-orange-50/85">{card.description}</p>
            </button>
          ))}
        </section>
        <div className="mt-8">
          <button
            className="rounded-full border border-white/15 bg-black/20 px-5 py-3 text-sm font-semibold transition hover:bg-black/30"
            onClick={() => navigate(appRoutes.authLogin)}
            type="button"
          >
            Open real login
          </button>
        </div>
      </div>
    </div>
  );
}

const AppRoutes = () => {
  const navigate = useNavigate();
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/restaurants" element={<RestaurantsPage onEnterApp={() => navigate("/dashboard")} />} />
      <Route path="/reservations" element={<ReservationsPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/feedback" element={<FeedbackPage />} />
      <Route path="/dashboard" element={<CustomerDashboard onBack={() => navigate("/")} />} />

      {/* Kitchen */}
      <Route path="/kitchen" element={<KitchenLayout />}>
        <Route index element={<KitchenDashboard />} />
      </Route>

      {/* Admin — protected + role-guarded */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleGuard roles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App(): JSX.Element {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <SocketProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </SocketProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;