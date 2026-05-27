import React from 'react';
import { useOrdersStore } from '../store/orders.store';
import {
  OrdersHeader,
  OrdersStatCards,
  OrdersTabBar,
  OrdersTable,
  OrdersPagination,
} from '../components/orders';

export default function OrdersPage() {
  const { orders, activeTab, searchQuery, currentPage, perPage } = useOrdersStore();

  // Filter by tab + search
  const filtered = orders.filter((o) => {
    const matchTab    = activeTab === 'All' || o.status === activeTab;
    const q           = searchQuery.toLowerCase();
    const matchSearch = !q
      || o.id.toLowerCase().includes(q)
      || o.customer.toLowerCase().includes(q)
      || o.table.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  // Paginate
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  return (
    <div className="space-y-5">
      {/* 1. Page title + action buttons */}
      <OrdersHeader />

      {/* 2. Five stat cards */}
      <OrdersStatCards />

      {/* 3. Table card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
        {/* 3a. Tab bar + search */}
        <OrdersTabBar />

        {/* 3b. Data table */}
        <OrdersTable orders={paginated} />

        {/* 3c. Pagination */}
        <OrdersPagination totalFiltered={filtered.length} />
      </div>
    </div>
  );
}