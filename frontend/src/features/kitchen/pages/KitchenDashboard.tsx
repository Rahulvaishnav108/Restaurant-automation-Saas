import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Row, Col, Spin, message, theme, Button } from 'antd';
import { 
  RefreshCw, 
  CheckSquare, 
  Clock, 
  Zap,
  TrendingUp
} from 'lucide-react';
import { socket } from '../../../lib/socket';
import {
  getKitchenOrders,
  getKitchenBatches,
  getKitchenLoad,
  getKitchenPerformance,
  acceptOrder,
  readyOrder,
  delayOrder,
  rejectOrder,
  updateKitchenBatchStatus,
  createKitchenBatch,
  acceptAllOrders,
  delayAllOrders
} from '../api/kitchen.api';
import { OrderList, BatchView, LoadIndicator, PerformanceStats, StationsView } from '../components';
import { LowStockAlerts } from '../../admin/components/LowStockAlerts';
import { useAuth } from '../../../auth/AuthProvider';
import { typographyTheme } from '../../../shared/theme/typography';

interface NotificationLog {
  id: string;
  text: string;
  time: string;
  icon: string;
  color: string;
}

export default function KitchenDashboard(): JSX.Element {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // URL Search parameters for Layout synchronization
  const [searchParams] = useSearchParams();
  const activeSection = (searchParams.get('view') || 'dashboard') as 'dashboard' | 'orders' | 'batches' | 'stations' | 'inventory' | 'staff' | 'analytics' | 'reports' | 'settings' | 'load' | 'performance';

  const { token } = theme.useToken();
  const isDark = token.colorBgBase === '#0f172a' || token.colorBgBase === '#111827';

  const [mutatingOrderId, setMutatingOrderId] = useState<string | null>(null);
  const [mutatingBatchId, setMutatingBatchId] = useState<string | null>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [notifications, setNotifications] = useState<NotificationLog[]>(() => [
    { id: 'i1', text: 'Order #1042 marked as served', time: '2 min ago', icon: 'bell', color: 'text-green-500' },
    { id: 'i2', text: 'Table 8 requested assistance', time: '5 min ago', icon: 'bell', color: 'text-orange-500' },
    { id: 'i3', text: 'New reservation: Sat 8 PM, party of 4', time: '10 min ago', icon: 'bell', color: 'text-blue-500' },
    { id: 'i4', text: 'Order #1038 cancelled by customer', time: '25 min ago', icon: 'bell', color: 'text-red-500' },
    { id: 'i5', text: 'Inventory restocked: Olive Oil', time: '1 hr ago', icon: 'bell', color: 'text-green-500' },
  ]);

  // Push notifications helper
  const addNotification = (text: string, _icon: 'bell' | 'chef' | 'layers', color: string) => {
    const newNotif: NotificationLog = {
      id: String(Date.now()),
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      icon: 'bell',
      color
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 10)); // Limit to last 10 logs
  };

  // Queries
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['kitchenOrders'],
    queryFn: getKitchenOrders,
  });

  const { data: batches = [], isLoading: batchesLoading } = useQuery({
    queryKey: ['kitchenBatches'],
    queryFn: getKitchenBatches,
  });

  const { data: loadData, isLoading: loadLoading } = useQuery({
    queryKey: ['kitchenLoad'],
    queryFn: getKitchenLoad,
  });

  const { data: performanceData, isLoading: performanceLoading } = useQuery({
    queryKey: ['kitchenPerformance'],
    queryFn: getKitchenPerformance,
  });

  // Individual Mutations
  const acceptOrderMutation = useMutation({
    mutationFn: (id: string) => {
      setMutatingOrderId(id);
      return acceptOrder(id);
    },
    onSuccess: (data) => {
      message.success(`Order Accepted (Table ${data.table})`);
      addNotification(`Accepted order ${data.item} for Table ${data.table}`, 'chef', 'text-emerald-400');
      queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
      queryClient.invalidateQueries({ queryKey: ['kitchenLoad'] });
    },
    onError: () => message.error('Failed to accept order'),
    onSettled: () => setMutatingOrderId(null),
  });

  const readyOrderMutation = useMutation({
    mutationFn: (id: string) => {
      setMutatingOrderId(id);
      return readyOrder(id);
    },
    onSuccess: (data) => {
      message.success(`Order Marked Ready! (Table ${data.table})`);
      addNotification(`Order ${data.item} at Table ${data.table} is READY!`, 'chef', 'text-rose-400');
      queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
      queryClient.invalidateQueries({ queryKey: ['kitchenLoad'] });
      queryClient.invalidateQueries({ queryKey: ['kitchenPerformance'] });
    },
    onError: () => message.error('Failed to update order'),
    onSettled: () => setMutatingOrderId(null),
  });

  const delayOrderMutation = useMutation({
    mutationFn: (id: string) => {
      setMutatingOrderId(id);
      return delayOrder(id);
    },
    onSuccess: (data) => {
      message.warning(`Order Delayed (Table ${data.table})`);
      addNotification(`Delayed order ${data.item} at Table ${data.table}`, 'chef', 'text-amber-400');
      queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
    },
    onError: () => message.error('Failed to delay order'),
    onSettled: () => setMutatingOrderId(null),
  });

  const rejectOrderMutation = useMutation({
    mutationFn: (id: string) => {
      setMutatingOrderId(id);
      return rejectOrder(id);
    },
    onSuccess: (data) => {
      message.error(`Order Rejected (Table ${data.table})`);
      addNotification(`Rejected order ${data.item} at Table ${data.table}`, 'chef', 'text-rose-500');
      queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
      queryClient.invalidateQueries({ queryKey: ['kitchenLoad'] });
    },
    onError: () => message.error('Failed to reject order'),
    onSettled: () => setMutatingOrderId(null),
  });

  const updateBatchStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'PENDING' | 'PREPARING' | 'READY' }) => {
      setMutatingBatchId(id);
      return updateKitchenBatchStatus(id, status);
    },
    onSuccess: (data) => {
      message.success(`Batch status updated to ${data.status}`);
      addNotification(`Batch #${data.id.substring(0, 4)} is now ${data.status}`, 'layers', 'text-amber-400');
      queryClient.invalidateQueries({ queryKey: ['kitchenBatches'] });
      queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
      queryClient.invalidateQueries({ queryKey: ['kitchenLoad'] });
    },
    onError: () => message.error('Failed to update batch status'),
    onSettled: () => setMutatingBatchId(null),
  });

  const createBatchMutation = useMutation({
    mutationFn: (data: { item: string; orders: string[] }) => {
      return createKitchenBatch(data);
    },
    onSuccess: (data) => {
      message.success(`Created cooking batch for ${data.item}`);
      addNotification(`Batch created: ${data.quantity}x ${data.item}`, 'layers', 'text-amber-300');
      queryClient.invalidateQueries({ queryKey: ['kitchenBatches'] });
      queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
    },
    onError: () => message.error('Failed to create batch'),
  });

  // Bulk Actions Mutations
  const acceptAllMutation = useMutation({
    mutationFn: acceptAllOrders,
    onSuccess: () => {
      message.success('Accepted all active placed tickets!');
      addNotification('Bulk: Accepted all placed tickets', 'bell', 'text-emerald-400');
      queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
      queryClient.invalidateQueries({ queryKey: ['kitchenLoad'] });
    },
    onError: () => message.error('Failed to accept all orders')
  });

  const delayAllMutation = useMutation({
    mutationFn: delayAllOrders,
    onSuccess: () => {
      message.warning('All active tickets in prep delayed!');
      addNotification('Bulk: Delayed all preparing tickets', 'bell', 'text-rose-400');
      queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
    },
    onError: () => message.error('Failed to delay all orders')
  });

  const forceRefresh = () => {
    queryClient.invalidateQueries();
    message.success('Kitchen feed refreshed.');
    addNotification('Manual feed refresh executed', 'bell', 'text-slate-400');
  };

  // Socket listeners
  useEffect(() => {
    socket.on('order:new', () => {
      queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
      queryClient.invalidateQueries({ queryKey: ['kitchenLoad'] });
      message.info('New customer ticket received!');
      addNotification('Incoming: New customer ticket fired', 'bell', 'text-blue-400');
    });

    socket.on('order:update', () => {
      queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
      queryClient.invalidateQueries({ queryKey: ['kitchenLoad'] });
      queryClient.invalidateQueries({ queryKey: ['kitchenPerformance'] });
      addNotification('Update: Ticket status adjusted', 'bell', 'text-amber-400');
    });

    socket.on('batch:update', () => {
      queryClient.invalidateQueries({ queryKey: ['kitchenBatches'] });
      addNotification('Update: Cooking batch updated', 'layers', 'text-amber-400');
    });

    return () => {
      socket.off('order:new');
      socket.off('order:update');
      socket.off('batch:update');
    };
  }, [queryClient]);

  const anyLoading = ordersLoading || batchesLoading;

  if (anyLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spin size="large" tip="Loading Refined Kitchen KDS..." />
      </div>
    );
  }

  const isMutating = !!(
    mutatingOrderId || 
    mutatingBatchId || 
    createBatchMutation.isPending || 
    acceptAllMutation.isPending || 
    delayAllMutation.isPending
  );

  return (
    <div className="space-y-6 pb-16 relative">
      {/* Self-contained CSS for ticker animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
      `}</style>

      <div>
        <h1 className={`${typographyTheme.sizes.h1} ${typographyTheme.colors.primary}`}>Dashboard</h1>
        <p className={`${typographyTheme.sizes.body} ${typographyTheme.colors.secondary} mt-0.5`}>{`Welcome back, ${user?.name || 'samrai-01'}! Here is what's happening today.`}</p>
      </div>


      <Row gutter={[20, 20]}>
        
        {/* 1. MIDDLE OPERATING COLUMN */}
        <Col xs={24} lg={activeSection === 'dashboard' ? 16 : 24}>
          <div className="space-y-6">
            
            {/* Conditional component renders based on Sidebar section selection */}
            {(activeSection === 'dashboard' || activeSection === 'orders') && (
              <OrderList
                orders={orders}
                isLoading={ordersLoading}
                onAccept={(id) => acceptOrderMutation.mutate(id)}
                onReady={(id) => readyOrderMutation.mutate(id)}
                onDelay={(id) => delayOrderMutation.mutate(id)}
                onReject={(id) => rejectOrderMutation.mutate(id)}
                isMutating={isMutating}
                mutatingOrderId={mutatingOrderId}
              />
            )}

            {activeSection === 'batches' && (
              <BatchView
                batches={batches}
                orders={orders}
                isLoading={batchesLoading}
                onUpdateStatus={(id, status) => updateBatchStatusMutation.mutate({ id, status })}
                onCreateBatch={(item, orderIds) => createBatchMutation.mutate({ item, orders: orderIds })}
                isMutating={isMutating}
                mutatingBatchId={mutatingBatchId}
              />
            )}

            {activeSection === 'load' && (
              <LoadIndicator
                loadData={loadData}
                isLoading={loadLoading}
              />
            )}

            {activeSection === 'stations' && (
              <StationsView />
            )}

            {activeSection === 'staff' && (
              <div className={`rounded-2xl border p-6 transition-colors duration-200 ${
                isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-sm'
              }`}>
                <div className={`flex items-center gap-2 mb-4 border-b pb-3 ${isDark ? 'border-gray-800/60' : 'border-gray-100'}`}>
                  <h3 className={`${typographyTheme.sizes.h2} ${typographyTheme.colors.primary}`}>Kitchen Staff Members</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {[
                    { name: 'samrai-01', role: 'Head Chef', status: 'On Duty', station: 'Main Cookstation A', seed: 'samrai-01' },
                    { name: 'Chef Arjun', role: 'Executive Chef', status: 'On Duty', station: 'Tandoor & Grill', seed: 'Debesh' },
                    { name: 'Chef Priya', role: 'Sous Chef', status: 'On Break', station: 'Dessert Station', seed: 'Priya' }
                  ].map((staff) => (
                    <div key={staff.name} className={`rounded-xl border p-4 flex items-center gap-3.5 ${
                      isDark ? 'border-white/5 bg-gray-950/20' : 'border-gray-100 bg-gray-50/50'
                    }`}>
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.seed}`}
                        alt={staff.name}
                        className="w-11 h-11 rounded-full bg-orange-100 object-cover flex-shrink-0"
                      />
                      <div>
                        <h4 className={`text-sm font-bold ${typographyTheme.colors.primary}`}>{staff.name}</h4>
                        <p className={`text-xs ${typographyTheme.colors.secondary}`}>{staff.role} &bull; <span className="text-orange-500">{staff.station}</span></p>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border inline-block mt-2 ${
                          staff.status === 'On Duty'
                            ? isDark ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : isDark ? 'bg-amber-950/40 text-amber-400 border-amber-900/30' : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>{staff.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'analytics' && (
              <div className="space-y-6">
                <div className={`rounded-2xl border p-6 transition-colors duration-200 ${
                  isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-sm'
                }`}>
                  <div className={`flex items-center gap-2 mb-4 border-b pb-3 ${isDark ? 'border-gray-800/60' : 'border-gray-100'}`}>
                    <h3 className={`${typographyTheme.sizes.h2} ${typographyTheme.colors.primary}`}>Kitchen Analytics Overview</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                    <div className={`border rounded-xl p-5 ${isDark ? 'border-white/5 bg-gray-950/20' : 'border-gray-100 bg-gray-50/50'}`}>
                      <span className="block text-xs font-bold text-slate-400 uppercase mb-3">Order Flow & Prep Speed</span>
                      <div className="h-32 w-full flex items-end justify-between px-2 pt-2 gap-1.5">
                        {[40, 60, 50, 80, 90, 75, 60, 85].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                            <div className="w-full bg-orange-500 rounded-t" style={{ height: `${h}%` }} />
                            <span className="text-[8px] text-slate-400 font-extrabold">{i+9} AM</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={`border rounded-xl p-5 ${isDark ? 'border-white/5 bg-gray-950/20' : 'border-gray-100 bg-gray-50/50'}`}>
                      <span className="block text-xs font-bold text-slate-400 uppercase mb-3">Prep Efficiency Breakdown</span>
                      <div className="h-32 w-full flex items-end justify-between px-2 pt-2 gap-1.5">
                        {[75, 80, 85, 90, 88, 92, 95, 94].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                            <div className="w-full bg-emerald-500 rounded-t" style={{ height: `${h}%` }} />
                            <span className="text-[8px] text-slate-400 font-extrabold">{i+9} AM</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* POPULAR ITEMS TODAY */}
                <div className={`rounded-2xl border p-6 transition-colors duration-200 ${
                  isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-sm'
                }`}>
                  <div className={`flex items-center gap-2 mb-4 border-b pb-3 ${isDark ? 'border-gray-800/60' : 'border-gray-100'}`}>
                    <TrendingUp className="h-4.5 w-4.5 text-orange-500" />
                    <h3 className={`${typographyTheme.sizes.h2} ${typographyTheme.colors.primary}`}>Popular Items Today</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-4">
                      {[
                        { name: 'Veg Biryani', count: 22, max: 25, color: 'bg-orange-500' },
                        { name: 'Paneer Tikka', count: 18, max: 25, color: 'bg-amber-500' },
                        { name: 'Butter Chicken', count: 15, max: 25, color: 'bg-yellow-500' }
                      ].map((item) => (
                        <div key={item.name} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className={typographyTheme.colors.primary}>{item.name}</span>
                            <span className={typographyTheme.colors.secondary}>{item.count} sold</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`${item.color} h-full rounded-full`} 
                              style={{ width: `${(item.count / item.max) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      {[
                        { name: 'Chicken Burger', count: 14, max: 25, color: 'bg-blue-500' },
                        { name: 'Masala Dosa', count: 10, max: 25, color: 'bg-emerald-500' }
                      ].map((item) => (
                        <div key={item.name} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className={typographyTheme.colors.primary}>{item.name}</span>
                            <span className={typographyTheme.colors.secondary}>{item.count} sold</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`${item.color} h-full rounded-full`} 
                              style={{ width: `${(item.count / item.max) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'reports' && (
              <div className={`rounded-2xl border p-6 transition-colors duration-200 ${
                isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-sm'
              }`}>
                <div className={`flex items-center gap-2 mb-4 border-b pb-3 ${isDark ? 'border-gray-800/60' : 'border-gray-100'}`}>
                  <h3 className={`${typographyTheme.sizes.h2} ${typographyTheme.colors.primary}`}>Operational Reports</h3>
                </div>
                <div className="space-y-3 mt-4">
                  {[
                    { title: 'Daily Shift KDS Summary - May 28', size: '1.2 MB', date: '28 May, 2026' },
                    { title: 'Inventory Stock Level Report - May 27', size: '940 KB', date: '27 May, 2026' },
                    { title: 'Station Workload & SLA Performance Report', size: '2.4 MB', date: '26 May, 2026' }
                  ].map((r, idx) => (
                    <div key={idx} className={`border rounded-xl p-4 flex items-center justify-between transition-all hover:scale-[1.005] cursor-pointer ${
                      isDark ? 'border-white/5 bg-gray-950/20 hover:border-white/10' : 'border-gray-100 bg-gray-50/50 hover:bg-gray-100'
                    }`}>
                      <div>
                        <h4 className={`text-sm font-bold ${typographyTheme.colors.primary}`}>{r.title}</h4>
                        <span className={`text-[10px] mt-0.5 block ${typographyTheme.colors.muted}`}>{r.date} &bull; {r.size}</span>
                      </div>
                      <Button size="small" className="rounded-full text-[10px] font-bold border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/25">
                        Download PDF
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'settings' && (
              <div className={`rounded-2xl border p-6 transition-colors duration-200 ${
                isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-sm'
              }`}>
                <div className={`flex items-center gap-2 mb-4 border-b pb-3 ${isDark ? 'border-gray-800/60' : 'border-gray-100'}`}>
                  <h3 className={`${typographyTheme.sizes.h2} ${typographyTheme.colors.primary}`}>Kitchen SLA & KDS Settings</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-4">
                    <h4 className={`text-xs font-bold uppercase tracking-wider ${typographyTheme.colors.secondary}`}>Alert Thresholds</h4>
                    <div className="space-y-3">
                      <div>
                        <span className={`block text-xs font-semibold ${typographyTheme.colors.primary} mb-1.5`}>Ticket Delay SLA Limit (minutes)</span>
                        <input type="number" defaultValue={15} className={`w-full max-w-xs px-3 py-1.5 text-xs rounded-lg border outline-none font-semibold ${
                          isDark ? 'bg-slate-950 border-gray-800 text-white focus:border-orange-500' : 'bg-white border-gray-200 text-gray-800 focus:border-orange-300'
                        }`} />
                      </div>
                      <div>
                        <span className={`block text-xs font-semibold ${typographyTheme.colors.primary} mb-1.5`}>Critical Low-Stock Alarm Level (percentage)</span>
                        <input type="number" defaultValue={10} className={`w-full max-w-xs px-3 py-1.5 text-xs rounded-lg border outline-none font-semibold ${
                          isDark ? 'bg-slate-950 border-gray-800 text-white focus:border-orange-500' : 'bg-white border-gray-200 text-gray-800 focus:border-orange-300'
                        }`} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 border-gray-100 dark:border-gray-800/60">
                    <h4 className={`text-xs font-bold uppercase tracking-wider ${typographyTheme.colors.secondary}`}>Sound & Printer Config</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className={typographyTheme.colors.primary}>KDS Ticket Chime Alert</span>
                        <span className="text-orange-500 cursor-pointer hover:underline">Configure</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className={typographyTheme.colors.primary}>Main Kitchen Recipe Printer IP</span>
                        <span className={typographyTheme.colors.secondary}>192.168.1.182</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'performance' && (
              <PerformanceStats
                performanceData={performanceData}
                isLoading={performanceLoading}
              />
            )}

          </div>
        </Col>

        {/* 2. RIGHT COLUMN (Quick Actions, Load indicator, Stock Alerts) */}
        {activeSection === 'dashboard' && (
          <Col xs={24} lg={8} className="space-y-6">
            
            {/* QUICK CONTROLS PANEL */}
            <div className={`rounded-2xl border p-5 transition-colors duration-200 ${
              isDark 
                ? 'bg-gray-900 border-gray-800' 
                : 'bg-white border-gray-100 shadow-sm'
            }`}>
              <div className={`flex items-center gap-2 mb-4 border-b pb-3 ${isDark ? 'border-gray-800/60' : 'border-gray-100'}`}>
                <Zap className="h-4.5 w-4.5 text-orange-500 animate-pulse" />
                <h3 className={`${typographyTheme.sizes.h2} ${typographyTheme.colors.primary}`}>Quick Chef Controls</h3>
              </div>
              
              <div className="flex flex-col gap-2.5">
                <Button
                  type="primary"
                  disabled={isMutating || orders.filter(o => o.status === 'PLACED').length === 0}
                  onClick={() => acceptAllMutation.mutate()}
                  className="w-full bg-orange-500 hover:bg-orange-400 border-none rounded-full flex items-center justify-center font-bold text-xs h-9 shadow-[0_4px_12px_rgba(249,115,22,0.15)]"
                  icon={<CheckSquare className="h-3.5 w-3.5 mr-0.5" />}
                >
                  Accept All PLACED
                </Button>

                <Button
                  disabled={isMutating || orders.filter(o => o.status === 'PREPARING').length === 0}
                  onClick={() => delayAllMutation.mutate()}
                  className={`w-full border rounded-full flex items-center justify-center font-bold text-xs h-9 ${
                    isDark 
                      ? 'border-white/10 hover:border-orange-500/50 hover:bg-white/5 text-amber-200' 
                      : 'border-gray-200 hover:border-orange-500/50 hover:bg-slate-50 text-amber-600'
                  }`}
                  icon={<Clock className="h-3.5 w-3.5 mr-0.5" />}
                >
                  Delay Active Prep
                </Button>

                <Button
                  disabled={isMutating}
                  onClick={forceRefresh}
                  className={`w-full border rounded-full flex items-center justify-center font-bold text-xs h-9 ${
                    isDark 
                      ? 'border-white/5 bg-slate-950/20 hover:bg-slate-900/30 text-slate-300 hover:text-white' 
                      : 'border-gray-100 bg-slate-50 hover:bg-slate-100/50 text-slate-600'
                  }`}
                  icon={<RefreshCw className="h-3.5 w-3.5 mr-0.5" />}
                >
                  Refresh Feed
                </Button>
              </div>
            </div>

            {/* GAUGE & METRICS (dashboard mode) */}
            <LoadIndicator
              loadData={loadData}
              isLoading={loadLoading}
            />

            {/* LOW STOCK INGREDIENTS ALERT (REUSED ADMIN COMPONENT) */}
            <div className="pt-1">
              <LowStockAlerts />
            </div>
          </Col>
        )}

      </Row>

      {/* BOTTOM STICKY LIVE ALERTS TICKER */}
      <div className={`fixed bottom-0 left-0 right-0 h-10 border-t z-40 px-6 flex items-center justify-between text-xs transition-colors duration-200 ${
        isDark 
          ? 'bg-slate-900 border-white/5 text-slate-300' 
          : 'bg-white border-gray-200 text-slate-700'
      }`}>
        <div className="flex items-center gap-2 font-bold text-[10px] tracking-wider text-rose-500 uppercase flex-shrink-0 border-r border-gray-200 dark:border-white/5 pr-4 mr-4">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping inline-block" />
          Live Alerts
        </div>

        <div className="flex-1 overflow-hidden relative h-5">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-8 pl-[100%]">
            <span className="flex items-center gap-1.5 text-[11px] font-medium">
              <span className="text-amber-500">⚠️</span> Table T05 order delayed by 10 mins <span className={`text-[10px] ${typographyTheme.colors.muted}`}>(2 mins ago)</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="flex items-center gap-1.5 text-[11px] font-medium">
              <span className="text-orange-500">★</span> VIP Order from Table T01 <span className={`text-[10px] ${typographyTheme.colors.muted}`}>(5 mins ago)</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="flex items-center gap-1.5 text-[11px] font-medium">
              <span className="text-rose-500">⚠️</span> High priority order from Table T03 <span className={`text-[10px] ${typographyTheme.colors.muted}`}>(8 mins ago)</span>
            </span>
          </div>
        </div>

        <span className="text-[10px] font-bold text-orange-500 hover:text-orange-400 cursor-pointer transition-colors uppercase tracking-wider flex-shrink-0 border-l border-gray-200 dark:border-white/5 pl-4 ml-4">
          View All Alerts
        </span>
      </div>
    </div>
  );
}
