import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

// 1. Import all your global state providers (from the left page)
import { QueryProvider } from './providers/QueryProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './providers/AuthProvider';
import { SocketProvider } from './providers/SocketProvider';

// 2. Import all your page components (from the right page)
import LandingPage from '../features/customer/pages/LandingPage';
import LoginPage from '../auth/pages/LoginPage';
import CustomerDashboard from '../features/customer/pages/CustomerDashboard';
import RestaurantsPage from '../features/customer/pages/RestaurantsPage';
import OffersPage from '../features/customer/pages/OffersPage';
import ReservationsPage from '../features/customer/pages/ReservationsPage';
import PaymentPage from '../features/customer/pages/PaymentPage';
import FeedbackPage from '../features/customer/pages/FeedbackPage';

// 3. Define the routing logic
const AppRoutes = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#0f0f16] text-white">
      <Routes>
        <Route path="/" element={<LandingPage onEnterApp={() => navigate('/dashboard')} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/restaurants" element={<RestaurantsPage onEnterApp={() => navigate('/dashboard')} />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/dashboard" element={<CustomerDashboard onBack={() => navigate('/')} />} />
      </Routes>
    </main>
  );
};

// 4. The main App component containing the perfect wrapper hierarchy
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
