import React from 'react';
import { useCustomersStore } from '../store/customers.store';
import {
  CustomersHeader,
  CustomersStatCards,
  CustomersFilterBar,
  CustomersTable,
  CustomersPagination,
  TopCustomersPanel,
  CustomerOverviewChart,
  LoyaltyTierChart,
} from '../components/customers';

export function CustomersPage() {
  const {
    customers,
    searchQuery,
    activeStatusFilter,
    activeTierFilter,
    currentPage,
    perPage,
  } = useCustomersStore();

  // Filter
  const filtered = customers.filter((c) => {
    const matchStatus = activeStatusFilter === 'All' || c.status === activeStatusFilter;
    const matchTier   = activeTierFilter   === 'All' || c.loyaltyTier === activeTierFilter;
    const q           = searchQuery.toLowerCase();
    const matchSearch = !q
      || c.name.toLowerCase().includes(q)
      || c.email.toLowerCase().includes(q)
      || c.phone.toLowerCase().includes(q);
    return matchStatus && matchTier && matchSearch;
  });

  // Paginate
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  return (
    <div className="space-y-5">
      {/* 1. Page header */}
      <CustomersHeader />

      {/* 2. Stat cards */}
      <CustomersStatCards />

      {/* 3. Main content: table + right sidebar */}
      <div className="flex gap-5 items-start">
        {/* Left: Table card */}
        <div className="flex-1 min-w-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          {/* Filter bar */}
          <CustomersFilterBar />

          {/* Table */}
          <CustomersTable customers={paginated} />

          {/* Pagination */}
          <CustomersPagination totalFiltered={filtered.length} />
        </div>

        {/* Right sidebar */}
        <div className="w-64 xl:w-72 flex-shrink-0 space-y-4">
          <TopCustomersPanel />
          <CustomerOverviewChart />
          <LoyaltyTierChart />
        </div>
      </div>
    </div>
  );
}