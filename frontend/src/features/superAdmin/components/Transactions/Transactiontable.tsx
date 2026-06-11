// components/TransactionTable.tsx

import React, { useState } from "react"; // Fixed: Added explicit React import for Fragment syntax
import {
  ArrowUpDown, ArrowUp, ArrowDown, CheckCircle2, AlertCircle,
  XCircle, RefreshCw, CreditCard, ChevronDown, ChevronRight, MapPin, ShoppingBag
} from "lucide-react";
import type {
  Transaction,
  SortField,
  SortOrder,
} from "./Transactiontypes";

import { formatCurrency } from "../../utils/transactionUtils";
interface TransactionTableProps {
  transactions: Transaction[];
  darkMode: boolean;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
}

const STATUS_META = {
  Completed: {
    icon: <CheckCircle2 size={12} />,
    className: "bg-emerald-500/10 text-emerald-500",
  },
  Pending: {
    icon: <AlertCircle size={12} />,
    className: "bg-amber-500/10 text-amber-500",
  },
  Failed: {
    icon: <XCircle size={12} />,
    className: "bg-rose-500/10 text-rose-500",
  },
  Refunded: {
    icon: <RefreshCw size={12} />,
    className: "bg-slate-500/10 text-slate-400",
  },
};

const PAYMENT_ICONS: Record<string, string> = {
  "Credit Card": "💳",
  "UPI / Wallet": "📱",
  "Net Banking": "🏦",
  "Cash": "💵",
  "Crypto": "₿",
};

// Prefixed field with an underscore to satisfy the unused arguments pattern
function SortIcon({ _field, active, order }: { _field: SortField; active: boolean; order: SortOrder }) {
  if (!active) return <ArrowUpDown size={12} className="opacity-40" />;
  return order === "asc" ? <ArrowUp size={12} className="text-orange-500" /> : <ArrowDown size={12} className="text-orange-500" />;
}

export default function TransactionTable({
  transactions,
  darkMode,
  sortField,
  sortOrder,
  onSort,
}: TransactionTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const thBase = `py-3.5 px-5 text-[11px] font-bold uppercase tracking-wider select-none`;
  const thSort = `cursor-pointer hover:opacity-80 transition-opacity`;

  return (
    <div className={`rounded-xl border overflow-hidden ${
      darkMode ? "bg-slate-900/30 border-slate-800/80" : "bg-white border-slate-200/60 shadow-sm"
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse min-w-[900px]">
          <thead>
            <tr className={`border-b border-inherit ${
              darkMode ? "bg-slate-950/60 text-slate-400" : "bg-slate-50 text-slate-500"
            }`}>
              <th className={`${thBase} w-10`} />
              <th className={thBase}>Order ID</th>
              <th className={`${thBase} ${thSort}`} onClick={() => onSort("restaurant")}>
                <div className="flex items-center gap-1">Restaurant <SortIcon _field="restaurant" active={sortField === "restaurant"} order={sortOrder} /></div>
              </th>
              <th className={`${thBase} ${thSort}`} onClick={() => onSort("amount")}>
                <div className="flex items-center gap-1">Amount <SortIcon _field="amount" active={sortField === "amount"} order={sortOrder} /></div>
              </th>
              <th className={`${thBase} ${thSort}`} onClick={() => onSort("commission")}>
                <div className="flex items-center gap-1">Commission <SortIcon _field="commission" active={sortField === "commission"} order={sortOrder} /></div>
              </th>
              <th className={thBase}>Payment</th>
              <th className={thBase}>Status</th>
              <th className={`${thBase} ${thSort} text-right`} onClick={() => onSort("timestamp")}>
                <div className="flex items-center justify-end gap-1">Timestamp <SortIcon _field="timestamp" active={sortField === "timestamp"} order={sortOrder} /></div>
              </th>
            </tr>
          </thead>

          <tbody className={`divide-y ${darkMode ? "divide-slate-800/40" : "divide-slate-100"}`}>
            {transactions.length > 0 ? (
              transactions.map((tx) => {
                const isExpanded = expandedRow === tx.id;
                const meta = STATUS_META[tx.status];

                return (
                  <React.Fragment key={tx.id}>
                    <tr
                      onClick={() => setExpandedRow(isExpanded ? null : tx.id)}
                      className={`transition-colors cursor-pointer ${
                        isExpanded
                          ? darkMode ? "bg-slate-800/30" : "bg-orange-50/40"
                          : darkMode ? "hover:bg-slate-800/20" : "hover:bg-slate-50/60"
                      }`}
                    >
                      {/* Expand toggle */}
                      <td className="py-3.5 px-3 text-center">
                        <span className={`${darkMode ? "text-slate-500" : "text-slate-400"} transition-transform inline-block ${isExpanded ? "rotate-90" : ""}`}>
                          <ChevronRight size={14} />
                        </span>
                      </td>

                      {/* Order ID */}
                      <td className="py-3.5 px-5">
                        <span className={`font-mono text-[11px] font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{tx.id}</span>
                      </td>

                      {/* Restaurant */}
                      <td className="py-3.5 px-5">
                        <div className={`font-semibold text-sm ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{tx.restaurant}</div>
                        <div className={`text-[10px] mt-0.5 flex items-center gap-0.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                          <MapPin size={10} />{tx.city}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className={`py-3.5 px-5 font-extrabold text-sm ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
                        {formatCurrency(tx.amount)}
                      </td>

                      {/* Commission */}
                      <td className="py-3.5 px-5">
                        <span className="font-bold text-orange-500">{formatCurrency(tx.commission)}</span>
                        <span className={`ml-1.5 text-[10px] font-semibold ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{tx.commissionRate}%</span>
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-5">
                        <div className={`flex items-center gap-1.5 font-medium ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                          <span>{PAYMENT_ICONS[tx.paymentMethod] ?? <CreditCard size={13} />}</span>
                          <span>{tx.paymentMethod}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${meta.className}`}>
                          {meta.icon}
                          {tx.status}
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td className={`py-3.5 px-5 text-right font-medium whitespace-nowrap ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                        {tx.timestamp}
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {isExpanded && (
                      <tr className={darkMode ? "bg-slate-900/60" : "bg-orange-50/30"}>
                        <td />
                        <td colSpan={7} className="px-5 py-3">
                          <div className="flex flex-wrap gap-6 text-xs">
                            <div>
                              <span className={`block text-[10px] font-bold uppercase tracking-wider mb-0.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Restaurant ID</span>
                              <span className={`font-mono font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{tx.restaurantId}</span>
                            </div>
                            <div>
                              <span className={`block text-[10px] font-bold uppercase tracking-wider mb-0.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Orders in Batch</span>
                              <span className={`font-semibold flex items-center gap-1 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                                <ShoppingBag size={12} className="text-orange-500" />
                                {tx.ordersCount} orders
                              </span>
                            </div>
                            <div>
                              <span className={`block text-[10px] font-bold uppercase tracking-wider mb-0.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Avg per Order</span>
                              <span className={`font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                                {formatCurrency(tx.amount / tx.ordersCount)}
                              </span>
                            </div>
                            {tx.note && (
                              <div>
                                <span className={`block text-[10px] font-bold uppercase tracking-wider mb-0.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Note</span>
                                <span className={`italic ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{tx.note}</span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-16">
                  <div className={`inline-flex flex-col items-center gap-2 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                    <ChevronDown size={28} className="opacity-40" />
                    <span className="text-sm font-semibold">No transactions match your filters.</span>
                    <span className="text-xs opacity-70">Try adjusting the search or status filter.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}