import React from 'react';
import { Progress, theme } from 'antd';
import { Flame } from 'lucide-react';
import { KitchenLoad } from '../api/kitchen.api';
import { typographyTheme } from '../../../shared/theme/typography';

interface LoadIndicatorProps {
  loadData: KitchenLoad | undefined;
  isLoading: boolean;
}

export default function LoadIndicator({ loadData, isLoading: _isLoading }: LoadIndicatorProps): JSX.Element {
  const { token } = theme.useToken();
  const isDark = token.colorBgBase === '#0f172a' || token.colorBgBase === '#111827';

  const load = loadData?.load || 'Medium';
  const count = loadData?.activeOrdersCount || 0;

  const getLoadConfig = (status: string) => {
    switch (status) {
      case 'Low':
        return {
          gradient: { '0%': '#10b981', '100%': '#059669' },
          percentage: 30,
          label: 'Low',
          textColor: 'text-emerald-500',
          desc: 'Smooth operations. All stations running optimally.'
        };
      case 'High':
        return {
          gradient: { '0%': '#f43f5e', '100%': '#e11d48' },
          percentage: 90,
          label: 'High',
          textColor: 'text-rose-500',
          desc: 'High ticket count. Prep queues under SLA pressure!'
        };
      default: // Medium
        return {
          gradient: { '0%': '#f59e0b', '100%': '#d97706' },
          percentage: 60,
          label: 'Medium',
          textColor: 'text-amber-500',
          desc: 'Steady service flow. Keeping pace with incoming orders.'
        };
    }
  };

  const config = getLoadConfig(load);

  return (
    <div className={`rounded-2xl border p-5 transition-colors duration-200 ${
      isDark 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-gray-100 shadow-sm'
    }`}>
      {/* Title */}
      <div className={`flex items-center gap-2 mb-4 border-b pb-3 ${isDark ? 'border-gray-800/60' : 'border-gray-100'}`}>
        <Flame className={`h-4.5 w-4.5 animate-pulse ${load === 'High' ? 'text-rose-500 animate-bounce' : load === 'Medium' ? 'text-amber-400' : 'text-emerald-500'}`} />
        <h3 className={`${typographyTheme.sizes.h2} ${typographyTheme.colors.primary}`}>Kitchen Pressure</h3>
      </div>

      {/* Grid split */}
      <div className="flex flex-col sm:flex-row items-center gap-5 py-2">
        {/* Left Side: Circular Gauge */}
        <div className="relative flex items-center justify-center flex-shrink-0">
          <Progress
            type="dashboard"
            percent={config.percentage}
            strokeColor={config.gradient}
            trailColor={isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'}
            strokeWidth={10}
            width={120}
            gapDegree={70}
            format={() => (
              <div className="flex flex-col items-center justify-center">
                <span className={`text-2xl font-black leading-none ${typographyTheme.colors.primary}`}>{count}</span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider mt-1">Tickets</span>
              </div>
            )}
          />
        </div>

        {/* Right Side: Threshold Classification List */}
        <div className="flex-1 w-full space-y-1 text-[11px] font-medium">
          <div className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1.5 pl-1">
            Status Breakdown
          </div>

          {/* Low */}
          <div className={`flex items-center justify-between px-2 py-1 rounded-lg border ${
            load === 'Low' 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400 font-bold' 
              : 'border-transparent text-slate-500 dark:text-slate-400'
          }`}>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Low Volume
            </span>
            <span>0-40%</span>
          </div>

          {/* Medium */}
          <div className={`flex items-center justify-between px-2 py-1 rounded-lg border ${
            load === 'Medium' 
              ? 'bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400 font-bold' 
              : 'border-transparent text-slate-500 dark:text-slate-400'
          }`}>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Medium Volume
            </span>
            <span>41-80%</span>
          </div>

          {/* High */}
          <div className={`flex items-center justify-between px-2 py-1 rounded-lg border ${
            load === 'High' 
              ? 'bg-rose-50 border-rose-100 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400 font-bold' 
              : 'border-transparent text-slate-500 dark:text-slate-400'
          }`}>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-bounce" />
              High Volume
            </span>
            <span>81-100%</span>
          </div>

          {/* Critical */}
          <div className="flex items-center justify-between px-2 py-1 rounded-lg border border-transparent text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-700" />
              Critical Volume
            </span>
            <span>100%+</span>
          </div>
        </div>
      </div>

      <div className={`mt-3.5 pt-3.5 border-t text-center ${isDark ? 'border-gray-800/60' : 'border-gray-100'}`}>
        <p className={`text-[11px] leading-relaxed max-w-[260px] mx-auto italic border-l-2 border-orange-500/30 px-3 ${typographyTheme.colors.secondary}`}>
          &ldquo;{config.desc}&rdquo;
        </p>
      </div>
    </div>
  );
}
