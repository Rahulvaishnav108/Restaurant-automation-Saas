import React from 'react';
import {
  DollarSign, ShoppingBag, Users, TrendingUp,
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { RevenueChart } from '../components/RevenueChart';
import { TopSellingItems } from '../components/TopSellingItems';
import { OrderStatusChart } from '../components/OrderStatusChart';
import { StaffOverview } from '../components/StaffOverview';
import { UpcomingReservations } from '../components/UpcomingReservations';
import { RecentOrders } from '../components/RecentOrders';
import { LowStockAlerts } from '../components/LowStockAlerts';

const stats = [
  {
    title: 'Total Revenue',
    value: '₹48,200',
    change: '12.5%',
    positive: true,
    icon: TrendingUp,
    iconBg: 'bg-orange-100 dark:bg-orange-500/20',
    iconColor: 'text-orange-500',
  },
  {
    title: 'Orders',
    value: '156',
    change: '8.2%',
    positive: true,
    icon: ShoppingBag,
    iconBg: 'bg-blue-100 dark:bg-blue-500/20',
    iconColor: 'text-blue-500',
  },
  {
    title: 'Customers',
    value: '128',
    change: '6.1%',
    positive: true,
    icon: Users,
    iconBg: 'bg-emerald-100 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-500',
  },
  {
    title: 'Avg. Order Value',
    value: '₹7,641',
    change: '4.3%',
    positive: true,
    icon: TrendingUp,
    iconBg: 'bg-purple-100 dark:bg-purple-500/20',
    iconColor: 'text-purple-500',
  },
];

export default function AdminDashboard() {
  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fadeIn">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Overview of your restaurant operations</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-xl w-fit">
          📅 Today, May 20
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <RevenueChart />
        </div>
        <div className="lg:col-span-2">
          <TopSellingItems />
        </div>
      </div>

      {/* Order status + Staff overview */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <OrderStatusChart />
        </div>
        <div className="lg:col-span-3">
          <StaffOverview />
        </div>
      </div>

      {/* Right column panels — 3 col grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UpcomingReservations />
        <RecentOrders />
        <LowStockAlerts />
      </div>
    </div>
  );
}