import type { RouteObject } from 'react-router-dom';
import StaffLayout from '../layouts/StaffLayout';
import StaffDashboard from '../features/staff/pages/StaffDashboard';

export const staffRoutes: RouteObject[] = [
  {
    path: '/staff',
    element: <StaffLayout />,
    children: [
      {
        index: true,
        element: <StaffDashboard />,
      },
    ],
  },
];
