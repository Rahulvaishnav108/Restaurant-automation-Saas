import type { RouteObject } from 'react-router-dom';
import KitchenLayout from '../layouts/KitchenLayout';
import KitchenDashboard from '../features/kitchen/pages/KitchenDashboard';

export const kitchenRoutes: RouteObject[] = [
  {
    path: '/kitchen',
    element: <KitchenLayout />,
    children: [
      {
        index: true,
        element: <KitchenDashboard />,
      },
    ],
  },
];
