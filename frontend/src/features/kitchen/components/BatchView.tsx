import React from 'react';
import { Tag, Button, Empty, Row, Col, Divider, theme } from 'antd';
import { Layers, Plus, ChefHat, CheckCircle2, Play } from 'lucide-react';
import { KitchenOrder, KitchenBatch } from '../api/kitchen.api';
import { typographyTheme } from '../../../shared/theme/typography';

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
  isLoading: _isLoading,
  onUpdateStatus,
  onCreateBatch,
  isMutating,
  mutatingBatchId
}: BatchViewProps): JSX.Element {
  const { token } = theme.useToken();
  const isDark = token.colorBgBase === '#0f172a' || token.colorBgBase === '#111827';
  
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
        return { text: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', border: 'rgba(249, 115, 22, 0.2)' };
      default: // PENDING
        return { text: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)' };
    }
  };

  return (
    <div className={`rounded-2xl border p-5 transition-colors duration-200 ${
      isDark 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-gray-100 shadow-sm'
    }`}>
      <div className={`flex items-center gap-2 mb-4 border-b pb-3 ${isDark ? 'border-gray-800/60' : 'border-gray-100'}`}>
        <Layers className="h-4.5 w-4.5 text-orange-500" />
        <h3 className={`${typographyTheme.sizes.h2} ${typographyTheme.colors.primary}`}>Kitchen Batches</h3>
      </div>

      <div className={suggestions.length > 0 ? "grid grid-cols-1 md:grid-cols-2 gap-6 items-start" : "flex flex-col gap-5"}>
        
        {/* Active Batches */}
        <div>
          <h4 className={`${typographyTheme.sizes.label} ${typographyTheme.colors.secondary} mb-3`}>Active Batches</h4>
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
                        ? 'border-white/5 bg-gray-950/30 hover:border-white/10' 
                        : 'border-gray-100 bg-gray-50/50 hover:border-gray-200 shadow-sm'
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
                          
                          <h4 className={`text-sm ${typographyTheme.sizes.h3} mt-1 ${typographyTheme.colors.primary}`}>
                            {batch.quantity}x {batch.item}
                          </h4>
                          
                          {/* Tables included labels */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                            <span className="text-[10px] text-slate-400 font-semibold uppercase mr-1">Tables:</span>
                            {Array.from(new Set(tables)).map(t => (
                              <span key={t} className={`text-[9px] font-bold border px-2 py-0.5 rounded ${
                                isDark 
                                  ? 'text-orange-200 bg-orange-950/50 border border-orange-500/20' 
                                  : 'text-orange-700 bg-orange-50 border border-orange-200'
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
                              className="bg-orange-500 hover:bg-orange-400 border-none rounded-full flex items-center text-xs font-bold px-3 h-7.5 shadow-[0_4px_10px_rgba(249,115,22,0.15)]"
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
                              className="bg-emerald-600 hover:bg-emerald-500 border-none rounded-full flex items-center text-xs font-bold px-3 h-7.5 shadow-[0_4px_10px_rgba(16,185,129,0.15)]"
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
            <Divider className={`my-2.5 md:hidden ${isDark ? 'border-white/5' : 'border-gray-100'}`} />
            <div className="flex items-center gap-1.5 mb-3 mt-1.5">
              <ChefHat className="h-4 w-4 text-orange-500 animate-bounce" />
              <h4 className={`${typographyTheme.sizes.label} ${typographyTheme.colors.primary}`}>Smart Auto-Batch Suggestions</h4>
            </div>
            
            <Row gutter={[10, 10]}>
              {suggestions.map((s) => (
                <Col span={24} key={s.item}>
                  <div className={`border rounded-[1.25rem] p-4 flex items-center justify-between transition-all ${
                    isDark 
                      ? 'border-orange-500/20 bg-orange-950/10 hover:border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.02)]' 
                      : 'border-orange-200 bg-orange-50/40 hover:border-orange-300 shadow-[0_4px_15px_rgba(249,115,22,0.03)]'
                  }`}>
                    <div>
                      <h5 className={`text-xs ${typographyTheme.sizes.h3} ${isDark ? 'text-orange-200' : 'text-orange-800'}`}>
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
                      className="bg-orange-500 hover:bg-orange-400 border-none text-[10px] font-bold rounded-full px-3.5 flex items-center h-7 shadow-[0_4px_10px_rgba(249,115,22,0.2)]"
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
    </div>
  );
}
