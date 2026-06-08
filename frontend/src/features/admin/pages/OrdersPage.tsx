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
            const {
                orders, activeTab, searchQuery,
                    currentPage, perPage, sortBy,
                        paymentFilter, minAmount, maxAmount,
                          } = useOrdersStore();

                            // 1. Filter by tab
                              const byTab = orders.filter((o) =>
                                  activeTab === 'All' || o.status === activeTab,
                                    );

                                      // 2. Filter by search
                                        const bySearch = byTab.filter((o) => {
                                            const q = searchQuery.toLowerCase();
                                                return !q
                                                      || o.id.toLowerCase().includes(q)
                                                            || o.customer.toLowerCase().includes(q)
                                                                  || o.table.toLowerCase().includes(q);
                                                                    });

                                                                      // 3. Filter by payment method
                                                                        const byPayment = bySearch.filter((o) =>
                                                                            paymentFilter === 'All' || o.payment === paymentFilter,
                                                                              );

                                                                                // 4. Filter by amount range
                                                                                  const byAmount = byPayment.filter((o) => {
                                                                                      const min = minAmount !== '' ? Number(minAmount) : null;
                                                                                          const max = maxAmount !== '' ? Number(maxAmount) : null;
                                                                                              if (min !== null && o.amountRaw < min) return false;
                                                                                                  if (max !== null && o.amountRaw > max) return false;
                                                                                                      return true;
                                                                                                        });

                                                                                                          // 5. Sort — newest first when coming from dashboard "View all"
                                                                                                            const sorted = sortBy === 'time'
                                                                                                                ? [...byAmount].sort((a, b) => a.timeRaw - b.timeRaw)
                                                                                                                    : byAmount;

                                                                                                                      // 6. Paginate
                                                                                                                        const paginated = sorted.slice(
                                                                                                                            (currentPage - 1) * perPage,
                                                                                                                                currentPage * perPage,
                                                                                                                                  );

                                                                                                                                    return (
                                                                                                                                        <div className="space-y-5">
                                                                                                                                              <OrdersHeader />
                                                                                                                                                    <OrdersStatCards />
                                                                                                                                                          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                                                                                                                                                                  <OrdersTabBar />
                                                                                                                                                                          <OrdersTable orders={paginated} />
                                                                                                                                                                                  <OrdersPagination totalFiltered={sorted.length} />
                                                                                                                                                                                        </div>
                                                                                                                                                                                            </div>
                                                                                                                                                                                              );
                                                                                                                                                                                              }
                                                                                                                                                                                              