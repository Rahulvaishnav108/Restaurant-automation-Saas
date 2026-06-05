import React from 'react';
import type { Order } from '../../store/orders.store';
import { PaymentBadge } from './PaymentBadge';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderActionMenu } from './OrderActionMenu';
import { AVATAR_COLORS } from './orders.constants';

interface OrdersTableProps {
  orders: Order[];
}

const COLUMNS = [
  'Order ID', 'Customer', 'Table', 'Amount',
  'Payment', 'Status', 'Assigned Staff', 'Time', 'Actions',
];

function CustomerCell({ order }: { order: Order }) {
  const bg = AVATAR_COLORS[order.customerAvatar] ?? 'bg-gray-400';
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
        {order.customerAvatar}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight whitespace-nowrap">{order.customer}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">{order.items} Items</p>
      </div>
    </div>
  );
}

function StaffCell({ order }: { order: Order }) {
  const bg = AVATAR_COLORS[order.staffAvatar] ?? 'bg-gray-400';
  return (
    <div className="flex items-center gap-2">
      <div className={`w-6 h-6 rounded-full ${bg} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
        {order.staffAvatar}
      </div>
      <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{order.assignedStaff}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={9} className="py-16 text-center">
        <p className="text-gray-400 dark:text-gray-600 text-sm">No orders found</p>
        <p className="text-gray-300 dark:text-gray-700 text-xs mt-1">Try adjusting your search or filter</p>
      </td>
    </tr>
  );
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-50 dark:border-gray-800">
            {COLUMNS.map((col) => (
              <th
                key={col}
                className="text-left text-xs font-semibold text-gray-400 dark:text-gray-500 px-4 py-3 uppercase tracking-wide whitespace-nowrap first:pl-5 last:pr-5"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <EmptyState />
          ) : (
            orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-50 dark:border-gray-800/60 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors"
              >
                {/* Order ID */}
                <td className="px-4 py-3.5 pl-5">
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{order.id}</span>
                </td>

                {/* Customer */}
                <td className="px-4 py-3.5">
                  <CustomerCell order={order} />
                </td>

                {/* Table */}
                <td className="px-4 py-3.5">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{order.table}</span>
                </td>

                {/* Amount */}
                <td className="px-4 py-3.5">
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{order.amount}</span>
                </td>

                {/* Payment */}
                <td className="px-4 py-3.5">
                  <PaymentBadge method={order.payment} />
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <OrderStatusBadge status={order.status} />
                </td>

                {/* Staff */}
                <td className="px-4 py-3.5">
                  <StaffCell order={order} />
                </td>

                {/* Time */}
                <td className="px-4 py-3.5">
                  <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{order.time}</span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5 pr-5">
                  <OrderActionMenu order={order} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}