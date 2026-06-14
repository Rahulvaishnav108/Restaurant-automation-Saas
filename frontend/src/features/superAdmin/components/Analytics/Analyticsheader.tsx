import React from "react";
import { RefreshCw, Download, PlusCircle } from "lucide-react";

interface AnalyticsHeaderProps {
  darkMode: boolean;
  isRefreshing: boolean;
  onSync: () => void;
  onExport: () => void;
  onOnboard: () => void;
}

export default function AnalyticsHeader({
  darkMode,
  isRefreshing,
  onSync,
  onExport,
  onOnboard,
}: AnalyticsHeaderProps) {
  const ghostBtn = `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
    darkMode
      ? "bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-200"
      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
  }`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">System Core Matrix</h2>
        <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          Telemetry routing, resource allocation matrices, and cluster state logs.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={onSync} type="button" className={ghostBtn}>
          <RefreshCw
            size={13}
            className={isRefreshing ? "animate-spin text-orange-500" : ""}
          />
          <span>{isRefreshing ? "Syncing..." : "Sync Systems"}</span>
        </button>

        <button onClick={onExport} type="button" className={ghostBtn}>
          <Download size={13} className="text-blue-500" />
          <span>Export Ledger</span>
        </button>

        <button
          onClick={onOnboard}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-sm hover:opacity-95 transition-all"
        >
          <PlusCircle size={13} />
          <span>Onboard Franchise</span>
        </button>
      </div>
    </div>
  );
}