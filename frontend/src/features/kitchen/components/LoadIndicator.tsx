import React from 'react';
import { Card, Progress, theme } from 'antd';
import { Flame } from 'lucide-react';
import { KitchenLoad } from '../api/kitchen.api';

interface LoadIndicatorProps {
  loadData: KitchenLoad | undefined;
  isLoading: boolean;
}

export default function LoadIndicator({ loadData, isLoading }: LoadIndicatorProps): JSX.Element {
  const { token } = theme.useToken();
  const isDark = token.colorBgBase === '#0f172a';

  const load = loadData?.load || 'Medium';
  const count = loadData?.activeOrdersCount || 0;

  const getLoadConfig = (status: string) => {
    switch (status) {
      case 'Low':
        return {
          gradient: { '0%': '#10b981', '100%': '#059669' },
          trailColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)',
          percentage: 30,
          label: 'Low',
          textColor: 'text-emerald-500',
          desc: 'Smooth operations. All stations running optimally.'
        };
      case 'High':
        return {
          gradient: { '0%': '#f43f5e', '100%': '#e11d48' },
          trailColor: isDark ? 'rgba(244, 63, 94, 0.1)' : 'rgba(244, 63, 94, 0.08)',
          percentage: 90,
          label: 'High',
          textColor: 'text-rose-500',
          desc: 'High ticket count. Prep queues under SLA pressure!'
        };
      default: // Medium
        return {
          gradient: { '0%': '#f59e0b', '100%': '#d97706' },
          trailColor: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.08)',
          percentage: 60,
          label: 'Medium',
          textColor: 'text-amber-500',
          desc: 'Steady service flow. Keeping pace with incoming orders.'
        };
    }
  };

  const config = getLoadConfig(load);

  return (
    <Card
      loading={isLoading}
      title={
        <span className={`flex items-center gap-2 font-heading font-bold ${isDark ? 'text-stone-200' : 'text-slate-800'}`}>
          <Flame className={`h-4 w-4 animate-pulse ${load === 'High' ? 'text-rose-500 animate-bounce' : load === 'Medium' ? 'text-amber-400' : 'text-emerald-500'}`} />
          Kitchen Pressure
        </span>
      }
      className={`border rounded-[1.75rem] overflow-hidden transition-all duration-300 ${
        isDark 
          ? 'border-white/10 bg-white/5 backdrop-blur-xl text-stone-200' 
          : 'border-slate-200 bg-white/80 backdrop-blur-md shadow-sm text-slate-800'
      }`}
      styles={{
        header: { borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #f1f5f9' }
      }}
    >
      <div className="flex flex-col items-center gap-5 py-2">
        {/* Circular Gauge */}
        <div className="relative flex items-center justify-center">
          <Progress
            type="dashboard"
            percent={config.percentage}
            strokeColor={config.gradient}
            trailColor={isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'}
            strokeWidth={10}
            width={140}
            gapDegree={70}
            format={() => (
              <div className="flex flex-col items-center justify-center">
                <span className={`text-3xl font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{count}</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1.5">Tickets</span>
              </div>
            )}
          />
        </div>

        {/* Load Status Labels */}
        <div className="w-full text-center">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Load Density</div>
          <div className={`text-2xl font-black font-heading mt-1 ${config.textColor} tracking-wide uppercase`}>
            {config.label} Volume
          </div>
          <p className={`text-xs mt-2 px-3 italic border-l-2 border-rose-500/30 inline-block leading-relaxed max-w-[280px] ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {config.desc}
          </p>
        </div>
      </div>
    </Card>
  );
}
