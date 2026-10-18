import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../shared/services/apiClient';
import { ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, Clock3, CookingPot, IndianRupee, LayoutGrid, RefreshCw, ShoppingBag, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { env } from '../../../lib/env';

type DashboardData = {
  metrics: { revenue: number; revenueChange: number | null; orders: number; activeOrders: number; customers: number };
  revenue: Array<{ date: string; label: string; total: number }>;
  recentOrders: Array<{ id: string; table: string; items: string; total: number; status: string; createdAt: string }>;
  topItems: Array<{ name: string; quantity: number; revenue: number }>;
  tables: Record<string, number>;
  upcomingReservations: Array<{ id: string; name: string; date: string; slot: string; guests: number; status: string }>;
  generatedAt: string;
};

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const timeAgo = (value: string) => {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
  return minutes < 1 ? 'Just now' : minutes < 60 ? `${minutes}m ago` : `${Math.floor(minutes / 60)}h ago`;
};

function createDemoDashboard(): DashboardData {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 6);
  const revenue = [18400, 22100, 16750, 29400, 25800, 33200, 28750].map((total, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return { date: date.toISOString().slice(0, 10), label: new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date), total };
  });
  return {
    metrics: { revenue: 28750, revenueChange: 12.8, orders: 64, activeOrders: 7, customers: 48 },
    revenue,
    recentOrders: [
      { id: 'AT-1048', table: 'T-04', items: 'Smoked paneer, Garden salad', total: 1240, status: 'PREPARING', createdAt: new Date(Date.now() - 8 * 60000).toISOString() },
      { id: 'AT-1047', table: 'T-11', items: 'Truffle pasta, Lemon soda', total: 1680, status: 'READY', createdAt: new Date(Date.now() - 14 * 60000).toISOString() },
      { id: 'AT-1046', table: 'Takeaway', items: 'Margherita pizza, Tiramisu', total: 920, status: 'CONFIRMED', createdAt: new Date(Date.now() - 19 * 60000).toISOString() },
      { id: 'AT-1045', table: 'T-02', items: 'Butter chicken, Garlic naan', total: 1420, status: 'SERVED', createdAt: new Date(Date.now() - 32 * 60000).toISOString() },
    ],
    topItems: [
      { name: 'Smoked paneer', quantity: 42, revenue: 21000 },
      { name: 'Truffle pasta', quantity: 36, revenue: 25200 },
      { name: 'Garden salad', quantity: 29, revenue: 11600 },
      { name: 'Butter chicken', quantity: 24, revenue: 19200 },
    ],
    tables: { AVAILABLE: 9, OCCUPIED: 13, ORDERING: 4, NEEDS_CLEANING: 2 },
    upcomingReservations: [
      { id: 'demo-r1', name: 'Aarav Mehta', date: today.toISOString().slice(0, 10), slot: '7:30 PM', guests: 4, status: 'CONFIRMED' },
      { id: 'demo-r2', name: 'Anaya Kapoor', date: today.toISOString().slice(0, 10), slot: '8:00 PM', guests: 2, status: 'CONFIRMED' },
      { id: 'demo-r3', name: 'Ishaan Rao', date: new Date(today.getTime() + 86400000).toISOString().slice(0, 10), slot: '8:30 PM', guests: 6, status: 'PENDING' },
    ],
    generatedAt: today.toISOString(),
  };
}

export default function AdminDashboard(): JSX.Element {
  const dashboard = useQuery({
    queryKey: ['admin', 'restaurant-dashboard'],
    queryFn: async () => env.demoMode ? createDemoDashboard() : (await apiClient.get<{ data: DashboardData }>('/admin/restaurant/dashboard')).data.data,
    refetchInterval: env.demoMode ? false : 60_000,
  });
  const data = dashboard.data;
  const maxRevenue = Math.max(1, ...(data?.revenue.map((point) => point.total) ?? [0]));
  const occupied = Object.entries(data?.tables ?? {}).filter(([status]) => ['OCCUPIED', 'ORDERING', 'BILL_PENDING', 'PAYMENT_PENDING', 'PAID'].includes(status)).reduce((sum, [, count]) => sum + count, 0);
  const tableTotal = Object.values(data?.tables ?? {}).reduce((sum, count) => sum + count, 0);
  const change = data?.metrics.revenueChange;

  return (
    <div className="spatial-dashboard space-y-6 sm:space-y-8">
      <section className="spatial-welcome relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-xl"><Sparkles size={13} /> Service overview <span className="spatial-live-dot" /> {env.demoMode ? 'Demo data' : 'Live'}</div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Your restaurant, <span className="font-serif italic text-lime-200">in rhythm.</span></h1>
          <p className="mt-2 text-sm text-white/65">Today at a glance. Your floor, kitchen, and sales in one place.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/admin/orders" className="spatial-hero-action"><ShoppingBag size={16} /> View live orders <ArrowRight size={15} /></Link>
            <Link to="/admin/tables" className="spatial-hero-secondary"><LayoutGrid size={15} /> Manage floor</Link>
          </div>
        </div>
        <div className="spatial-orbit spatial-orbit-one" /><div className="spatial-orbit spatial-orbit-two" />
        <div className="spatial-welcome-glow" />
      </section>

      {dashboard.isError ? (
        <section className="spatial-panel flex flex-col items-center gap-3 px-6 py-12 text-center">
          <div className="spatial-icon-tile"><RefreshCw size={20} /></div><h2 className="text-lg font-semibold">Dashboard data couldn’t load</h2>
          <p className="max-w-md text-sm text-[hsl(var(--muted-foreground))]">Check the connection and try again. Live figures will appear here when the service responds.</p>
          <button className="spatial-button" onClick={() => void dashboard.refetch()}>Try again</button>
        </section>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <Metric label="Revenue today" value={data ? currency.format(data.metrics.revenue) : '—'} detail={change == null ? 'Compared with yesterday' : `${change >= 0 ? '+' : ''}${change.toFixed(1)}% vs yesterday`} icon={IndianRupee} tone="lime" positive={change == null || change >= 0} loading={dashboard.isLoading} />
            <Metric label="Orders today" value={data ? String(data.metrics.orders) : '—'} detail={`${data?.metrics.activeOrders ?? '—'} in progress`} icon={ShoppingBag} tone="orange" loading={dashboard.isLoading} />
            <Metric label="Guests served" value={data ? String(data.metrics.customers) : '—'} detail="Distinct customers" icon={Users} tone="violet" loading={dashboard.isLoading} />
            <Metric label="Tables in service" value={data ? `${occupied} / ${tableTotal}` : '—'} detail={tableTotal ? `${Math.round((occupied / tableTotal) * 100)}% occupied` : 'No active tables'} icon={LayoutGrid} tone="blue" loading={dashboard.isLoading} />
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <article className="spatial-panel p-5 sm:p-6 xl:col-span-8">
              <div className="flex items-start justify-between gap-4"><div><p className="spatial-eyebrow">The last seven days</p><h2 className="mt-1 text-xl font-semibold">Revenue flow</h2></div><span className="spatial-subtle-chip"><span className="spatial-live-dot" /> Updated live</span></div>
              {dashboard.isLoading ? <div className="spatial-chart-skeleton mt-8" /> : (
                <div className="mt-7 grid h-52 grid-cols-7 items-end gap-2 sm:gap-4">
                  {(data?.revenue ?? []).map((point) => <div className="flex h-full flex-col items-center justify-end gap-2" key={point.date} title={`${point.label}: ${currency.format(point.total)}`}>
                    <span className="text-[10px] font-medium text-[hsl(var(--muted-foreground))]">{point.total ? currency.format(point.total) : '—'}</span>
                    <div className="spatial-bar-track"><div className="spatial-bar" style={{ height: `${Math.max(4, (point.total / maxRevenue) * 100)}%` }} /></div>
                    <span className="text-[11px] font-medium text-[hsl(var(--muted-foreground))]">{point.label}</span>
                  </div>)}
                </div>
              )}
            </article>

            <article className="spatial-panel spatial-panel-tint p-5 sm:p-6 xl:col-span-4">
              <div className="flex items-start justify-between"><div><p className="spatial-eyebrow">Right now</p><h2 className="mt-1 text-xl font-semibold">Floor pulse</h2></div><Link to="/admin/tables" aria-label="Open table management" className="spatial-round-action"><ArrowRight size={16} /></Link></div>
              <div className="mt-6 flex items-end gap-3"><span className="font-serif text-5xl leading-none">{occupied}</span><span className="pb-1 text-sm text-[hsl(var(--muted-foreground))]">of {tableTotal} tables occupied</span></div>
              <div className="spatial-meter mt-5"><div style={{ width: `${tableTotal ? (occupied / tableTotal) * 100 : 0}%` }} /></div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                {Object.entries(data?.tables ?? {}).slice(0, 4).map(([status, count]) => <div className="spatial-status-row" key={status}><span>{status.replaceAll('_', ' ').toLowerCase()}</span><strong>{count}</strong></div>)}
                {!dashboard.isLoading && !tableTotal && <p className="col-span-2 py-3 text-sm text-[hsl(var(--muted-foreground))]">Add tables to see your floor status.</p>}
              </div>
            </article>
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <article className="spatial-panel overflow-hidden xl:col-span-8">
              <div className="flex items-center justify-between px-5 py-5 sm:px-6"><div><p className="spatial-eyebrow">Service flow</p><h2 className="mt-1 text-xl font-semibold">Recent orders</h2></div><Link to="/admin/orders" className="spatial-text-link">All orders <ArrowRight size={14} /></Link></div>
              {data?.recentOrders.length ? <div className="overflow-x-auto"><table className="w-full min-w-[560px]"><thead><tr className="spatial-table-head"><th>Order</th><th>Table</th><th>Items</th><th>Total</th><th>Status</th><th>Time</th></tr></thead><tbody>{data.recentOrders.map((order) => <tr className="spatial-table-row" key={order.id}><td className="font-semibold">#{order.id}</td><td>{order.table}</td><td className="max-w-48 truncate">{order.items || '—'}</td><td className="font-semibold">{currency.format(order.total)}</td><td><span className="spatial-order-status">{order.status.replaceAll('_', ' ').toLowerCase()}</span></td><td>{timeAgo(order.createdAt)}</td></tr>)}</tbody></table></div> : <EmptyTile loading={dashboard.isLoading} title="No orders yet" detail="New orders will appear here as they come in." />}
            </article>

            <article className="spatial-panel p-5 sm:p-6 xl:col-span-4"><div className="flex items-start justify-between"><div><p className="spatial-eyebrow">This week</p><h2 className="mt-1 text-xl font-semibold">Guest favourites</h2></div><span className="spatial-icon-tile"><CookingPot size={17} /></span></div>
              {data?.topItems.length ? <div className="mt-5 space-y-4">{data.topItems.map((item, index) => <div className="flex items-center gap-3" key={item.name}><span className="spatial-rank">0{index + 1}</span><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><span className="truncate text-sm font-medium">{item.name}</span><span className="text-xs text-[hsl(var(--muted-foreground))]">{item.quantity} sold</span></div><div className="spatial-mini-meter mt-2"><div style={{ width: `${Math.max(8, (item.quantity / (data.topItems[0]?.quantity || 1)) * 100)}%` }} /></div></div></div>)}</div> : <EmptyTile loading={dashboard.isLoading} title="Your bestsellers will show up here" detail="Complete a few orders to see what guests love." />}
            </article>
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <article className="spatial-panel p-5 sm:p-6 xl:col-span-7"><div className="flex items-center justify-between"><div><p className="spatial-eyebrow">Coming up</p><h2 className="mt-1 text-xl font-semibold">Reservations</h2></div><Link to="/admin/reservations" className="spatial-text-link">View schedule <ArrowRight size={14} /></Link></div>
              {data?.upcomingReservations.length ? <div className="mt-5 space-y-3">{data.upcomingReservations.map((reservation) => <div className="spatial-reservation-row" key={reservation.id}><span className="spatial-reservation-icon"><CalendarDays size={17} /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{reservation.name}</p><p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">{reservation.date} · {reservation.guests} guests</p></div><span className="spatial-time"><Clock3 size={13} />{reservation.slot}</span></div>)}</div> : <EmptyTile loading={dashboard.isLoading} title="No reservations on the books" detail="New bookings will appear here." />}
            </article>
            <article className="spatial-panel spatial-quiet-panel flex min-h-48 flex-col justify-between p-6 xl:col-span-5"><div><p className="spatial-eyebrow">A calmer service starts here</p><h2 className="mt-2 max-w-sm font-serif text-3xl leading-tight">Small details. <span className="italic text-[hsl(var(--primary))]">Seamless evenings.</span></h2></div><div className="flex items-center justify-between"><span className="text-xs text-[hsl(var(--muted-foreground))]">Live overview refreshes every minute</span><button className="spatial-round-action" onClick={() => void dashboard.refetch()} aria-label="Refresh dashboard"><RefreshCw size={15} /></button></div></article>
          </section>
        </>
      )}
    </div>
  );
}

function Metric({ label, value, detail, icon: Icon, tone, positive, loading }: { label: string; value: string; detail: string; icon: typeof IndianRupee; tone: string; positive?: boolean; loading: boolean }) {
  return <article className={`spatial-metric spatial-metric-${tone}`}><div className="flex items-center justify-between"><span className="spatial-eyebrow">{label}</span><span className="spatial-metric-icon"><Icon size={17} /></span></div><div className={`mt-5 text-2xl font-semibold tracking-tight sm:text-3xl ${loading ? 'spatial-skeleton-text' : ''}`}>{value}</div><p className="mt-2 flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">{positive === false ? <ArrowDownRight size={13} className="text-rose-500" /> : <ArrowUpRight size={13} className="text-emerald-600" />}{detail}</p></article>;
}

function EmptyTile({ loading, title, detail }: { loading: boolean; title: string; detail: string }) {
  return <div className="spatial-empty-state">{loading ? <span className="spatial-skeleton-text">Loading live data…</span> : <><span className="spatial-icon-tile"><Sparkles size={16} /></span><p className="mt-3 text-sm font-semibold">{title}</p><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{detail}</p></>}</div>;
}
