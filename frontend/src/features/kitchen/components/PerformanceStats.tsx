import React from 'react';
import { Card, Row, Col, theme } from 'antd';
import { Timer, CheckCircle2, TrendingUp } from 'lucide-react';
import { KitchenPerformance } from '../api/kitchen.api';

interface PerformanceStatsProps {
  performanceData: KitchenPerformance | undefined;
  isLoading: boolean;
}

export default function PerformanceStats({ performanceData, isLoading }: PerformanceStatsProps): JSX.Element {
  const { token } = theme.useToken();
  const isDark = token.colorBgBase === '#0f172a';

  const avgPrepTime = performanceData?.avgPrepTime || '12 min';
  const efficiency = performanceData?.efficiency || '85%';
  const completedToday = performanceData?.completedToday || 24;

  return (
    <Card
      loading={isLoading}
      title={
        <span className={`flex items-center gap-2 font-heading font-bold ${isDark ? 'text-stone-200' : 'text-slate-800'}`}>
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          Shift Performance
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
      <Row gutter={[12, 12]}>
        {/* Avg Prep Time */}
        <Col span={24}>
          <div className={`flex items-center justify-between rounded-[1.25rem] border p-4 transition-all duration-300 hover:scale-[1.01] cursor-default ${
            isDark 
              ? 'border-white/5 bg-slate-950/20 hover:bg-white/5 hover:border-rose-500/20 hover:shadow-[0_0_20px_rgba(244,63,94,0.12)]' 
              : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-rose-500/20 hover:shadow-[0_4px_20px_rgba(244,63,94,0.06)]'
          }`}>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Avg Prep Time</p>
              <h3 className={`mt-1 text-2xl font-black tracking-tight font-heading ${isDark ? 'text-white' : 'text-slate-900'}`}>{avgPrepTime}</h3>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-500'}`}>
              <Timer className="h-5 w-5 animate-pulse" />
            </div>
          </div>
        </Col>

        {/* Efficiency */}
        <Col span={12}>
          <div className={`flex flex-col justify-between rounded-[1.25rem] border p-4 h-full transition-all duration-300 hover:scale-[1.02] cursor-default ${
            isDark 
              ? 'border-white/5 bg-slate-950/20 hover:bg-white/5 hover:border-emerald-500/20 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)]' 
              : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-emerald-500/20 hover:shadow-[0_4px_20px_rgba(34,197,94,0.05)]'
          }`}>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full self-end mb-3 ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-500'}`}>
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Efficiency</p>
              <h3 className={`mt-0.5 text-xl font-black tracking-tight font-heading ${isDark ? 'text-white' : 'text-slate-900'}`}>{efficiency}</h3>
            </div>
          </div>
        </Col>

        {/* Completed */}
        <Col span={12}>
          <div className={`flex flex-col justify-between rounded-[1.25rem] border p-4 h-full transition-all duration-300 hover:scale-[1.02] cursor-default ${
            isDark 
              ? 'border-white/5 bg-slate-950/20 hover:bg-white/5 hover:border-blue-500/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
              : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-500/20 hover:shadow-[0_4px_20px_rgba(59,130,246,0.05)]'
          }`}>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full self-end mb-3 ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-500'}`}>
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Completed</p>
              <h3 className={`mt-0.5 text-xl font-black tracking-tight font-heading ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {completedToday} <span className="text-[10px] font-medium text-slate-400 font-sans">tix</span>
              </h3>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
}
