import { Flame, Layers3, TimerReset } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { AppShell } from './AppShell';

export default function KitchenLayout(): JSX.Element {
  return (
    <AppShell
      title="Kitchen Control"
      subtitle="Batch tickets, hold SLAs, and spot blockers before service quality slips."
      accent="from-rose-500 via-orange-500 to-amber-400"
      stats={[
        { label: 'Orders Fired', value: '36', icon: Flame },
        { label: 'Batches Active', value: '8', icon: Layers3 },
        { label: 'Avg Ticket Time', value: '12 min', icon: TimerReset },
      ]}
    >
      <Outlet />
    </AppShell>
  );
}
