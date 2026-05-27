import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useOrdersStore } from '../../store/orders.store';

interface OrdersPaginationProps {
  totalFiltered: number;
}

export function OrdersPagination({ totalFiltered }: OrdersPaginationProps) {
  const { currentPage, perPage, setCurrentPage, setPerPage } = useOrdersStore();

  const totalPages = Math.ceil(totalFiltered / perPage);
  const start = totalFiltered === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const end   = Math.min(currentPage * perPage, totalFiltered);

  // Build page number list: always show up to 5 pages around current
  const pageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [];
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) {
      pages.push(p);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-50 dark:border-gray-800 flex-wrap gap-3">
      {/* Count */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{start}–{end}</span> of{' '}
        <span className="font-semibold text-gray-700 dark:text-gray-300">{totalFiltered}</span> orders
      </p>

      <div className="flex items-center gap-2">
        {/* Per page */}
        <select
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 mr-1"
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>{n} / page</option>
          ))}
        </select>

        {/* Prev */}
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Pages */}
        {pageNumbers().map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="text-xs text-gray-400 dark:text-gray-600 px-0.5">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => setCurrentPage(p as number)}
              className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                currentPage === p
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}