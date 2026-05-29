import React from 'react';
import { TrendingUp, ShoppingBag, Receipt, Users, RefreshCw, Wallet } from 'lucide-react';
import { useReportsStore } from '../../store/reports.store';

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string | number;
  change: string;
}

function StatCard({ icon, iconBg, label, value, change }: StatCardProps) {
  const positive = change.startsWith('↑') || change.startsWith('+');
  return (
    <div className="flex-1 min-w-0 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-3.5">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>{icon}</div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-tight">{label}</p>
      </div>
      <p className="text-xl font-black text-gray-900 dark:text-gray-100 leading-tight">{value}</p>
      <p className={`text-xs font-medium mt-0.5 ${positive ? 'text-green-500' : 'text-red-500'}`}>{change}</p>
    </div>
  );
}

export function ReportStatCards(): JSX.Element {
  const { stats } = useReportsStore();
  return (
    <div className="flex flex-wrap gap-3">
      <StatCard icon={<TrendingUp className="w-4 h-4 text-orange-500" />} iconBg="bg-orange-50 dark:bg-orange-950/50" label="Total Revenue"       value={stats.totalRevenue}      change={stats.totalRevenueChange} />
      <StatCard icon={<ShoppingBag className="w-4 h-4 text-blue-500" />}  iconBg="bg-blue-50 dark:bg-blue-950/40"   label="Total Orders"         value={stats.totalOrders}       change={stats.totalOrdersChange} />
      <StatCard icon={<Receipt className="w-4 h-4 text-purple-500" />}    iconBg="bg-purple-50 dark:bg-purple-950/40" label="Avg. Order Value"   value={stats.avgOrderValue}     change={stats.avgOrderValueChange} />
      <StatCard icon={<Users className="w-4 h-4 text-green-500" />}       iconBg="bg-green-50 dark:bg-green-950/40"  label="Total Customers"     value={stats.totalCustomers}    change={stats.totalCustomersChange} />
      <StatCard icon={<RefreshCw className="w-4 h-4 text-amber-500" />}   iconBg="bg-amber-50 dark:bg-amber-950/40"  label="Repeat Customers"    value={stats.repeatCustomers}   change={stats.repeatCustomersChange} />
      <StatCard icon={<Wallet className="w-4 h-4 text-emerald-500" />}    iconBg="bg-emerald-50 dark:bg-emerald-950/40" label="Net Profit"       value={stats.netProfit}         change={stats.netProfitChange} />
    </div>
  );
}