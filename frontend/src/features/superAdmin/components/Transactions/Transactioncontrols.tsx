// components/TransactionControls.tsx

import { Search, Download, X, SlidersHorizontal } from "lucide-react";
import type {
  StatusFilter,
  DateRange,
} from "./Transactiontypes";

import {
  STATUS_FILTERS,
  DATE_RANGES,
  PAYMENT_METHODS,
} from "../../store/Transactions";

interface TransactionControlsProps {
  searchTerm: string;
  statusFilter: StatusFilter;
  paymentFilter: string;
  dateRange: DateRange;
  darkMode: boolean;
  totalCount: number;
  filteredCount: number;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: StatusFilter) => void;
  onPaymentChange: (v: string) => void;
  onDateRangeChange: (v: DateRange) => void;
  onExport: () => void;
  onResetAll: () => void;
}

export default function TransactionControls({
  searchTerm,
  statusFilter,
  paymentFilter,
  dateRange,
  darkMode,
  totalCount,
  filteredCount,
  onSearchChange,
  onStatusChange,
  onPaymentChange,
  onDateRangeChange,
  onExport,
  onResetAll,
}: TransactionControlsProps) {
  const isFiltered = statusFilter !== "All" || paymentFilter !== "All" || dateRange !== "all" || searchTerm !== "";

  const base = `rounded-lg border text-xs font-semibold px-3 py-1.5 transition-all whitespace-nowrap`;
  const active = `bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-500/20`;
  const inactive = darkMode
    ? `bg-slate-900/30 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700`
    : `bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50`;

  return (
    <div className={`rounded-xl border mb-5 overflow-hidden ${
      darkMode ? "bg-slate-900/30 border-slate-800/80" : "bg-white border-slate-200/60 shadow-sm"
    }`}>

      {/* Top row: search + export */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-4 border-b border-inherit">
        <div className="relative flex-1 w-full">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-slate-500" : "text-slate-400"}`} size={15} />
          <input
            type="text"
            placeholder="Search by Order ID, restaurant, or city..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full pl-9 pr-8 py-2.5 text-sm rounded-lg border outline-none transition-all focus:ring-2 ${
              darkMode
                ? "bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:border-orange-500/50 focus:ring-orange-500/10"
                : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-orange-500/50 focus:ring-orange-500/10"
            }`}
          />
          {searchTerm && (
            <button onClick={() => onSearchChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isFiltered && (
            <button
              onClick={onResetAll}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                darkMode
                  ? "bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/20"
                  : "bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100"
              }`}
            >
              <SlidersHorizontal size={13} />
              <span>{filteredCount} / {totalCount}</span>
              <X size={11} />
            </button>
          )}

          <button
            onClick={onExport}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
              darkMode
                ? "bg-slate-900/50 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Bottom row: status pills + payment + date range */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-3">

        {/* Status tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange(s as StatusFilter)}
              className={`${base} ${statusFilter === s ? active : inactive}`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className={`h-5 w-px mx-1 ${darkMode ? "bg-slate-800" : "bg-slate-200"}`} />

        {/* Payment method */}
        <select
          value={paymentFilter}
          onChange={(e) => onPaymentChange(e.target.value)}
          className={`text-xs font-semibold rounded-lg border px-2.5 py-1.5 outline-none transition-all cursor-pointer ${
            paymentFilter !== "All"
              ? active
              : darkMode
              ? "bg-slate-900/30 border-slate-800 text-slate-400"
              : "bg-white border-slate-200 text-slate-600"
          }`}
        >
          {PAYMENT_METHODS.map((m) => (
            <option key={m} value={m}>{m === "All" ? "All Methods" : m}</option>
          ))}
        </select>

        <div className={`h-5 w-px mx-1 ${darkMode ? "bg-slate-800" : "bg-slate-200"}`} />

        {/* Date range */}
        <div className="flex items-center gap-1.5">
          {DATE_RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => onDateRangeChange(r.value as DateRange)}
              className={`${base} ${dateRange === r.value ? active : inactive}`}
            >
              {r.label}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}