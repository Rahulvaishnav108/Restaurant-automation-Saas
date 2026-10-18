// src/app/router.tsx
// Central application router — assembles all role-based route modules

import { createBrowserRouter, createHashRouter, Navigate, RouterProvider } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import RootErrorBoundary from './RootErrorBoundary';
import { ProtectedRoute } from './guards/ProtectedRoute';

// Route modules
import { authRoutes } from '../routes/auth.routes';
import { adminRoutes } from '../routes/admin.routes';
import { staffRoutes } from '../routes/staff.routes';
import { kitchenRoutes } from '../routes/kitchen.routes';
import { cleaningRoutes } from '../routes/cleaning.routes';
import { customerRoutes } from '../routes/customer.routes';
import { superAdminRoutes } from '../routes/superAdmin.routes';

// Pages
import LandingPage from '../features/customer/pages/LandingPage';
import RestaurantsPage from '../features/customer/pages/RestaurantsPage';
import OffersPage from '../features/customer/pages/OffersPage';
import DemoWorkspacePage from '../features/customer/pages/DemoWorkspacePage';
import type { AppRole } from '../auth/AuthProvider';
import { lazy, Suspense } from 'react';

// Lazy-loaded table session page (QR scan entry)
const TableSessionPage = lazy(
  () => import('../features/customer/pages/TableSessionPage')
);

const routes = [
  // ── Public landing ─────────────────────────────────────────────────
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <RootErrorBoundary />,
  },

  // ── Public restaurants page ────────────────────────────────────────
  {
    path: '/customer/restaurants',
    element: <RestaurantsPage />,
    errorElement: <RootErrorBoundary />,
  },

  // ── Public offers page ─────────────────────────────────────────────
  {
    path: '/customer/offers',
    element: <OffersPage />,
    errorElement: <RootErrorBoundary />,
  },

  // ── QR scan → table session init ───────────────────────────────────
  {
    path: '/table',
    element: (
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
          </div>
        }
      >
        <TableSessionPage />
      </Suspense>
    ),
    errorElement: <RootErrorBoundary />,
  },

  // ── Auth routes ────────────────────────────────────────────────────
  {
    path: '/auth',
    children: authRoutes,
    errorElement: <RootErrorBoundary />,
  },

  // ── Protected role-based routes ────────────────────────────────────
  {
    element: <ProtectedRoute />,
    errorElement: <RootErrorBoundary />,
    children: [
      ...adminRoutes,
      ...staffRoutes,
      ...kitchenRoutes,
      ...cleaningRoutes,
      ...customerRoutes,
      ...superAdminRoutes,
    ],
  },

  // ── Catch-all ──────────────────────────────────────────────────────
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

function demoRoleRoutes(source: RouteObject[], role: AppRole, keepIndex = false): RouteObject[] {
  const root = source[0] as import('react-router-dom').NonIndexRouteObject;
  const originalIndex = root.children?.find((route) => route.index);
  return [{
    ...root,
    children: [
      ...(keepIndex && originalIndex ? [originalIndex] : []),
      ...(!keepIndex ? [{ index: true, element: <DemoWorkspacePage role={role} /> }] : []),
      { path: '*', element: <DemoWorkspacePage role={role} /> },
    ],
  }];
}

const demoRoutes: RouteObject[] = [
  { path: '/', element: <LandingPage />, errorElement: <RootErrorBoundary /> },
  { path: '/customer/restaurants', element: <RestaurantsPage /> },
  { path: '/customer/offers', element: <OffersPage /> },
  { path: '/table', element: <DemoWorkspacePage role="customer" /> },
  { path: '/auth', children: authRoutes, errorElement: <RootErrorBoundary /> },
  {
    element: <ProtectedRoute />,
    errorElement: <RootErrorBoundary />,
    children: [
      ...demoRoleRoutes(adminRoutes, 'admin', true),
      ...demoRoleRoutes(staffRoutes, 'staff'),
      ...demoRoleRoutes(kitchenRoutes, 'kitchen'),
      ...demoRoleRoutes(cleaningRoutes, 'cleaning'),
      ...demoRoleRoutes(customerRoutes, 'customer'),
      ...demoRoleRoutes(superAdminRoutes, 'super-admin'),
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
];

const router = import.meta.env.VITE_DEMO_MODE === 'true'
  ? createHashRouter(demoRoutes)
  : createBrowserRouter(routes, { basename: import.meta.env.BASE_URL });

export default function AppRouter(): JSX.Element {
  return <RouterProvider router={router} />;
}
