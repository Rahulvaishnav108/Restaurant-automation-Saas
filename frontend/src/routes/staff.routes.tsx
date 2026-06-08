import type { RouteObject } from 'react-router-dom';
import StaffLayout from '../layouts/StaffLayout';
import StaffDashboard from '../features/staff/pages/StaffDashboard';
import StaffProfile from '../features/staff/pages/StaffProfile';
import StaffSettings from '../features/staff/pages/StaffSettings';

export const staffRoutes: RouteObject[] = [
  {
    path: '/staff',
    element: <StaffLayout />,
    children: [
      {
        index: true,
        element: <StaffDashboard />,
      },
      {
        path: 'profile',
        element: <StaffProfile />,
      },
      {
        path: 'settings',
        element: <StaffSettings />,
      },
    ],
  },
];