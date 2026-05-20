import { Building2, Globe2, LineChart } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { AppShell } from './AppShell';

export default function SuperAdminLayout(): JSX.Element {
  return (
    <AppShell
      title="Platform Operations"
      subtitle="Operate multi-tenant growth, guardrails, and rollout quality from one SaaS cockpit."
      accent="from-slate-700 via-slate-500 to-zinc-300"
      stats={[
        { label: 'Tenants Live', value: '128', icon: Building2 },
        { label: 'Platform Uptime', value: '99.98%', icon: Globe2 },
        { label: 'MRR Growth', value: '+18%', icon: LineChart },
      ]}
    >
      <Outlet />
    </AppShell>
  );
}
