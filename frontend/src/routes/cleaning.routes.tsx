import type { RouteObject } from 'react-router-dom';
import CleaningLayout from '../layouts/CleaningLayout';
import CleaningDashboard from '../features/cleaning/pages/CleaningDashboard';
import CleaningProfile from '../features/cleaning/pages/CleaningProfile';
import CleaningSettings from '../features/cleaning/pages/CleaningSettings';

export const cleaningRoutes: RouteObject[] = [
  {
    path: '/cleaning',
    element: <CleaningLayout />,
    children: [
      {
        index: true,
        element: <CleaningDashboard />,
      },
      {
        path: 'profile',
        element: <CleaningProfile />,
      },
      {
        path: 'settings',
        element: <CleaningSettings />,
      },
    ],
  },
];