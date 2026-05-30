import React from 'react';
import { Button, theme } from 'antd';
import { Flame, CheckCircle2, ShieldAlert, WifiOff, Award, ArrowUpRight, TrendingUp } from 'lucide-react';
import { typographyTheme } from '../../../shared/theme/typography';

interface KitchenStation {
  id: string;
  name: string;
  load: number;
  status: 'High Load' | 'Medium Load' | 'Low Load' | 'Offline';
  activeOrders: number;
  inProgress: number;
  waitTime: string;
  topItems: { item: string; quantity: number }[];
}

const stations: KitchenStation[] = [
  { 
    id: '1', name: 'Tandoor Station', load: 85, status: 'High Load', activeOrders: 8, inProgress: 5, waitTime: '10-15 mins', 
    topItems: [{ item: 'Tandoori Roti', quantity: 12 }, { item: 'Paneer Tikka', quantity: 6 }, { item: 'Chicken Tikka', quantity: 4 }]
  },
  { 
    id: '2', name: 'Gravy Station', load: 70, status: 'Medium Load', activeOrders: 6, inProgress: 4, waitTime: '8-12 mins', 
    topItems: [{ item: 'Butter Chicken', quantity: 8 }, { item: 'Paneer Butter Masala', quantity: 7 }, { item: 'Dal Makhani', quantity: 5 }]
  },
  { 
    id: '3', name: 'Fry Station', load: 50, status: 'Medium Load', activeOrders: 5, inProgress: 3, waitTime: '5-10 mins', 
    topItems: [{ item: 'Veg Manchurian', quantity: 8 }, { item: 'Chicken 65', quantity: 5 }, { item: 'French Fries', quantity: 4 }]
  },
  { 
    id: '4', name: 'Chinese Station', load: 65, status: 'Medium Load', activeOrders: 4, inProgress: 2, waitTime: '5-8 mins', 
    topItems: [{ item: 'Veg Hakka Noodles', quantity: 6 }, { item: 'Chilli Paneer', quantity: 4 }, { item: 'Fried Rice', quantity: 4 }]
  },
  { 
    id: '5', name: 'Beverage Station', load: 40, status: 'Low Load', activeOrders: 3, inProgress: 1, waitTime: '3-5 mins', 
    topItems: [{ item: 'Cold Coffee', quantity: 4 }, { item: 'Lemonade', quantity: 3 }, { item: 'Masala Chai', quantity: 2 }]
  },
  { 
    id: '6', name: 'Dessert Station', load: 15, status: 'Low Load', activeOrders: 2, inProgress: 0, waitTime: '2-3 mins', 
    topItems: [{ item: 'Gulab Jamun', quantity: 7 }, { item: 'Ice Cream', quantity: 4 }, { item: 'Brownie', quantity: 3 }]
  }
];

export default function StationsView(): JSX.Element {
  const { token } = theme.useToken();
  const isDark = token.colorBgBase === '#0f172a' || token.colorBgBase === '#111827';

  const getProgressColor = (load: number) => {
    if (load >= 80) return '#f43f5e';
    if (load >= 50) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`${typographyTheme.sizes.h1} ${typographyTheme.colors.primary}`}>Kitchen Stations</h2>
          <p className={`${typographyTheme.sizes.body} ${typographyTheme.colors.secondary} mt-0.5`}>
            Monitor and manage all kitchen stations in real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="primary"
            className="bg-orange-500 hover:bg-orange-400 border-none rounded-full flex items-center justify-center font-bold text-xs px-4 h-9 shadow-[0_4px_12px_rgba(249,115,22,0.15)]"
            icon={<ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />}
          >
            Configure Stations
          </Button>
        </div>
      </div>

      {/* Metrics widgets */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Stations', value: '6', icon: Flame, color: 'text-blue-500', barBg: 'bg-blue-500/10' },
          { label: 'Operational', value: '5', icon: CheckCircle2, color: 'text-emerald-500', barBg: 'bg-emerald-500/10' },
          { label: 'High Load', value: '1', icon: ShieldAlert, color: 'text-amber-500', barBg: 'bg-amber-500/10' },
          { label: 'Offline', value: '0', icon: WifiOff, color: 'text-rose-500', barBg: 'bg-rose-500/10' },
          { label: 'Avg Efficiency', value: '85%', icon: Award, color: 'text-violet-500', barBg: 'bg-violet-500/10', colSpan: 'col-span-2 md:col-span-1' }
        ].map((c) => (
          <div 
            key={c.label} 
            className={`rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.01] ${c.colSpan || ''} ${
              isDark 
                ? 'bg-gray-900 border-gray-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.15)]'
                : 'bg-white border-gray-100 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between gap-1.5 mb-2.5">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${typographyTheme.colors.secondary}`}>
                {c.label}
              </span>
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.barBg} ${c.color}`}>
                <c.icon className="w-4 h-4" />
              </span>
            </div>
            <h3 className={`text-xl font-extrabold ${typographyTheme.colors.primary}`}>{c.value}</h3>
          </div>
        ))}
      </div>

      {/* Grid container split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Left: Station Cards Grid */}
        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {stations.map(st => (
            <div 
              key={st.id} 
              className={`rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.01] ${
                isDark 
                  ? st.status === 'High Load' 
                    ? 'bg-gray-900 border-rose-500/15 shadow-[0_0_15px_rgba(244,63,94,0.02)]' 
                    : 'bg-gray-900 border-gray-800'
                  : st.status === 'High Load'
                    ? 'bg-white border-rose-200 shadow-[0_4px_15px_rgba(244,63,94,0.03)]'
                    : 'bg-white border-gray-100 shadow-sm'
              }`}
            >
              {/* Card Header: Title & Load Info */}
              <div className="flex items-center justify-between mb-3.5 border-b pb-3 border-gray-100 dark:border-gray-800/60">
                <span className={`text-sm font-bold ${typographyTheme.colors.primary}`}>{st.name}</span>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider ${getMockLoadColor(st.status)}`}>
                  {st.load}% &bull; {st.status}
                </span>
              </div>

              {/* Progress bar inside Card */}
              <div className="mb-4">
                <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${st.load}%`, backgroundColor: getProgressColor(st.load) }} 
                  />
                </div>
              </div>

              {/* Stats detail row */}
              <div className="grid grid-cols-3 gap-2.5 text-center mb-4.5 bg-gray-50/50 dark:bg-slate-950/20 py-2 rounded-xl border border-slate-100/50 dark:border-white/5">
                <div>
                  <span className="block text-[8px] font-extrabold uppercase text-slate-400 dark:text-slate-500 leading-none">Active</span>
                  <span className={`text-sm font-extrabold mt-1 block ${typographyTheme.colors.primary}`}>{st.activeOrders}</span>
                </div>
                <div className="border-l border-gray-200 dark:border-white/5">
                  <span className="block text-[8px] font-extrabold uppercase text-slate-400 dark:text-slate-500 leading-none">In Prep</span>
                  <span className={`text-sm font-extrabold mt-1 block ${typographyTheme.colors.primary}`}>{st.inProgress}</span>
                </div>
                <div className="border-l border-gray-200 dark:border-white/5">
                  <span className="block text-[8px] font-extrabold uppercase text-slate-400 dark:text-slate-500 leading-none">Wait Time</span>
                  <span className={`text-[10px] font-extrabold mt-1.5 block text-orange-500`}>{st.waitTime}</span>
                </div>
              </div>

              {/* Item lists being prepared */}
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Currently Cooking</span>
                <div className="space-y-1.5">
                  {st.topItems.map((ti, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-semibold">
                      <span className={typographyTheme.colors.primary}>{ti.item}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{ti.quantity}x</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: station legend tables + alerts */}
        <div className="space-y-6">
          
          {/* STATION OVERVIEW STATUS BREAKDOWN */}
          <div className={`rounded-2xl border p-5 transition-colors duration-200 ${
            isDark 
              ? 'bg-gray-900 border-gray-800' 
              : 'bg-white border-gray-100 shadow-sm'
          }`}>
            <div className={`flex items-center gap-2 mb-4 border-b pb-3 ${isDark ? 'border-gray-800/60' : 'border-gray-100'}`}>
              <TrendingUp className="h-4.5 w-4.5 text-orange-500" />
              <h3 className={`${typographyTheme.sizes.h2} ${typographyTheme.colors.primary}`}>Station Overview</h3>
            </div>

            <div className="flex items-center justify-around py-1 gap-4">
              {/* Pie/Donut Chart */}
              <div className="relative w-26 h-26 rounded-full border-[10px] border-emerald-500 flex items-center justify-center">
                <div className="absolute inset-[-10px] rounded-full border-[10px] border-orange-500 border-t-transparent border-r-transparent" />
                <div className="absolute inset-[-10px] rounded-full border-[10px] border-rose-500 border-b-transparent border-l-transparent rotate-12" />
                <div className="text-center">
                  <span className={`text-base font-extrabold ${typographyTheme.colors.primary}`}>6</span>
                  <p className="text-[8px] text-slate-400 dark:text-slate-500 font-extrabold uppercase mt-0.5 leading-none">Stations</p>
                </div>
              </div>

              {/* Legends details */}
              <div className="space-y-1.5 text-[9px] font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className={typographyTheme.colors.secondary}>Low Load (2)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  <span className={typographyTheme.colors.secondary}>Medium Load (3)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  <span className={typographyTheme.colors.secondary}>High Load (1)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <span className={typographyTheme.colors.secondary}>Offline (0)</span>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIVE QUEUE LOG */}
          <div className={`rounded-2xl border p-5 transition-colors duration-200 ${
            isDark 
              ? 'bg-gray-900 border-gray-800' 
              : 'bg-white border-gray-100 shadow-sm'
          }`}>
            <div className={`flex items-center justify-between mb-4 border-b pb-3 ${isDark ? 'border-gray-800/60' : 'border-gray-100'}`}>
              <div className="flex items-center gap-1.5">
                <Flame className="h-4.5 w-4.5 text-orange-500" />
                <h3 className={`${typographyTheme.sizes.h2} ${typographyTheme.colors.primary}`}>Pending Queue</h3>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${isDark ? 'bg-orange-950/20 border-orange-900/30 text-orange-400' : 'bg-orange-50 border-orange-100 text-orange-600'}`}>
                32 items
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-semibold">
              {[
                { name: 'Tandoor Station', qty: '12 active tickets', pct: 85, color: 'bg-rose-500' },
                { name: 'Chinese Station', qty: '8 active tickets', pct: 65, color: 'bg-orange-500' },
                { name: 'Gravy Station', qty: '7 active tickets', pct: 70, color: 'bg-orange-500' },
                { name: 'Fry Station', qty: '5 active tickets', pct: 50, color: 'bg-amber-500' }
              ].map((q, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className={typographyTheme.colors.primary}>{q.name}</span>
                    <span className={typographyTheme.colors.secondary}>{q.qty}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div className={`${q.color} h-full rounded-full`} style={{ width: `${q.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline helper for colored status texts
function getMockLoadColor(status: string) {
  if (status === 'High Load') return 'text-rose-500 font-bold';
  if (status === 'Medium Load') return 'text-amber-500 font-bold';
  return 'text-emerald-500 font-bold';
}
