import { ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { AppShell } from './AppShell';

export default function AdminLayout(): JSX.Element {
  return (
    <AppShell
      title="Restaurant Admin"
      subtitle="Revenue, menu, staff, and floor operations in one command center."
      accent="from-orange-500 via-amber-400 to-red-500"
      stats={[
        { label: 'Revenue Today', value: 'Rs 48.2k', icon: TrendingUp },
        { label: 'Staff On Shift', value: '24', icon: Users },
        { label: 'Compliance', value: '99.4%', icon: ShieldCheck },
      ]}
    >
      <Outlet />
    </AppShell>
  );
}
