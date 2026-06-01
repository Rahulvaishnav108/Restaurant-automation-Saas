import React from 'react';
import { Row, Col, theme } from 'antd';
import { Timer, CheckCircle2, TrendingUp } from 'lucide-react';
import { KitchenPerformance } from '../api/kitchen.api';
import { typographyTheme } from '../../../shared/theme/typography';

interface PerformanceStatsProps {
  performanceData: KitchenPerformance | undefined;
  isLoading: boolean;
}

export default function PerformanceStats({ performanceData, isLoading: _isLoading }: PerformanceStatsProps): JSX.Element {
  const { token } = theme.useToken();
  const isDark = token.colorBgBase === '#0f172a' || token.colorBgBase === '#111827';

  const avgPrepTime = performanceData?.avgPrepTime || '12 min';
  const efficiency = performanceData?.efficiency || '85%';
  const completedToday = performanceData?.completedToday || 24;

  return (
    <div className={`rounded-2xl border p-5 transition-colors duration-200 ${
      isDark 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-gray-100 shadow-sm'
    }`}>
      <div className={`flex items-center gap-2 mb-4 border-b pb-3 ${isDark ? 'border-gray-800/60' : 'border-gray-100'}`}>
        <TrendingUp className="h-4.5 w-4.5 text-orange-500" />
        <h3 className={`${typographyTheme.sizes.h2} ${typographyTheme.colors.primary}`}>Shift Performance</h3>
      </div>

      <Row gutter={[12, 12]}>
        {/* Avg Prep Time */}
        <Col span={24}>
          <div className={`flex items-center justify-between rounded-[1.25rem] border p-4 transition-all duration-300 hover:scale-[1.01] cursor-default ${
            isDark 
              ? 'border-white/5 bg-gray-950/20 hover:bg-white/5 hover:border-orange-500/20 hover:shadow-[0_0_20px_rgba(249,115,22,0.12)]' 
              : 'border-gray-100 bg-gray-50/50 hover:bg-white hover:border-orange-500/20 hover:shadow-[0_4px_20px_rgba(249,115,22,0.06)]'
          }`}>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider ${typographyTheme.colors.secondary}`}>Avg Prep Time</p>
              <h3 className={`mt-1 text-2xl font-extrabold ${typographyTheme.colors.primary}`}>{avgPrepTime}</h3>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isDark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-500'}`}>
              <Timer className="h-5 w-5 animate-pulse" />
            </div>
          </div>
        </Col>

        {/* Efficiency */}
        <Col span={12}>
          <div className={`flex flex-col justify-between rounded-[1.25rem] border p-4 h-full transition-all duration-300 hover:scale-[1.02] cursor-default ${
            isDark 
              ? 'border-white/5 bg-gray-950/20 hover:bg-white/5 hover:border-emerald-500/20 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)]' 
              : 'border-gray-100 bg-gray-50/50 hover:bg-white hover:border-emerald-500/20 hover:shadow-[0_4px_20px_rgba(34,197,94,0.05)]'
          }`}>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full self-end mb-3 ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-500'}`}>
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${typographyTheme.colors.secondary}`}>Efficiency</p>
              <h3 className={`mt-0.5 text-xl font-extrabold ${typographyTheme.colors.primary}`}>{efficiency}</h3>
            </div>
          </div>
        </Col>

        {/* Completed */}
        <Col span={12}>
          <div className={`flex flex-col justify-between rounded-[1.25rem] border p-4 h-full transition-all duration-300 hover:scale-[1.02] cursor-default ${
            isDark 
              ? 'border-white/5 bg-gray-950/20 hover:bg-white/5 hover:border-blue-500/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
              : 'border-gray-100 bg-gray-50/50 hover:bg-white hover:border-blue-500/20 hover:shadow-[0_4px_20px_rgba(59,130,246,0.05)]'
          }`}>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full self-end mb-3 ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-500'}`}>
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${typographyTheme.colors.secondary}`}>Completed</p>
              <h3 className={`mt-0.5 text-xl font-extrabold ${typographyTheme.colors.primary}`}>
                {completedToday} <span className={`text-[10px] font-medium ${typographyTheme.colors.muted}`}>tix</span>
              </h3>
            </div>
          </div>
        </Col>
      </Row>

      {/* Graphical performance overview */}
      <div className={`mt-5 pt-5 border-t ${isDark ? 'border-gray-800/60' : 'border-gray-100'}`}>
        <p className={`text-[10px] ${typographyTheme.colors.secondary} font-semibold uppercase tracking-wider mb-3`}>
          Hourly Service Flow & Efficiency
        </p>
        
        <div className={`rounded-[1.25rem] border p-4 transition-colors duration-200 ${
          isDark 
            ? 'border-white/5 bg-gray-950/20' 
            : 'border-gray-100 bg-gray-50/50'
        }`}>
          <div className="flex items-center justify-between mb-3 text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block animate-pulse" />
              Efficiency (%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block animate-pulse" />
              Prep Speed (min)
            </span>
          </div>

          <div className="overflow-x-auto">
            {/* SVG render */}
            <svg width="100%" height="100" viewBox="0 0 340 100" className="overflow-visible" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="effGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="25" y1="20" x2="330" y2="20" stroke={isDark ? "rgba(255,255,255,0.04)" : "#e2e8f0"} strokeWidth="1" />
              <line x1="25" y1="50" x2="330" y2="50" stroke={isDark ? "rgba(255,255,255,0.04)" : "#e2e8f0"} strokeWidth="1" />
              <line x1="25" y1="80" x2="330" y2="80" stroke={isDark ? "rgba(255,255,255,0.04)" : "#e2e8f0"} strokeWidth="1" />

              {/* Y Axis Guides */}
              <text x="18" y="23" textAnchor="end" fontSize="8" fill="#94a3b8" className="font-semibold">90%</text>
              <text x="18" y="53" textAnchor="end" fontSize="8" fill="#94a3b8" className="font-semibold">80%</text>
              <text x="18" y="83" textAnchor="end" fontSize="8" fill="#94a3b8" className="font-semibold">70%</text>

              {/* Shaded Areas */}
              <path d="M 25,80 L 25,56 L 101.25,42 L 177.5,64 L 253.75,32 L 330,48 L 330,80 Z" fill="url(#effGrad)" />
              <path d="M 25,80 L 25,44 L 101.25,56 L 177.5,40 L 253.75,64 L 330,52 L 330,80 Z" fill="url(#speedGrad)" />

              {/* Paths */}
              <path d="M 25,56 L 101.25,42 L 177.5,64 L 253.75,32 L 330,48" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 25,44 L 101.25,56 L 177.5,40 L 253.75,64 L 330,52" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 2" />

              {/* Dots & Labels */}
              <circle cx="25" cy="56" r="2.5" fill="#f97316" />
              <circle cx="101.25" cy="42" r="2.5" fill="#f97316" />
              <circle cx="177.5" cy="64" r="2.5" fill="#f97316" />
              <circle cx="253.75" cy="32" r="2.5" fill="#f97316" />
              <circle cx="330" cy="48" r="2.5" fill="#f97316" />

              <circle cx="25" cy="44" r="2" fill="#3b82f6" />
              <circle cx="101.25" cy="56" r="2" fill="#3b82f6" />
              <circle cx="177.5" cy="40" r="2" fill="#3b82f6" />
              <circle cx="253.75" cy="64" r="2" fill="#3b82f6" />
              <circle cx="330" cy="52" r="2" fill="#3b82f6" />

              {/* X Axis Labels */}
              <text x="25" y="93" textAnchor="middle" fontSize="8" fill="#94a3b8" className="font-semibold">12 PM</text>
              <text x="101.25" y="93" textAnchor="middle" fontSize="8" fill="#94a3b8" className="font-semibold">2 PM</text>
              <text x="177.5" y="93" textAnchor="middle" fontSize="8" fill="#94a3b8" className="font-semibold">4 PM</text>
              <text x="253.75" y="93" textAnchor="middle" fontSize="8" fill="#94a3b8" className="font-semibold">6 PM</text>
              <text x="330" y="93" textAnchor="middle" fontSize="8" fill="#94a3b8" className="font-semibold">8 PM</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
