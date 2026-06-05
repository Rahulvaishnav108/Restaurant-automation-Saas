import React from 'react';
import { useInventoryStore } from '../store/inventory.store';
import {
  InventoryHeader,
  InventoryStatCards,
  InventoryTabBar,
  InventoryTable,
  InventoryPagination,
  StockAlertsPanel,
  TopSuppliersPanel,
  InventoryValueChart,
  StockStatusDonut,
  TopUsedIngredientsChart,
} from '../components/inventory';

export function InventoryPage() {
  const {
    items,
    activeTab,
    activeCategory,
    searchQuery,
    currentPage,
    perPage,
  } = useInventoryStore();

  // Filter by tab (category shortcut)
  const filtered = items.filter((item) => {
    const matchTab      = activeTab === 'All Items' || item.category === activeTab;
    const matchCategory = activeCategory === 'All Categories' || item.category === activeCategory;
    const q             = searchQuery.toLowerCase();
    const matchSearch   = !q || item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    return matchTab && matchCategory && matchSearch;
  });

  // Paginate
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  return (
    <div className="space-y-5">
      {/* 1. Page header */}
      <InventoryHeader />

      {/* 2. Stat cards */}
      <InventoryStatCards />

      {/* 3. Main content: table + right sidebar */}
      <div className="flex gap-5 items-start">
        {/* Left: Table card */}
        <div className="flex-1 min-w-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <InventoryTabBar />
          <InventoryTable items={paginated} />
          <InventoryPagination totalFiltered={filtered.length} />
        </div>

        {/* Right sidebar */}
        <div className="w-64 xl:w-72 flex-shrink-0 space-y-4">
          <StockAlertsPanel />
          <TopSuppliersPanel />
        </div>
      </div>

      {/* 4. Bottom charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <InventoryValueChart />
        <StockStatusDonut />
        <TopUsedIngredientsChart />
      </div>
    </div>
  );
}