import type { RouteObject } from 'react-router-dom';
import CleaningLayout from '../layouts/CleaningLayout';
import { RoleDashboard } from './shared';

export const cleaningRoutes: RouteObject[] = [
  {
    path: '/cleaning',
    element: <CleaningLayout />,
    children: [
      {
        index: true,
        element: (
          <RoleDashboard
            title="Cleaning and Reset Workflow"
            description="Cleanup teams need quick turn visibility, verification steps, and a fast path to return tables to service."
            highlights={['Table reset queue', 'Verification checklist', 'Turnaround timing signals']}
          />
        ),
      },
    ],
  },
];
