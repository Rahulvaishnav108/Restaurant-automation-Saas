import React, { useState } from 'react';
import { Tag, Button, Empty, theme } from 'antd';
import { ChefHat, CheckCircle2 } from 'lucide-react';
import { KitchenOrder } from '../api/kitchen.api';
import { typographyTheme } from '../../../shared/theme/typography';

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
  isLoading: _isLoading,
  onAccept,
  onReady,
  onDelay,
  onReject,
  isMutating,
  mutatingOrderId
}: OrderListProps): JSX.Element {
  const { token } = theme.useToken();
  const isDark = token.colorBgBase === '#0f172a' || token.colorBgBase === '#111827';
  const [activeTab, setActiveTab] = useState<'new' | 'prep' | 'ready' | 'delayed'>('new');

  // Group orders by their KDS status columns
  const newOrders = orders.filter(o => o.status === 'PLACED');
  const preparingOrders = orders.filter(o => o.status === 'PREPARING');
  const readyOrders = orders.filter(o => o.status === 'READY');
  const delayedOrders = orders.filter(o => o.status === 'DELAYED');

  const getMockProgress = (id: string) => {
    const numId = parseInt(id.replace(/\D/g, '')) || 0;
    const options = [40, 65, 80];
    return options[numId % 3];
  };

  const getMockDelay = (id: string) => {
    const numId = parseInt(id.replace(/\D/g, '')) || 0;
    const options = [5, 10, 15];
    return `${options[numId % 3]} mins delay`;
  };

  const formatOrderId = (id: string) => {
    return `#ORD-${id.substring(0, 5).toUpperCase()}`;
  };

  const getServiceType = (id: string) => {
    const numId = parseInt(id.replace(/\D/g, '')) || 0;
    return numId % 2 === 0 ? 'Dine-in' : 'Takeaway';
  };

  // Helper function to render individual Ticket Card
  const renderTicketCard = (order: KitchenOrder, statusType: 'new' | 'prep' | 'ready' | 'delayed') => {
    const isCurrentMutating = isMutating && mutatingOrderId === order.id;
    const progress = getMockProgress(order.id);
    const serviceType = getServiceType(order.id);

    // Border theme styling based on ticket status
    let cardStyle = '';
    if (isDark) {
      cardStyle = 'bg-gray-950/45 border-white/5 hover:border-white/15';
      if (statusType === 'prep') cardStyle = 'bg-gray-950/45 border-orange-500/10 hover:border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.03)]';
      if (statusType === 'ready') cardStyle = 'bg-gray-950/45 border-emerald-500/10 hover:border-emerald-500/20 shadow-[0_0_15px_rgba(34,197,94,0.03)]';
      if (statusType === 'delayed') cardStyle = 'bg-gray-950/45 border-rose-500/10 hover:border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.03)]';
    } else {
      cardStyle = 'bg-white border-gray-100 hover:border-gray-200 shadow-sm';
      if (statusType === 'prep') cardStyle = 'bg-white border-orange-200 hover:border-orange-300 shadow-[0_4px_15px_rgba(249,115,22,0.04)]';
      if (statusType === 'ready') cardStyle = 'bg-white border-emerald-200 hover:border-emerald-300 shadow-[0_4px_15px_rgba(34,197,94,0.04)]';
      if (statusType === 'delayed') cardStyle = 'bg-white border-rose-200 hover:border-rose-300 shadow-[0_4px_15px_rgba(244,63,94,0.04)]';
    }

    return (
      <div key={order.id} className={`w-full min-w-0 overflow-hidden relative flex flex-col justify-between rounded-[1.5rem] border p-5 transition-all duration-300 hover:scale-[1.015] ${cardStyle}`}>
        <div className="w-full min-w-0 overflow-hidden">
          {/* Card Header: ID & Time marker */}
          <div className="flex items-center justify-between gap-1.5 mb-4">
            <span className={`text-sm font-bold tracking-wide flex-shrink-0 ${typographyTheme.colors.primary}`}>
              {formatOrderId(order.id)}
            </span>
            {statusType === 'new' && (
              <span className={`text-xs font-semibold flex-shrink-0 ${typographyTheme.colors.secondary}`}>
                3 mins ago
              </span>
            )}
            {statusType === 'prep' && (
              <span className={`text-xs font-semibold flex-shrink-0 ${typographyTheme.colors.secondary}`}>
                09:35 AM
              </span>
            )}
            {statusType === 'ready' && (
              <span className={`text-xs font-semibold flex-shrink-0 ${typographyTheme.colors.secondary}`}>
                08:35 AM
              </span>
            )}
            {statusType === 'delayed' && (
              <span className="text-[10px] font-black uppercase bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 px-2.5 py-1 rounded-full border border-rose-100 dark:border-rose-900/35 flex-shrink-0 truncate max-w-[120px]">
                {getMockDelay(order.id)}
              </span>
            )}
          </div>

          {/* Dish item name with quantity indicator */}
          <div className="flex items-center gap-3.5 my-3 w-full min-w-0">
            {order.quantity > 1 ? (
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-white text-base font-black leading-none flex-shrink-0 shadow-[0_4px_10px_rgba(249,115,22,0.35)]">
                {order.quantity}
              </span>
            ) : (
              <span className={`flex h-10 w-10 items-center justify-center rounded-2xl text-base font-black leading-none flex-shrink-0 border ${
                isDark 
                  ? 'bg-slate-800/80 text-slate-200 border-slate-700/60' 
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {order.quantity}
              </span>
            )}
            <h4 className={`text-base font-extrabold leading-snug break-words flex-1 min-w-0 ${typographyTheme.colors.primary}`}>
              {order.item}
            </h4>
          </div>

          {/* Notes display */}
          {order.notes && (
            <div className={`flex items-start gap-2 text-xs px-3.5 py-2.5 rounded-xl mt-3 leading-relaxed border break-words w-full overflow-hidden ${
              isDark 
                ? 'text-orange-300/80 bg-orange-950/10 border-orange-950/30' 
                : 'text-orange-700 bg-orange-50/50 border-orange-100'
            }`}>
              <span className="text-xs text-orange-400 font-black mr-1 flex-shrink-0">Note:</span>
              <span className="font-semibold break-words min-w-0 flex-1">{order.notes}</span>
            </div>
          )}

          {/* Dynamic Progress indicator for preparing ticket */}
          {statusType === 'prep' && (
            <div className="mt-4 mb-2.5 w-full">
              <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden shadow-inner">
                <div 
                  className="bg-orange-500 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 font-extrabold uppercase tracking-wider">
                <span>Cooking Progress</span>
                <span>{progress}%</span>
              </div>
            </div>
          )}

          {/* Service Table and Dine-in tag */}
          <div className="mt-4 mb-3.5 flex flex-wrap gap-1 w-full overflow-hidden">
            <span className={`text-xs font-bold px-3 py-1 rounded-lg border truncate max-w-full inline-block ${
              isDark 
                ? 'text-orange-200 bg-orange-950/35 border-orange-500/15' 
                : 'text-orange-700 bg-orange-50 border-orange-150'
            }`}>
              Table {order.table} &bull; {serviceType}
            </span>
          </div>
        </div>

        {/* Action controls matching the Figma image */}
        <div className={`mt-4 pt-3.5 border-t flex flex-wrap gap-2 justify-end items-center w-full min-w-0 ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
          {statusType === 'new' && (
            <>
              <Button
                danger
                type="text"
                onClick={() => onReject(order.id)}
                disabled={isMutating}
                loading={isCurrentMutating}
                className={`rounded-full flex items-center justify-center text-[11px] font-black px-4.5 h-9 border flex-1 min-w-[70px] ${
                  isDark 
                    ? 'hover:bg-rose-950/20 text-rose-400 border-transparent hover:border-rose-950' 
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
                className="bg-blue-600 hover:bg-blue-500 border-none rounded-full flex items-center justify-center text-[11px] font-black px-5 h-9 flex-1 min-w-[70px] shadow-[0_4px_10px_rgba(37,99,235,0.22)]"
              >
                Accept
              </Button>
            </>
          )}

          {statusType === 'prep' && (
            <>
              <Button
                onClick={() => onDelay(order.id)}
                disabled={isMutating}
                loading={isCurrentMutating}
                className={`rounded-full flex items-center justify-center text-[11px] font-black px-4 h-9 border flex-1 min-w-[70px] ${
                  isDark 
                    ? 'border-white/10 hover:border-orange-500/50 hover:bg-white/5 text-orange-300' 
                    : 'border-slate-200 hover:border-orange-500/50 hover:bg-slate-50 text-orange-600'
                }`}
              >
                Delay
              </Button>
              <Button
                type="primary"
                onClick={() => onReady(order.id)}
                disabled={isMutating}
                loading={isCurrentMutating}
                className="bg-orange-500 hover:bg-orange-400 border-none rounded-full flex items-center justify-center text-[11px] font-black px-4.5 h-9 flex-1 min-w-[85px] shadow-[0_4px_10px_rgba(249,115,22,0.22)]"
              >
                Mark Ready
              </Button>
            </>
          )}

          {statusType === 'ready' && (
            <Button
              type="primary"
              disabled
              className="bg-emerald-600 border-none rounded-full flex items-center justify-center text-[11px] font-black px-4 h-9 w-full text-white/95 shadow-[0_4px_10px_rgba(16,185,129,0.15)]"
              icon={<CheckCircle2 className="h-3.5 w-3.5 mr-0.5" />}
            >
              Ready for Pickup
            </Button>
          )}

          {statusType === 'delayed' && (
            <>
              <Button
                onClick={() => onDelay(order.id)}
                disabled={isMutating}
                loading={isCurrentMutating}
                className={`rounded-full flex items-center justify-center text-[11px] font-black px-3.5 h-9 border flex-1 min-w-[80px] ${
                  isDark 
                    ? 'border-white/5 hover:border-white/10 hover:bg-white/5 text-slate-300' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
                }`}
              >
                Delay Info
              </Button>
              <Button
                type="primary"
                onClick={() => onReady(order.id)}
                disabled={isMutating}
                loading={isCurrentMutating}
                className="bg-rose-600 hover:bg-rose-500 border-none rounded-full flex items-center justify-center text-[11px] font-black px-4.5 h-9 flex-1 min-w-[70px] shadow-[0_4px_10px_rgba(225,29,72,0.22)]"
              >
                Rush
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`rounded-2xl border p-5 transition-colors duration-200 ${
      isDark 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-gray-100 shadow-sm'
    }`}>
      {/* Title block */}
      <div className={`flex items-center gap-2 mb-6 border-b pb-3.5 ${isDark ? 'border-gray-800/60' : 'border-gray-100'}`}>
        <ChefHat className="h-5 w-5 text-orange-500" />
        <h3 className={`${typographyTheme.sizes.h2} ${typographyTheme.colors.primary}`}>Active Kitchen Tickets</h3>
      </div>

      {orders.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<span className={isDark ? 'text-slate-400' : 'text-slate-500 font-semibold'}>No active kitchen orders</span>}
        />
      ) : (
        <>
          {/* Mobile/Tablet Column Selector Tabs */}
          <div className="flex md:hidden border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-950/20 p-1 rounded-xl mb-4 text-xs font-bold w-full justify-between gap-1 overflow-x-auto">
            {[
              { label: 'New', key: 'new', count: newOrders.length, color: 'bg-blue-500' },
              { label: 'Preparing', key: 'prep', count: preparingOrders.length, color: 'bg-orange-500' },
              { label: 'Ready', key: 'ready', count: readyOrders.length, color: 'bg-emerald-500' },
              { label: 'Delayed', key: 'delayed', count: delayedOrders.length, color: 'bg-rose-500' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'new' | 'prep' | 'ready' | 'delayed')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg transition-all ${
                  activeTab === tab.key
                    ? isDark 
                      ? 'bg-gray-800 text-orange-400 shadow-sm border border-white/5' 
                      : 'bg-white text-orange-600 shadow-sm border border-gray-100'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${tab.color}`} />
                <span className="truncate">{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  activeTab === tab.key
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Kanban Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
            
            {/* Column 1: NEW ORDERS */}
            <div className={`flex flex-col gap-3 min-h-[300px] ${activeTab === 'new' ? 'flex' : 'hidden md:flex'}`}>
              <div className={`flex items-center justify-between border-b pb-2 mb-1 ${isDark ? 'border-blue-900/30' : 'border-blue-100'}`}>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className={`text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400`}>New Orders</span>
                </div>
                <Tag className="rounded-md font-bold text-[10px] bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/40 dark:border-blue-900/40 dark:text-blue-400">
                  {String(newOrders.length).padStart(2, '0')}
                </Tag>
              </div>
              {newOrders.length === 0 ? (
                <div className={`rounded-2xl border border-dashed p-6 text-center text-[11px] ${isDark ? 'border-white/5 text-slate-600' : 'border-slate-100 text-slate-400'}`}>
                  Empty
                </div>
              ) : (
                newOrders.map(order => renderTicketCard(order, 'new'))
              )}
            </div>

            {/* Column 2: PREPARING */}
            <div className={`flex flex-col gap-3 min-h-[300px] ${activeTab === 'prep' ? 'flex' : 'hidden md:flex'}`}>
              <div className={`flex items-center justify-between border-b pb-2 mb-1 ${isDark ? 'border-orange-900/30' : 'border-orange-100'}`}>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className={`text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400`}>Preparing</span>
                </div>
                <Tag className="rounded-md font-bold text-[10px] bg-orange-50 border-orange-200 text-orange-600 dark:bg-orange-950/40 dark:border-orange-900/40 dark:text-orange-400">
                  {String(preparingOrders.length).padStart(2, '0')}
                </Tag>
              </div>
              {preparingOrders.length === 0 ? (
                <div className={`rounded-2xl border border-dashed p-6 text-center text-[11px] ${isDark ? 'border-white/5 text-slate-600' : 'border-slate-100 text-slate-400'}`}>
                  Empty
                </div>
              ) : (
                preparingOrders.map(order => renderTicketCard(order, 'prep'))
              )}
            </div>

            {/* Column 3: READY */}
            <div className={`flex flex-col gap-3 min-h-[300px] ${activeTab === 'ready' ? 'flex' : 'hidden md:flex'}`}>
              <div className={`flex items-center justify-between border-b pb-2 mb-1 ${isDark ? 'border-emerald-900/30' : 'border-emerald-100'}`}>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className={`text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400`}>Ready</span>
                </div>
                <Tag className="rounded-md font-bold text-[10px] bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-900/40 dark:text-emerald-400">
                  {String(readyOrders.length).padStart(2, '0')}
                </Tag>
              </div>
              {readyOrders.length === 0 ? (
                <div className={`rounded-2xl border border-dashed p-6 text-center text-[11px] ${isDark ? 'border-white/5 text-slate-600' : 'border-slate-100 text-slate-400'}`}>
                  Empty
                </div>
              ) : (
                readyOrders.map(order => renderTicketCard(order, 'ready'))
              )}
            </div>

            {/* Column 4: DELAYED */}
            <div className={`flex flex-col gap-3 min-h-[300px] ${activeTab === 'delayed' ? 'flex' : 'hidden md:flex'}`}>
              <div className={`flex items-center justify-between border-b pb-2 mb-1 ${isDark ? 'border-rose-900/30' : 'border-rose-100'}`}>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-bounce" />
                  <span className={`text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400`}>Delayed</span>
                </div>
                <Tag className="rounded-md font-bold text-[10px] bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900/40 dark:text-rose-400">
                  {String(delayedOrders.length).padStart(2, '0')}
                </Tag>
              </div>
              {delayedOrders.length === 0 ? (
                <div className={`rounded-2xl border border-dashed p-6 text-center text-[11px] ${isDark ? 'border-white/5 text-slate-600' : 'border-slate-100 text-slate-400'}`}>
                  Empty
                </div>
              ) : (
                delayedOrders.map(order => renderTicketCard(order, 'delayed'))
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
}
