import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeLabel?: string;
  positive: boolean;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export function StatCard({ title, value, change, changeLabel = 'vs Yesterday', positive, icon: Icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md dark:hover:shadow-gray-800/40 transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1.5">{value}</p>
          <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
            {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{change}</span>
            <span className="text-gray-400 dark:text-gray-500 font-normal ml-1">{changeLabel}</span>
          </div>
        </div>
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}