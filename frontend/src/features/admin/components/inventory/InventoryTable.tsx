import React from 'react';
import { MoreVertical } from 'lucide-react';
import type { InventoryItem } from '../../store/inventory.store';
import { InventoryStatusBadge } from './InventoryStatusBadge';

interface InventoryTableProps {
  items: InventoryItem[];
}

const COLUMNS = ['Item Name', 'Category', 'Unit', 'Current Stock', 'Par Level', 'Status', 'Last Updated', 'Actions'];

function StockValue({ item }: { item: InventoryItem }) {
  const isLow = item.status === 'Low Stock';
  const isOut = item.status === 'Out of Stock';
  const color = isOut
    ? 'text-red-500 dark:text-red-400'
    : isLow
      ? 'text-amber-500 dark:text-amber-400'
      : 'text-gray-800 dark:text-gray-100';

  return (
    <span className={`text-sm font-semibold ${color}`}>
      {item.currentStock.toFixed(2)}
    </span>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={8} className="py-16 text-center">
        <p className="text-gray-400 dark:text-gray-600 text-sm">No items found</p>
        <p className="text-gray-300 dark:text-gray-700 text-xs mt-1">Try adjusting your search or filters</p>
      </td>
    </tr>
  );
}

export function InventoryTable({ items }: InventoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-50 dark:border-gray-800">
            <th className="w-8 px-4 py-3">
              <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 accent-orange-500" />
            </th>
            {COLUMNS.map((col) => (
              <th
                key={col}
                className="text-left text-xs font-semibold text-gray-400 dark:text-gray-500 px-3 py-3 uppercase tracking-wide whitespace-nowrap last:pr-5"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <EmptyState />
          ) : (
            items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-50 dark:border-gray-800/60 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors"
              >
                {/* Checkbox */}
                <td className="px-4 py-3">
                  <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 accent-orange-500" />
                </td>

                {/* Item Name */}
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl leading-none">{item.imageEmoji}</span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">
                      {item.name}
                    </span>
                  </div>
                </td>

                {/* Category */}
                <td className="px-3 py-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.category}</span>
                </td>

                {/* Unit */}
                <td className="px-3 py-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.unit}</span>
                </td>

                {/* Current Stock */}
                <td className="px-3 py-3">
                  <StockValue item={item} />
                </td>

                {/* Par Level */}
                <td className="px-3 py-3">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.parLevel.toFixed(2)}</span>
                </td>

                {/* Status */}
                <td className="px-3 py-3">
                  <InventoryStatusBadge status={item.status} />
                </td>

                {/* Last Updated */}
                <td className="px-3 py-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{item.lastUpdated}</span>
                </td>

                {/* Actions */}
                <td className="px-3 py-3 last:pr-5">
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}