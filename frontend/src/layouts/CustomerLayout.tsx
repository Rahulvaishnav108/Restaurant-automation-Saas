import { Clock3, Sparkles, UtensilsCrossed } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { AppShell } from './AppShell';

export default function CustomerLayout(): JSX.Element {
  return (
    <AppShell
      title="Customer Experience"
      subtitle="Fast QR ordering, live kitchen progress, and beautifully guided dining sessions."
      accent="from-emerald-500 via-lime-400 to-yellow-300"
      stats={[
        { label: 'Average Reorder', value: '2.3x', icon: Sparkles },
        { label: 'Prep ETA', value: '14 min', icon: Clock3 },
        { label: 'Active Tables', value: '11', icon: UtensilsCrossed },
      ]}
    >
      <Outlet />
    </AppShell>
  );
}
