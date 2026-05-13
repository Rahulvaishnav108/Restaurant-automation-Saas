import type { RouteObject } from 'react-router-dom';
import KitchenLayout from '../layouts/KitchenLayout';
import { RoleDashboard } from './shared';

export const kitchenRoutes: RouteObject[] = [
  {
    path: '/kitchen',
    element: <KitchenLayout />,
    children: [
      {
        index: true,
        element: (
          <RoleDashboard
            title="Kitchen Throughput Board"
            description="An industry-standard kitchen surface highlights batching, timing pressure, and prep bottlenecks immediately."
            highlights={['Batch optimization', 'Delay escalation', 'Station-level prioritization']}
          />
        ),
      },
    ],
  },
];
