import type { RouteObject } from 'react-router-dom';
import SuperAdminLayout from '../layouts/SuperAdminLayout';
import { RoleDashboard } from './shared';

export const superAdminRoutes: RouteObject[] = [
  {
    path: '/super-admin',
    element: <SuperAdminLayout />,
    children: [
      {
        index: true,
        element: (
          <RoleDashboard
            title="Multi-Tenant SaaS Command"
            description="Platform operators need tenant health, subscription visibility, and incident posture in one place."
            highlights={['Tenant lifecycle', 'Subscription intelligence', 'Platform risk controls']}
          />
        ),
      },
    ],
  },
];
