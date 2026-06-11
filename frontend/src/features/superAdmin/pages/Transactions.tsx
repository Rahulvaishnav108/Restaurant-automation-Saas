import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom"; // <-- Added to get context from Layout
import { StatusFilter, SortField, SortOrder, DateRange } from "../components/Transactions/Transactiontypes";
import { filterByDateRange, computeMetrics, exportToCSV } from "../utils/transactionUtils";
import TransactionMetrics from "../components/Transactions/Transactionmetrics";
import TransactionControls from "../components/Transactions/Transactioncontrols";
import TransactionTable from "../components/Transactions/Transactiontable";
import TransactionSummaryBar from "../components/Transactions/Transactionsummarybar";
import { transactionData } from "../store/Transactions";

// Define the shape of our layout context
interface LayoutContextType {
  darkMode: boolean;
}

export default function Transactions() {
  // Grab the darkMode state dynamically from the SuperAdminLayout wrapper context
  const { darkMode } = useOutletContext<LayoutContextType>();

  useEffect(() => {
    const handleThemeSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail !== undefined) {
        if (customEvent.detail.darkMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };
    window.addEventListener("sync-app-theme", handleThemeSync);
    return () => window.removeEventListener("sync-app-theme", handleThemeSync);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [dateRange, setDateRange] = useState<DateRange>("all");

  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handleResetAll = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setPaymentFilter("All");
    setDateRange("all");
  };

  const dateFiltered = useMemo(() => filterByDateRange(transactionData, dateRange), [dateRange]);

  const filteredTransactions = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return dateFiltered.filter((tx) => {
      const matchesSearch = tx.id.toLowerCase().includes(q) || tx.restaurant.toLowerCase().includes(q) || tx.city.toLowerCase().includes(q) || tx.restaurantId.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || tx.status === statusFilter;
      const matchesPayment = paymentFilter === "All" || tx.paymentMethod === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [dateFiltered, searchTerm, statusFilter, paymentFilter]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      if (sortField === "timestamp") {
        return sortOrder === "asc" ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime() : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      if (sortField === "restaurant") {
        return sortOrder === "asc" ? a.restaurant.localeCompare(b.restaurant) : b.restaurant.localeCompare(a.restaurant);
      }
      const va = a[sortField] as number;
      const vb = b[sortField] as number;
      return sortOrder === "asc" ? va - vb : vb - va;
    });
  }, [filteredTransactions, sortField, sortOrder]);

  const metrics = useMemo(() => computeMetrics(filteredTransactions), [filteredTransactions]);
  const handleExport = () => exportToCSV(sortedTransactions, "transactions-export.csv");

  return (
    <div className={`min-h-screen px-6 py-8 transition-colors duration-300 ${darkMode ? "bg-[#020817] text-slate-100" : "bg-[#F8FAFC] text-slate-800"}`}>
      <TransactionMetrics metrics={metrics} darkMode={darkMode} />
      <TransactionControls
        searchTerm={searchTerm} statusFilter={statusFilter} paymentFilter={paymentFilter} dateRange={dateRange} darkMode={darkMode}
        totalCount={transactionData.length} filteredCount={filteredTransactions.length}
        onSearchChange={setSearchTerm} onStatusChange={setStatusFilter} onPaymentChange={setPaymentFilter} onDateRangeChange={setDateRange}
        onExport={handleExport} onResetAll={handleResetAll}
      />
      <TransactionTable transactions={sortedTransactions} darkMode={darkMode} sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
      <TransactionSummaryBar metrics={metrics} darkMode={darkMode} filteredCount={filteredTransactions.length} />
    </div>
  );
}