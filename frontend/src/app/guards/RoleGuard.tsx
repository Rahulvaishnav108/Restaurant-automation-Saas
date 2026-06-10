/* eslint-disable @typescript-eslint/no-unused-vars */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, type AppRole } from '../../auth/AuthProvider';
import { appRoutes } from '../../shared/constants/routes';

type RoleGuardProps = {
  roles: AppRole[];
};

export function RoleGuard({ roles }: RoleGuardProps): JSX.Element {
  // const { user } = useAuth();

  // if (!user) {
  //   return <Navigate replace to={appRoutes.home} />;
  // }

  // if (!roles.includes(user.role)) {
  //   const fallback = user.role === 'super-admin' ? appRoutes.superAdmin : `/${user.role}`;
  //   return <Navigate replace to={fallback} />;
  // }

  return <Outlet />;
}
