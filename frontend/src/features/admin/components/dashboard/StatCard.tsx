import React from 'react';
import { LucideIcon, TrendingUp } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string;
  change: string;
changeType: "increase" | "decrease" | "neutral";  
icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export function StatCard({ title, value, change, icon: Icon, iconBg, iconColor }: StatCardProps) {
  const isPositive = change.startsWith('+');
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{value}</p>
      <div className="flex items-center gap-1">
        <TrendingUp className={`w-3.5 h-3.5 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
        <span className={`text-xs font-semibold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>{change}</span>
        <span className="text-xs text-gray-400 dark:text-gray-500 ml-0.5">vs Yesterday</span>
      </div>
    </div>
  );
}