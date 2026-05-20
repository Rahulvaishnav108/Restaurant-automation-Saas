import type { RouteObject } from 'react-router-dom';
import CustomerLayout from '../layouts/CustomerLayout';
import CustomerDashboard from '../features/customer/pages/CustomerDashboard';

export const customerRoutes: RouteObject[] = [
  {
    path: '/customer',
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <CustomerDashboard />,
      },
    ],
  },
];
