import { BellRing, ClipboardList, HandPlatter } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { AppShell } from './AppShell';

export default function StaffLayout(): JSX.Element {
  return (
    <AppShell
      title="Service Staff"
      subtitle="Table turns, guest requests, and handoff visibility built for fast floor execution."
      accent="from-sky-500 via-cyan-400 to-teal-300"
      stats={[
        { label: 'Pending Requests', value: '7', icon: BellRing },
        { label: 'Tables Assigned', value: '12', icon: ClipboardList },
        { label: 'Orders To Serve', value: '9', icon: HandPlatter },
      ]}
    >
      <Outlet />
    </AppShell>
  );
}
