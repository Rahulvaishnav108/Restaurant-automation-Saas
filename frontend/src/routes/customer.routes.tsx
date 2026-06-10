import React from 'react';
import type { RouteObject } from 'react-router-dom';
import CustomerLayout from '../layouts/CustomerLayout';
import CustomerDashboard from '../features/customer/pages/CustomerDashboard';
import MaintenancePage from '../features/customer/pages/MaintenancePage';

export const customerRoutes: RouteObject[] = [
  {
    path: '/customer',
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <CustomerDashboard />,
      },
      {
        path: 'menu',
        element: (
          <MaintenancePage
            title="Menu"
            description="Full menu with categories, filters, and cart is coming soon."
          />
        ),
      },
      {
        path: 'orders',
        element: (
          <MaintenancePage
            title="My Orders"
            description="Live order tracking and order history is coming soon."
          />
        ),
      },
      {
        path: 'services',
        element: (
          <MaintenancePage
            title="Services"
            description="Call waiter, request cleaning, and other table services coming soon."
          />
        ),
      },
      {
        path: 'profile',
        element: (
          <MaintenancePage
            title="Profile"
            description="Your profile, preferences, loyalty wallet, and theme settings coming soon."
          />
        ),
      },
    ],
  },
];
