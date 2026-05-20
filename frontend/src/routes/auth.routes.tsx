import type { RouteObject } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../auth/pages/LoginPage';

export const authRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },
];
