import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import { QueryProvider }  from "./providers/QueryProvider";
import { ThemeProvider }  from "./providers/ThemeProvider";
import { AuthProvider }   from "./providers/AuthProvider";
import { SocketProvider } from "./providers/SocketProvider";

import LandingPage        from "../features/customer/pages/LandingPage";
import LoginPage          from "../auth/pages/LoginPage";
import CustomerDashboard  from "../features/customer/pages/CustomerDashboard";
import RestaurantsPage    from "../features/customer/pages/RestaurantsPage";
import OffersPage         from "../features/customer/pages/OffersPage";
import ReservationsPage   from "../features/customer/pages/ReservationsPage";
import PaymentPage        from "../features/customer/pages/PaymentPage";
import FeedbackPage       from "../features/customer/pages/FeedbackPage";
import KitchenLayout      from "../layouts/KitchenLayout";
import KitchenDashboard   from "../features/kitchen/pages/KitchenDashboard";
import SuperAdminLayout from "../layouts/SuperAdminLayout";
import SuperAdminDashboard from "../features/superAdmin/pages/SuperadminDashboard";
import Restaurants        from "../features/superAdmin/pages/Restaurants";
import Analytics          from "../features/superAdmin/pages/Analytics";
import Subscriptions       from "../features/superAdmin/pages/Subscriptions";
import Transactions       from "../features/superAdmin/pages/Transactions";
import Alerts            from    "../features/superAdmin/pages/Alerts";
import AuditLogs          from "../features/superAdmin/pages/AuditLogs";

// Admin
import AdminLayout              from "../layouts/AdminLayout";
import AdminDashboard           from "../features/admin/pages/AdminDashboard";
import OrdersPage               from "../features/admin/pages/OrdersPage";
import AdminReservationsPage    from "../features/admin/pages/ReservationsPage";
import { MenuManagementPage }   from "../features/admin/pages/MenuManagementPage";
import { CustomersPage }        from "../features/admin/pages/CustomersPage";
import { InventoryPage }        from "../features/admin/pages/InventoryPage";
import  StaffManagementPage   from "../features/admin/pages/StaffManagementPage";
import  ReportsPage           from "../features/admin/pages/ReportsPage";
import {
   
  TableManagementPage,
  MarketingPage, SettingsPage,
} from "../features/admin/pages/StubPages";

const AppRoutes = () => {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen bg-[rgb(var(--page-bg))] text-[rgb(var(--text))]">
      <Routes>
        <Route path="/"            element={<LandingPage />} />
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/restaurants" element={<RestaurantsPage onEnterApp={() => navigate('/dashboard')} />} />
        <Route path="/offers"      element={<OffersPage />} />
        <Route path="/reservations"element={<ReservationsPage />} />
        <Route path="/payment"     element={<PaymentPage />} />
        <Route path="/feedback"    element={<FeedbackPage />} />
        <Route path="/dashboard"   element={<CustomerDashboard onBack={() => navigate('/')} />} />
       
  
        <Route path="/kitchen"     element={<KitchenLayout />}>
          <Route index element={<KitchenDashboard />} />
       </Route>

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index               element={<AdminDashboard />} />
          <Route path="orders"       element={<OrdersPage />} />
          <Route path="reservations" element={<AdminReservationsPage />} />
          <Route path="customers"    element={<CustomersPage />} />
          <Route path="inventory"    element={<InventoryPage />} />
          <Route path="menu"         element={<MenuManagementPage />} />
          <Route path="tables"       element={<TableManagementPage />} />
          <Route path="staff"        element={<StaffManagementPage />} />
          <Route path="reports"      element={<ReportsPage />} />
          <Route path="marketing"    element={<MarketingPage />} />
          <Route path="settings"     element={<SettingsPage />} />
        </Route>

       {/*Super Admin*/}
        <Route path="/superadmin" element={<SuperAdminLayout />}>
        <Route index element={<SuperAdminDashboard />} />
        <Route path="restaurants"element={<Restaurants />}/>
       <Route path="analytics"element={<Analytics />}/>
        <Route path="subscriptions" element={<Subscriptions />}/>
       <Route path="transactions"element={<Transactions />}/>
        <Route path="alerts"element={<Alerts />}/>
      <Route path="audit-logs" element={<AuditLogs />} />

        
        
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