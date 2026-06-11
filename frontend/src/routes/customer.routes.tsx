import React from 'react';
import type { RouteObject } from 'react-router-dom';
import CustomerLayout from '../layouts/CustomerLayout';
import CustomerDashboard from '../features/customer/pages/CustomerDashboard';
import MenuPage from '../features/customer/pages/MenuPage';
import CheckoutPage from '../features/customer/pages/CheckoutPage';
import OrderTrackingPage from '../features/customer/pages/OrderTrackingPage';
import TableReservationPage from '../features/customer/pages/TableReservationPage';
import FeedbackPage from '../features/customer/pages/FeedbackPage';
import ProfilePage from '../features/customer/pages/ProfilePage';

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
        element: <MenuPage />,
      },
      {
        path: 'checkout',
        element: <CheckoutPage />,
      },
      {
        path: 'orders',
        element: <OrderTrackingPage />,
      },
      {
        path: 'reservations',
        element: <TableReservationPage />,
      },
      {
        path: 'feedback',
        element: <FeedbackPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
];
