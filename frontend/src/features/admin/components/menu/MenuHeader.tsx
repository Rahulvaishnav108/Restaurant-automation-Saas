import React, { useState } from 'react';
import { RefreshCw, Download, Plus } from 'lucide-react';
import { AddItemModal } from './AddItemModal';

export function MenuHeader(): JSX.Element {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
            Menu Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage your menu items, categories and availability
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 leading-none">Inventory Sync</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Synced 2 mins ago</p>
            </div>
            <button className="ml-1 text-gray-400 hover:text-orange-500 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Import Items
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Item
          </button>
        </div>
      </div>

      {showAddModal && <AddItemModal onClose={() => setShowAddModal(false)} />}
    </>
  );
}