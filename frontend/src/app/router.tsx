import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { customerRoutes } from '../routes/customer.routes';
import { staffRoutes } from '../routes/staff.routes';
import { kitchenRoutes } from '../routes/kitchen.routes';
import { cleaningRoutes } from '../routes/cleaning.routes';
import { adminRoutes } from '../routes/admin.routes';
import { superAdminRoutes } from '../routes/superAdmin.routes';
import { authRoutes } from '../routes/auth.routes';

import { ProtectedRoute } from './guards/ProtectedRoute';
import { RoleGuard } from './guards/RoleGuard';
import { appRoutes } from '../shared/constants/routes';
import LandingPage from '../features/customer/pages/LandingPage';

function AppRouter(): JSX.Element {
  const router = createBrowserRouter([
    // ── Public: Landing page ──────────────────────────────────
    {
      path: appRoutes.home,
      element: <LandingPage />,
    },

    // ── Public: Auth pages ────────────────────────────────────
    {
      path: '/auth',
      children: authRoutes,
    },

    // ── Customer dashboard (public for now, wrap in guards later) ─
    ...customerRoutes,
    ...kitchenRoutes,

    // ── Protected: Role-gated app shells ─────────────────────
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <RoleGuard roles={['staff']} />,
          children: staffRoutes,
        },
        {
          element: <RoleGuard roles={['cleaning']} />,
          children: cleaningRoutes,
        },
        {
          element: <RoleGuard roles={['admin']} />,
          children: adminRoutes,
        },
        {
          element: <RoleGuard roles={['super-admin']} />,
          children: superAdminRoutes,
        },
      ],
    },
  ]);

  return <RouterProvider future={{ v7_startTransition: true }} router={router} />;
}

export default AppRouter;
