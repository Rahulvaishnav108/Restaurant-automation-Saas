import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Row, Col, Spin, message, theme, Button, Card } from 'antd';
import { 
  RefreshCw, 
  CheckSquare, 
  Clock, 
  Bell, 
  Zap 
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
import { OrderList, BatchView, LoadIndicator, PerformanceStats } from '../components';

interface NotificationLog {
  id: string;
  text: string;
  time: string;
  icon: string;
  color: string;
}

export default function KitchenDashboard(): JSX.Element {
  const queryClient = useQueryClient();
  
  // URL Search parameters for Layout synchronization
  const [searchParams] = useSearchParams();
  const activeSection = (searchParams.get('view') || 'dashboard') as 'dashboard' | 'orders' | 'batches' | 'load' | 'performance';

  const { token } = theme.useToken();
  const isDark = token.colorBgBase === '#0f172a';

  const [mutatingOrderId, setMutatingOrderId] = useState<string | null>(null);
  const [mutatingBatchId, setMutatingBatchId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationLog[]>(() => [
    { id: 'i1', text: 'Kitchen monitoring active.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), icon: 'bell', color: 'text-rose-400' }
  ]);

  // Push notifications helper
  const addNotification = (text: string, icon: 'bell' | 'chef' | 'layers', color: string) => {
    const newNotif: NotificationLog = {
      id: String(Date.now()),
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      icon,
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

    // Initial notifications log populated on mount via lazy initializer

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
    <div className="space-y-6">
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

              {(activeSection === 'dashboard' || activeSection === 'batches') && (
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

              {activeSection === 'performance' && (
                <PerformanceStats
                  performanceData={performanceData}
                  isLoading={performanceLoading}
                />
              )}

            </div>
          </Col>

          {/* 2. RIGHT COLUMN (Quick Actions, Performance, Load indicator, Sockets log) */}
          {activeSection === 'dashboard' && (
            <Col xs={24} lg={8} className="space-y-6">
              
              {/* QUICK CONTROLS PANEL */}
              <Card 
                title={
                  <span className={`flex items-center gap-2 font-heading font-bold ${isDark ? 'text-stone-200' : 'text-slate-800'} text-sm`}>
                    <Zap className="h-4 w-4 text-rose-500 animate-pulse" />
                    Quick Chef Controls
                  </span>
                }
                className={`border rounded-[1.75rem] overflow-hidden transition-all duration-300 ${
                  isDark 
                    ? 'border-white/10 bg-white/5 text-stone-200' 
                    : 'border-slate-200 bg-white shadow-sm text-slate-800'
                }`}
                styles={{
                  header: { borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #f1f5f9', padding: '12px 16px' },
                  body: { padding: '16px' }
                }}
              >
                <div className="flex flex-col gap-2.5">
                  <Button
                    type="primary"
                    disabled={isMutating || orders.filter(o => o.status === 'PLACED').length === 0}
                    onClick={() => acceptAllMutation.mutate()}
                    className="w-full bg-rose-500 hover:bg-rose-400 border-none rounded-full flex items-center justify-center font-bold text-xs h-9 shadow-[0_4px_12px_rgba(244,63,94,0.15)]"
                    icon={<CheckSquare className="h-3.5 w-3.5 mr-0.5" />}
                  >
                    Accept All PLACED
                  </Button>

                  <Button
                    disabled={isMutating || orders.filter(o => o.status === 'PREPARING').length === 0}
                    onClick={() => delayAllMutation.mutate()}
                    className={`w-full border rounded-full flex items-center justify-center font-bold text-xs h-9 ${
                      isDark 
                        ? 'border-white/10 hover:border-rose-500/50 hover:bg-white/5 text-amber-200' 
                        : 'border-slate-200 hover:border-rose-500/50 hover:bg-slate-50 text-amber-600'
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
                        : 'border-slate-100 bg-slate-50 hover:bg-slate-100/50 text-slate-600'
                    }`}
                    icon={<RefreshCw className="h-3.5 w-3.5 mr-0.5" />}
                  >
                    Refresh Feed
                  </Button>
                </div>
              </Card>

              {/* GAUGE & METRICS (dashboard mode) */}
              <LoadIndicator
                loadData={loadData}
                isLoading={loadLoading}
              />

              <PerformanceStats
                performanceData={performanceData}
                isLoading={performanceLoading}
              />

              {/* REAL-TIME NOTIFICATION HUB */}
              <Card
                title={
                  <span className={`flex items-center justify-between font-heading font-bold text-sm w-full ${isDark ? 'text-stone-200' : 'text-slate-800'}`}>
                    <span className="flex items-center gap-1.5">
                      <Bell className="h-4 w-4 text-blue-400" />
                      Live Feed Audit Log
                    </span>
                    <span className={`text-[10px] font-semibold lowercase border px-2 py-0.5 rounded ${
                      isDark 
                        ? 'bg-slate-950/40 border-white/5 text-slate-400' 
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}>
                      sockets
                    </span>
                  </span>
                }
                className={`border rounded-[1.75rem] overflow-hidden transition-all duration-300 ${
                  isDark 
                    ? 'border-white/10 bg-white/5 text-stone-200' 
                    : 'border-slate-200 bg-white shadow-sm text-slate-800'
                }`}
                styles={{
                  header: { borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #f1f5f9', padding: '12px 16px' },
                  body: { padding: '12px 16px', maxHeight: '200px', overflowY: 'auto' }
                }}
              >
                <div className="space-y-2">
                  {notifications.map(log => (
                    <div 
                      key={log.id} 
                      className={`border rounded-[0.75rem] p-2 flex items-start justify-between text-[10px] transition-all hover:scale-[1.01] ${
                        isDark 
                          ? 'border-white/5 bg-slate-950/20 hover:border-white/10 text-slate-300' 
                          : 'border-slate-100 bg-slate-50 hover:border-slate-200 text-slate-600'
                      } animate-fade-in`}
                    >
                      <div className="flex gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full mt-1.5 ${log.color === 'text-rose-500' ? 'bg-rose-500' : log.color === 'text-emerald-400' ? 'bg-emerald-400' : 'bg-blue-400'} animate-pulse flex-shrink-0`} />
                        <span className="font-medium leading-normal">{log.text}</span>
                      </div>
                      <span className={`text-[9px] font-medium flex-shrink-0 pl-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{log.time}</span>
                    </div>
                  ))}
                </div>
              </Card>

            </Col>
          )}

        </Row>
      </div>
  );
}
