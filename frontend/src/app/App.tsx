import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryProvider }  from "./providers/QueryProvider";
import { ThemeProvider }  from "./providers/ThemeProvider";
import { AuthProvider }   from "./providers/AuthProvider";
import { SocketProvider } from "./providers/SocketProvider";

import LandingPage        from "../features/customer/pages/LandingPage";
import LoginPage          from "../auth/pages/LoginPage";

import KitchenLayout      from "../layouts/KitchenLayout";
import KitchenOverviewPage   from "../features/kitchen/pages/KitchenOverviewPage";

import StaffLayout from "../layouts/StaffLayout";
import StaffDashboard from "../features/staff/pages/StaffDashboard";
import StaffOrdersPage from "../features/staff/pages/StaffOrdersPage";
import StaffTablesPage from "../features/staff/pages/StaffTablesPage";
import StaffFoodReadyPage from "../features/staff/pages/StaffFoodReadyPage";
import StaffRequestsPage from "../features/staff/pages/StaffRequestsPage";
import StaffReservationsPage from "../features/staff/pages/StaffReservationsPage";
import StaffTableTurnoverPage from "../features/staff/pages/StaffTableTurnoverPage";
import StaffMenuPage from "../features/staff/pages/StaffMenuPage";
import StaffReportsPage from "../features/staff/pages/StaffReportsPage";
import StaffAlertsPage from "../features/staff/pages/StaffAlertsPage";
import StaffProfilePage from "../features/staff/pages/StaffProfilePage";
import StaffSettingsPage from "../features/staff/pages/StaffSettingsPage";

import CleaningLayout from "../layouts/CleaningLayout";
import CleaningDashboard from "../features/cleaning/pages/CleaningDashboard";
import CleaningTablesPage from "../features/cleaning/pages/CleaningTablesPage";
import CleaningRequestsPage from "../features/cleaning/pages/CleaningRequestsPage";
import CleaningTasksPage from "../features/cleaning/pages/CleaningTasksPage";
import CleaningProfilePage from "../features/cleaning/pages/CleaningProfilePage";
import CleaningSettingsPage from "../features/cleaning/pages/CleaningSettingsPage";

import SuperAdminLayout    from "../layouts/SuperAdminLayout";
import SuperAdminDashboard from "../features/superAdmin/pages/SuperadminDashboard";
import Restaurants         from "../features/superAdmin/pages/Restaurants";
import Analytics           from "../features/superAdmin/pages/Analytics";
import Subscriptions       from "../features/superAdmin/pages/Subscriptions";
import Transactions        from "../features/superAdmin/pages/Transactions";
import Alerts              from "../features/superAdmin/pages/Alerts";
import AuditLogs           from "../features/superAdmin/pages/AuditLogs";
import EditProfile         from "../features/superAdmin/pages/EditProfile";
import Settings            from "../features/superAdmin/pages/Settings";

import AdminLayout              from "../layouts/AdminLayout";
import AdminDashboard           from "../features/admin/pages/AdminDashboard";
import OrdersPage               from "../features/admin/pages/OrdersPage";
import AdminReservationsPage    from "../features/admin/pages/ReservationsPage";
import { MenuManagementPage }   from "../features/admin/pages/MenuManagementPage";
import { CustomersPage }        from "../features/admin/pages/CustomersPage";
import { InventoryPage }        from "../features/admin/pages/InventoryPage";
import StaffManagementPage      from "../features/admin/pages/StaffManagementPage";
import ReportsPage              from "../features/admin/pages/ReportsPage";
import { TableManagementPage }  from "../features/admin/pages/TableManagementPage";
import SettingsPage             from "../features/admin/pages/SettingsPage";

const AppRoutes = () => {
  return (
    <main className="min-h-screen bg-[rgb(var(--page-bg))] text-[rgb(var(--text))]">
      <Routes>
        <Route path="/"            element={<LandingPage />} />
        <Route path="/login"       element={<LoginPage />} />

        <Route path="/kitchen" element={<KitchenLayout />}>
          <Route index element={<KitchenOverviewPage />} />
        </Route>

        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<StaffDashboard />} />
          <Route path="orders" element={<StaffOrdersPage />} />
          <Route path="tables" element={<StaffTablesPage />} />
          <Route path="food-ready" element={<StaffFoodReadyPage />} />
          <Route path="requests" element={<StaffRequestsPage />} />
          <Route path="reservations" element={<StaffReservationsPage />} />
          <Route path="table-turnover" element={<StaffTableTurnoverPage />} />
          <Route path="menu" element={<StaffMenuPage />} />
          <Route path="reports" element={<StaffReportsPage />} />
          <Route path="alerts" element={<StaffAlertsPage />} />
          <Route path="profile" element={<StaffProfilePage />} />
          <Route path="settings" element={<StaffSettingsPage />} />
        </Route>

        <Route path="/cleaning" element={<CleaningLayout />}>
          <Route index element={<CleaningDashboard />} />
          <Route path="tables" element={<CleaningTablesPage />} />
          <Route path="requests" element={<CleaningRequestsPage />} />
          <Route path="tasks" element={<CleaningTasksPage />} />
          <Route path="profile" element={<CleaningProfilePage />} />
          <Route path="settings" element={<CleaningSettingsPage />} />
        </Route>

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
          <Route path="settings"     element={<SettingsPage />} />
        </Route>

        <Route path="/superadmin" element={<SuperAdminLayout />}>
          <Route index                      element={<SuperAdminDashboard />} />
          <Route path="restaurants"         element={<Restaurants />} />
          <Route path="analytics"           element={<Analytics />} />
          <Route path="subscriptions"       element={<Subscriptions />} />
          <Route path="transactions"        element={<Transactions />} />
          <Route path="alerts"              element={<Alerts />} />
          <Route path="audit-logs"          element={<AuditLogs />} />
          <Route path="edit-profile"        element={<EditProfile />} />
          <Route path="settings"            element={<Settings />} />
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