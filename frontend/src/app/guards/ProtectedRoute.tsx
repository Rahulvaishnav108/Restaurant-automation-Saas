/* eslint-disable @typescript-eslint/no-unused-vars */
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { appRoutes } from '../../shared/constants/routes';

export function ProtectedRoute(): JSX.Element {
  // const { isAuthenticated } = useAuth();
  // const location = useLocation();

  // if (!isAuthenticated) {
  //   return <Navigate replace state={{ from: location }} to={appRoutes.authLogin} />;
  // }

  return <Outlet />;
}
