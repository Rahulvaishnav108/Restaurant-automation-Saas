import { ArrowDownRight, ArrowRight, ArrowUpRight, CircleCheck, Clock3, Search, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { AppRole } from '../../../auth/AuthProvider';

const modules: Record<AppRole, string[]> = {
  customer: ['Discover', 'Digital menu', 'Order checkout', 'Order tracking', 'Reservations', 'Rewards & feedback', 'Guest profile'],
  admin: ['Menu management', 'Live orders', 'Reservations', 'Customers', 'Inventory', 'Team management', 'Reports', 'Floor plan', 'Restaurant settings'],
  staff: ['Service overview', 'Table service', 'Live orders', 'Food ready', 'Guest requests', 'Reservations', 'Table turnover', 'Menu availability', 'Service reports', 'Alerts'],
  kitchen: ['Kitchen overview', 'Order queue', 'Batch cooking', 'Kitchen inventory', 'Stations', 'Team workload', 'Kitchen analytics', 'Reports', 'Kitchen settings'],
  cleaning: ['Cleaning overview', 'Table turnover', 'Guest requests', 'Cleaning tasks', 'Team profile', 'Cleaning settings'],
  'super-admin': ['Platform overview', 'Restaurant tenants', 'Subscriptions', 'Transactions', 'Platform analytics', 'System alerts', 'Audit trail', 'Platform settings'],
};

const rows = [
  { ref: 'ORD-1048', name: 'Smoked paneer · Garden salad', place: 'Table 04', status: 'Preparing', time: '2 min ago', amount: '₹1,240' },
  { ref: 'ORD-1047', name: 'Truffle pasta · Lemon soda', place: 'Table 11', status: 'Ready to serve', time: '6 min ago', amount: '₹1,680' },
  { ref: 'ORD-1046', name: 'Margherita · Tiramisu', place: 'Takeaway', status: 'Confirmed', time: '9 min ago', amount: '₹920' },
  { ref: 'ORD-1045', name: 'Butter chicken · Garlic naan', place: 'Table 02', status: 'Completed', time: '14 min ago', amount: '₹1,420' },
];

const stats: Record<AppRole, Array<{ label: string; value: string; change: string }>> = {
  customer: [{ label: 'Your rewards', value: '420 pts', change: '+40 this visit' }, { label: 'Orders this month', value: '8', change: '2 in progress' }, { label: 'Saved places', value: '6', change: '3 nearby' }],
  admin: [{ label: 'Today’s revenue', value: '₹28,750', change: '+12.8% vs yesterday' }, { label: 'Orders today', value: '64', change: '7 in progress' }, { label: 'Guests served', value: '48', change: '+8 today' }],
  staff: [{ label: 'Tables in service', value: '17 / 28', change: '4 need attention' }, { label: 'Orders to deliver', value: '7', change: '2 ready now' }, { label: 'Reservations', value: '12', change: 'Next at 7:30 PM' }],
  kitchen: [{ label: 'Active tickets', value: '7', change: '2 ready to plate' }, { label: 'Average prep', value: '14 min', change: '2 min faster' }, { label: 'Station load', value: '68%', change: 'Smooth service' }],
  cleaning: [{ label: 'Tasks today', value: '18', change: '12 complete' }, { label: 'Tables to reset', value: '3', change: '1 high priority' }, { label: 'Turnover time', value: '6 min', change: 'On target' }],
  'super-admin': [{ label: 'Restaurants', value: '128', change: '6 joined this month' }, { label: 'Active plans', value: '114', change: '89% retention' }, { label: 'Monthly revenue', value: '₹8.4L', change: '+9.6% growth' }],
};

const displayRole: Record<AppRole, string> = { customer: 'Guest experience', admin: 'Restaurant operations', staff: 'Front of house', kitchen: 'Kitchen operations', cleaning: 'Table care', 'super-admin': 'Platform control' };

export default function DemoWorkspacePage({ role }: { role: AppRole }): JSX.Element {
  const location = useLocation();
  const [search, setSearch] = useState('');
  const module = useMemo(() => {
    if (role === 'admin' && location.pathname === '/admin') return 'Operations overview';
    const tail = location.pathname.split('/').filter(Boolean).at(-1) ?? '';
    if (!tail || tail === role || tail === 'customer') return modules[role][0];
    return tail.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  }, [location.pathname, role]);
  const filteredRows = rows.filter((row) => `${row.ref} ${row.name} ${row.place} ${row.status}`.toLowerCase().includes(search.toLowerCase()));
  const workspaceRoot = role === 'super-admin' ? '/superadmin' : `/${role}`;

  return (
    <main className="spatial-dashboard space-y-6 p-4 sm:p-7">
      <header className="spatial-panel spatial-panel-tint flex flex-wrap items-center justify-between gap-4 p-5 sm:p-7">
        <div><span className="spatial-eyebrow">{displayRole[role]} · Amber Table</span><h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">{module}</h1><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">Explore the {role === 'super-admin' ? 'RestoHub platform' : 'restaurant'} workspace with safe sample data.</p></div>
        <span className="spatial-subtle-chip"><Sparkles size={13} className="mr-1.5" /> Demo workspace</span>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        {stats[role].map((stat, index) => <article key={stat.label} className={`spatial-metric spatial-metric-${['lime', 'orange', 'blue'][index]}`}><span className="spatial-eyebrow">{stat.label}</span><div className="mt-4 text-3xl font-semibold tracking-tight">{stat.value}</div><p className="mt-2 flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]"><ArrowUpRight size={13} className="text-emerald-600" />{stat.change}</p></article>)}
      </section>

      <section className="spatial-panel overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6"><div><p className="spatial-eyebrow">Sample activity</p><h2 className="mt-1 text-xl font-semibold">{role === 'customer' ? 'Recent orders' : role === 'cleaning' ? 'Turnover queue' : role === 'super-admin' ? 'Recent platform activity' : 'Live service queue'}</h2></div><label className="flex h-10 items-center gap-2 rounded-xl border border-[var(--spatial-line)] px-3"><Search size={15} className="text-[hsl(var(--muted-foreground))]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search sample activity" className="w-44 bg-transparent text-sm outline-none" /></label></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[620px]"><thead><tr className="spatial-table-head"><th>Reference</th><th>Details</th><th>Location</th><th>Status</th><th>Amount</th></tr></thead><tbody>{filteredRows.map((row, index) => <tr key={row.ref} className="spatial-table-row"><td className="font-semibold">{role === 'customer' ? `#${row.ref}` : role === 'cleaning' ? `TASK-${index + 11}` : row.ref}</td><td><span className="block max-w-64 truncate">{role === 'cleaning' ? `${row.place} · Reset and sanitize` : row.name}</span><span className="spatial-time mt-1 inline-flex items-center gap-1"><Clock3 size={11} />{row.time}</span></td><td>{row.place}</td><td><span className="spatial-order-status inline-flex items-center gap-1"><CircleCheck size={11} />{row.status}</span></td><td className="font-semibold">{role === 'cleaning' || role === 'kitchen' || role === 'staff' ? '—' : row.amount}</td></tr>)}</tbody></table></div>
        {!filteredRows.length && <p className="p-8 text-center text-sm text-[hsl(var(--muted-foreground))]">No matching sample activity.</p>}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--spatial-line)] px-5 py-4 text-xs text-[hsl(var(--muted-foreground))]"><span>All information is synthetic and stored only in this preview.</span><span className="inline-flex items-center gap-1"><ArrowDownRight size={13} /> No live orders or payments</span></div>
      </section>

      <section className="spatial-panel p-5 sm:p-6"><p className="spatial-eyebrow">Workspace modules</p><div className="mt-4 flex flex-wrap gap-2">{modules[role].map((item, index) => <Link key={item} to={index === 0 && role !== 'admin' ? workspaceRoot : `${workspaceRoot}/${item.toLowerCase().replaceAll(' ', '-')}`} className="spatial-subtle-chip transition hover:-translate-y-0.5">{item}<ArrowRight size={12} className="ml-1" /></Link>)}</div></section>
    </main>
  );
}
