import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import { QueryProvider } from "./providers/QueryProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { SocketProvider } from "./providers/SocketProvider";

import LandingPage from "../features/customer/pages/LandingPage";
import LoginPage from "../auth/pages/LoginPage";
import CustomerDashboard from "../features/customer/pages/CustomerDashboard";
import RestaurantsPage from "../features/customer/pages/RestaurantsPage";
import OffersPage from "../features/customer/pages/OffersPage";
import ReservationsPage from "../features/customer/pages/ReservationsPage";
import PaymentPage from "../features/customer/pages/PaymentPage";
import FeedbackPage from "../features/customer/pages/FeedbackPage";
import KitchenLayout from "../layouts/KitchenLayout";
import KitchenDashboard from "../features/kitchen/pages/KitchenDashboard";

const AppRoutes = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[rgb(var(--page-bg))] text-[rgb(var(--text))]">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/restaurants" element={<RestaurantsPage onEnterApp={() => navigate('/dashboard')} />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/dashboard" element={<CustomerDashboard onBack={() => navigate('/')} />} />
        <Route path="/kitchen" element={<KitchenLayout />}>
          <Route index element={<KitchenDashboard />} />
        </Route>
      </Routes>
    </main>
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