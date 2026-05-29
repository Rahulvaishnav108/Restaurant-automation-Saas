import type { RouteObject } from 'react-router-dom';
import CleaningLayout from '../layouts/CleaningLayout';
import CleaningDashboard from '../features/cleaning/pages/CleaningDashboard';

export const cleaningRoutes: RouteObject[] = [
  {
    path: '/cleaning',
    element: <CleaningLayout />,
    children: [
      {
        index: true,
        element: <CleaningDashboard />,
      },
    ],
  },
];