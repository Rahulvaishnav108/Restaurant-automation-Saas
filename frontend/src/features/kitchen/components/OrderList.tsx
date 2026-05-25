import React from 'react';
import { Card, Tag, Button, Empty, Row, Col, theme } from 'antd';
import { ChefHat, CheckCircle2, Ban, Clock, MessageSquare } from 'lucide-react';
import { KitchenOrder } from '../api/kitchen.api';

interface OrderListProps {
  orders: KitchenOrder[];
  isLoading: boolean;
  onAccept: (id: string) => void;
  onReady: (id: string) => void;
  onDelay: (id: string) => void;
  onReject: (id: string) => void;
  isMutating: boolean;
  mutatingOrderId: string | null;
}

export default function OrderList({
  orders,
  isLoading,
  onAccept,
  onReady,
  onDelay,
  onReject,
  isMutating,
  mutatingOrderId
}: OrderListProps): JSX.Element {
  const { token } = theme.useToken();
  const isDark = token.colorBgBase === '#0f172a';
  
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'READY':
        return { text: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.2)', pulse: '' };
      case 'PREPARING':
        return { text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)', pulse: 'animate-pulse' };
      case 'DELAYED':
        return { text: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)', pulse: 'animate-bounce' };
      case 'REJECTED':
        return { text: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', border: 'rgba(148, 163, 184, 0.2)', pulse: '' };
      default: // PLACED
        return { text: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)', pulse: 'animate-pulse' };
    }
  };

  return (
    <Card
      title={
        <span className={`flex items-center gap-2 font-heading font-bold ${isDark ? 'text-stone-200' : 'text-slate-800'}`}>
          <ChefHat className="h-5 w-5 text-rose-500" />
          Active Kitchen Tickets
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
      {orders.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<span className={isDark ? 'text-slate-400' : 'text-slate-500'}>No active kitchen orders</span>}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {orders.map((order: KitchenOrder) => {
            const config = getStatusConfig(order.status);
            const isCurrentMutating = isMutating && mutatingOrderId === order.id;

            return (
              <Col xs={24} sm={12} key={order.id}>
                {/* Individual Ticket Card */}
                <div 
                  className={`relative flex flex-col justify-between h-full rounded-[1.5rem] border p-5 transition-all duration-300 ${
                    isDark 
                      ? `bg-slate-950/30 hover:border-white/15 ${
                          order.status === 'PREPARING' 
                            ? 'border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.03)]' 
                            : order.status === 'DELAYED'
                            ? 'border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.03)]'
                            : 'border-white/5'
                        }`
                      : `bg-slate-50 hover:border-slate-200 ${
                          order.status === 'PREPARING' 
                            ? 'border-amber-300 shadow-[0_4px_15px_rgba(245,158,11,0.05)]' 
                            : order.status === 'DELAYED'
                            ? 'border-rose-300 shadow-[0_4px_15px_rgba(244,63,94,0.05)]'
                            : 'border-slate-100'
                        }`
                  }`}
                >
                  <div>
                    {/* Header: Status + Table tag */}
                    <div className="flex items-center justify-between mb-3.5">
                      <Tag
                        style={{
                          backgroundColor: config.bg,
                          color: config.text,
                          borderColor: config.border,
                          fontWeight: 700,
                          borderRadius: '8px',
                          fontSize: '10px',
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                        }}
                        className={config.pulse}
                      >
                        {order.status}
                      </Tag>
                      
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm font-heading ${
                        isDark 
                          ? 'text-amber-200 bg-amber-950/50 border border-amber-500/20' 
                          : 'text-amber-700 bg-amber-50 border border-amber-200'
                      }`}>
                        Table {order.table}
                      </span>
                    </div>

                    {/* Content: Quantity + Dish name */}
                    <div className="flex items-start gap-2.5 my-2">
                      {order.quantity > 1 ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white text-xs font-black leading-none flex-shrink-0 mt-0.5 shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                          {order.quantity}
                        </span>
                      ) : (
                        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold leading-none flex-shrink-0 mt-0.5 border ${
                          isDark 
                            ? 'bg-slate-800 text-slate-300 border-slate-700' 
                            : 'bg-slate-200 text-slate-600 border-slate-300'
                        }`}>
                          {order.quantity}
                        </span>
                      )}
                      <h4 className={`text-base font-black font-heading leading-tight tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {order.item}
                      </h4>
                    </div>

                    {/* Notes display */}
                    {order.notes && (
                      <div className={`flex items-start gap-2 text-[11px] px-3 py-2 rounded-[0.75rem] mt-3 leading-normal border ${
                        isDark 
                          ? 'text-rose-300 bg-rose-950/20 border-rose-950/40' 
                          : 'text-rose-700 bg-rose-50 border-rose-100'
                      }`}>
                        <MessageSquare className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-rose-500" />
                        <span><strong>Instructions:</strong> {order.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Section */}
                  <div className={`mt-5 pt-3 border-t flex flex-wrap gap-2 justify-end items-center ${isDark ? 'border-white/5' : 'border-slate-200/60'}`}>
                    {order.status === 'PLACED' && (
                      <>
                        <Button
                          danger
                          type="text"
                          onClick={() => onReject(order.id)}
                          disabled={isMutating}
                          loading={isCurrentMutating}
                          className={`rounded-full flex items-center justify-center text-xs font-bold px-3 h-8 border ${
                            isDark 
                              ? 'hover:bg-rose-950/20 text-rose-400/80 hover:text-rose-400 border-transparent hover:border-rose-900/20' 
                              : 'hover:bg-rose-50 text-rose-600 border-transparent hover:border-rose-100'
                          }`}
                        >
                          Reject
                        </Button>
                        <Button
                          type="primary"
                          onClick={() => onAccept(order.id)}
                          disabled={isMutating}
                          loading={isCurrentMutating}
                          className="bg-rose-500 hover:bg-rose-400 border-none rounded-full flex items-center justify-center text-xs font-bold px-4.5 h-8 shadow-[0_4px_12px_rgba(244,63,94,0.2)]"
                        >
                          Accept
                        </Button>
                      </>
                    )}

                    {(order.status === 'PREPARING' || order.status === 'DELAYED') && (
                      <>
                        <Button
                          danger
                          type="text"
                          onClick={() => onReject(order.id)}
                          disabled={isMutating}
                          loading={isCurrentMutating}
                          className={`rounded-full flex items-center justify-center text-xs font-bold px-3 h-8 ${
                            isDark ? 'hover:bg-rose-950/20 text-rose-400/80' : 'hover:bg-rose-50 text-rose-600'
                          }`}
                        >
                          Reject
                        </Button>
                        
                        {order.status === 'PREPARING' && (
                          <Button
                            onClick={() => onDelay(order.id)}
                            disabled={isMutating}
                            loading={isCurrentMutating}
                            className={`rounded-full flex items-center justify-center text-xs font-bold px-3.5 h-8 border ${
                              isDark 
                                ? 'border-white/10 hover:border-amber-500/50 hover:bg-white/5 text-amber-300' 
                                : 'border-slate-200 hover:border-amber-500/50 hover:bg-slate-50 text-amber-600'
                            }`}
                            icon={<Clock className="h-3 w-3 mr-0.5" />}
                          >
                            Delay
                          </Button>
                        )}
                        
                        <Button
                          type="primary"
                          onClick={() => onReady(order.id)}
                          disabled={isMutating}
                          loading={isCurrentMutating}
                          className="bg-emerald-600 hover:bg-emerald-500 border-none rounded-full flex items-center justify-center text-xs font-bold px-4 h-8 shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
                          icon={<CheckCircle2 className="h-3.5 w-3.5 mr-1" />}
                        >
                          Mark Ready
                        </Button>
                      </>
                    )}

                    {order.status === 'READY' && (
                      <span className={`text-[11px] flex items-center gap-1.5 font-bold border px-3 py-1 rounded-full shadow-sm mt-0.5 ${
                        isDark 
                          ? 'text-emerald-400 bg-emerald-950/40 border-emerald-900/30' 
                          : 'text-emerald-600 bg-emerald-50 border-emerald-100'
                      }`}>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Ready for Pickup
                      </span>
                    )}
                    
                    {order.status === 'REJECTED' && (
                      <span className={`text-[11px] flex items-center gap-1.5 font-bold border px-3 py-1 rounded-full shadow-sm mt-0.5 ${
                        isDark 
                          ? 'text-slate-400 bg-slate-900/40 border-slate-800/30' 
                          : 'text-slate-500 bg-slate-100 border-slate-200'
                      }`}>
                        <Ban className="h-3.5 w-3.5" />
                        Rejected
                      </span>
                    )}
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      )}
    </Card>
  );
}
