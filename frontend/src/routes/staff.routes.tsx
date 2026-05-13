import type { RouteObject } from 'react-router-dom';
import StaffLayout from '../layouts/StaffLayout';
import { RoleDashboard } from './shared';

export const staffRoutes: RouteObject[] = [
  {
    path: '/staff',
    element: <StaffLayout />,
    children: [
      {
        index: true,
        element: (
          <RoleDashboard
            title="Floor Execution Hub"
            description="Service staff need crisp visibility on table state, pending guest requests, and dish delivery sequencing."
            highlights={['Table lifecycle board', 'Waiter assistance queue', 'Billing handoff workflow']}
          />
        ),
      },
    ],
  },
];
