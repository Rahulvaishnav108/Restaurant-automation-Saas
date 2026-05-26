import type { RouteObject } from 'react-router-dom';
import StaffLayout from '../layouts/StaffLayout';
import CleaningDashboard from '../features/cleaning/pages/CleaningDashboard';

export const cleaningRoutes: RouteObject[] = [
  {
    path: '/cleaning',
    element: <StaffLayout />,
    children: [
      {
        index: true,
        element: <CleaningDashboard />,
      },
    ],
  },
];