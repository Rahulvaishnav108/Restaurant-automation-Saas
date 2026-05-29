import React from 'react';
import { TrendingUp, ShoppingBag, Users, Clock } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { RecentOrdersTable } from '../components/RecentOrdersTable';
import { RevenueChart } from '../components/RevenueChart';
import { ActivityFeed } from '../components/ActivityFeed';
import { TableOverview } from '../components/TableOverview';
import { TopMenuItems } from '../components/TopMenuItems';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">{"Welcome back, Debesh! Here is what's happening today."}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value="₹48,200" change="+12% from yesterday" changeType="increase" icon={TrendingUp} iconBg="bg-orange-50" iconColor="text-orange-500" />
        <StatCard title="Orders Today" value="142" change="+8 in last hour" changeType="increase" icon={ShoppingBag} iconBg="bg-blue-50" iconColor="text-blue-500" />
        <StatCard title="Active Customers" value="67" change="12 tables occupied" changeType="neutral" icon={Users} iconBg="bg-green-50" iconColor="text-green-500" />
        <StatCard title="Avg Order Time" value="18 min" change="-2 min vs last week" changeType="increase" icon={Clock} iconBg="bg-purple-50" iconColor="text-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><RevenueChart /></div>
        <div><ActivityFeed /></div>
      </div>

      <TableOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><RecentOrdersTable /></div>
        <div><TopMenuItems /></div>
      </div>
    </div>
  );
};

export default AdminDashboard;