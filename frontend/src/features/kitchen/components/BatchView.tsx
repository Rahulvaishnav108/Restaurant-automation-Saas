import React from 'react';
import { Card, Tag, Button, Empty, Row, Col, Divider, theme } from 'antd';
import { Layers, Plus, ChefHat, CheckCircle2, Play } from 'lucide-react';
import { KitchenOrder, KitchenBatch } from '../api/kitchen.api';

interface BatchViewProps {
  batches: KitchenBatch[];
  orders: KitchenOrder[];
  isLoading: boolean;
  onUpdateStatus: (id: string, status: 'PENDING' | 'PREPARING' | 'READY') => void;
  onCreateBatch: (item: string, orderIds: string[]) => void;
  isMutating: boolean;
  mutatingBatchId: string | null;
}

export default function BatchView({
  batches,
  orders,
  isLoading,
  onUpdateStatus,
  onCreateBatch,
  isMutating,
  mutatingBatchId
}: BatchViewProps): JSX.Element {
  const { token } = theme.useToken();
  const isDark = token.colorBgBase === '#0f172a';
  
  // Find orders that are eligible for batching
  const batchedOrderIds = new Set(batches.flatMap(b => b.orders));
  
  const eligibleOrders = orders.filter(o => 
    (o.status === 'PLACED' || o.status === 'PREPARING') && 
    !batchedOrderIds.has(o.id)
  );

  // Group eligible orders by item name
  const groupedSuggestions = eligibleOrders.reduce((acc, order) => {
    if (!acc[order.item]) {
      acc[order.item] = [];
    }
    acc[order.item].push(order);
    return acc;
  }, {} as Record<string, KitchenOrder[]>);

  // Suggestions lists (2 or more)
  const suggestions = Object.entries(groupedSuggestions)
    .filter(([_, itemOrders]) => itemOrders.length >= 2)
    .map(([item, itemOrders]) => ({
      item,
      orders: itemOrders,
      totalQuantity: itemOrders.reduce((sum, o) => sum + o.quantity, 0),
      orderIds: itemOrders.map(o => o.id),
      tables: itemOrders.map(o => o.table)
    }));

  const getBatchStatusConfig = (status: string) => {
    switch (status) {
      case 'READY':
        return { text: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.2)' };
      case 'PREPARING':
        return { text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)' };
      default: // PENDING
        return { text: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)' };
    }
  };

  return (
    <Card
      title={
        <span className={`flex items-center gap-2 font-heading font-bold ${isDark ? 'text-stone-200' : 'text-slate-800'}`}>
          <Layers className="h-5 w-5 text-amber-400 animate-pulse" />
          Kitchen Batches
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
      loading={isLoading}
    >
      <div className="flex flex-col gap-5">
        
        {/* Active Batches */}
        <div>
          <h4 className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-3">Active Batches</h4>
          {batches.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span className={isDark ? 'text-slate-500 text-xs' : 'text-slate-400 text-xs font-semibold'}>No active cooking batches</span>}
            />
          ) : (
            <Row gutter={[12, 12]}>
              {batches.map((batch: KitchenBatch) => {
                const config = getBatchStatusConfig(batch.status);
                const isCurrentMutating = isMutating && mutatingBatchId === batch.id;
                
                // Get table labels
                const batchOrders = orders.filter(o => batch.orders.includes(o.id));
                const tables = batchOrders.length > 0 
                  ? batchOrders.map(o => o.table) 
                  : ['T1', 'T4'];

                return (
                  <Col span={24} key={batch.id}>
                    <div className={`flex flex-col justify-between rounded-[1.25rem] border p-4 transition-all duration-300 ${
                      isDark 
                        ? 'border-white/5 bg-slate-950/30 hover:border-white/10' 
                        : 'border-slate-100 bg-slate-50 hover:border-slate-200 shadow-sm'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <Tag
                              style={{
                                backgroundColor: config.bg,
                                color: config.text,
                                borderColor: config.border,
                                fontWeight: 700,
                                borderRadius: '6px',
                                fontSize: '9px',
                                textTransform: 'uppercase'
                              }}
                            >
                              {batch.status}
                            </Tag>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Batch #{batch.id.substring(0, 5)}</span>
                          </div>
                          
                          <h4 className={`text-sm font-black font-heading mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {batch.quantity}x {batch.item}
                          </h4>
                          
                          {/* Tables included labels */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                            <span className="text-[10px] text-slate-400 font-semibold uppercase mr-1">Tables:</span>
                            {Array.from(new Set(tables)).map(t => (
                              <span key={t} className={`text-[9px] font-bold border px-2 py-0.5 rounded ${
                                isDark 
                                  ? 'text-amber-200/80 bg-amber-950/30 border-amber-900/20' 
                                  : 'text-amber-700 bg-amber-50 border-amber-200'
                              }`}>
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="self-center">
                          {batch.status === 'PENDING' && (
                            <Button
                              type="primary"
                              onClick={() => onUpdateStatus(batch.id, 'PREPARING')}
                              disabled={isMutating}
                              loading={isCurrentMutating}
                              className="bg-amber-600 hover:bg-amber-500 border-none rounded-full flex items-center text-xs font-bold px-3 h-7.5"
                              icon={<Play className="h-3 w-3 mr-0.5" />}
                            >
                              Start
                            </Button>
                          )}
                          
                          {batch.status === 'PREPARING' && (
                            <Button
                              type="primary"
                              onClick={() => onUpdateStatus(batch.id, 'READY')}
                              disabled={isMutating}
                              loading={isCurrentMutating}
                              className="bg-rose-500 hover:bg-rose-400 border-none rounded-full flex items-center text-xs font-bold px-3 h-7.5 shadow-[0_4px_12px_rgba(244,63,94,0.2)]"
                              icon={<CheckCircle2 className="h-3 w-3 mr-0.5" />}
                            >
                              Ready
                            </Button>
                          )}
                          
                          {batch.status === 'READY' && (
                            <span className={`text-[10px] flex items-center gap-1 font-bold border px-2.5 py-1 rounded-full ${
                              isDark 
                                ? 'text-emerald-400 bg-emerald-950/20 border-emerald-900/10' 
                                : 'text-emerald-600 bg-emerald-50 border-emerald-200'
                            }`}>
                              <CheckCircle2 className="h-3 w-3" />
                              READY
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          )}
        </div>

        {/* Smart Suggestions */}
        {suggestions.length > 0 && (
          <div>
            <Divider className={`my-2.5 ${isDark ? 'border-white/5' : 'border-slate-200'}`} />
            <div className="flex items-center gap-1.5 mb-3 mt-1.5">
              <ChefHat className="h-4 w-4 text-amber-500 animate-bounce" />
              <h4 className={`text-[10px] uppercase tracking-wider font-extrabold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Smart Auto-Batch Suggestions</h4>
            </div>
            
            <Row gutter={[10, 10]}>
              {suggestions.map((s) => (
                <Col span={24} key={s.item}>
                  <div className={`border rounded-[1.25rem] p-4 flex items-center justify-between transition-all ${
                    isDark 
                      ? 'border-amber-500/20 bg-amber-950/10 hover:border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.02)]' 
                      : 'border-amber-200 bg-amber-50/40 hover:border-amber-300 shadow-[0_4px_15px_rgba(245,158,11,0.03)]'
                  }`}>
                    <div>
                      <h5 className={`text-xs font-black font-heading ${isDark ? 'text-amber-200' : 'text-amber-800'}`}>
                        Optimize: {s.item}
                      </h5>
                      <p className={`text-[10px] mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Combine {s.orders.length} tickets ({s.totalQuantity} items total) <br/>
                        Tables: {s.tables.join(', ')}
                      </p>
                    </div>
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => onCreateBatch(s.item, s.orderIds)}
                      disabled={isMutating}
                      className="bg-amber-500 hover:bg-amber-400 border-none text-[10px] font-bold rounded-full px-3.5 flex items-center h-7 shadow-[0_4px_10px_rgba(245,158,11,0.2)]"
                      icon={<Plus className="h-3 w-3 mr-0.5" />}
                    >
                      Batch
                    </Button>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    </Card>
  );
}
