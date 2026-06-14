import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { KitchenSearchProvider } from '../features/kitchen/components/dashboard/KitchenSearchContext';
import KitchenSidebar from '../features/kitchen/components/dashboard/KitchenSidebar';
import KitchenTopBar from '../features/kitchen/components/dashboard/KitchenTopBar';
import LiveAlertsBar from '../features/kitchen/components/dashboard/LiveAlertsBar';

export default function KitchenLayout(): JSX.Element {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
  });

  return (
    <KitchenSearchProvider>
      <div className="flex min-h-screen bg-sd-surface text-sd-on-surface font-sans kitchen-panel">
        {/* Sidebar */}
        <KitchenSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onItemClick={() => {
            if (window.innerWidth < 1024) {
              setSidebarCollapsed(true);
            }
          }}
        />

        {/* Mobile Backdrop when Sidebar is expanded */}
        {!sidebarCollapsed && (
          <button
            className="lg:hidden fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-40 w-full h-full border-none outline-none cursor-default"
            onClick={() => setSidebarCollapsed(true)}
            aria-label="Close sidebar"
          />
        )}

        {/* Main Area */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            sidebarCollapsed ? 'ml-[72px]' : 'ml-[72px] lg:ml-64'
          }`}
        >
          <KitchenTopBar />

          {/* Page Content */}
          <main className="flex-1 overflow-hidden pb-0 lg:pb-14">
            <Outlet />
          </main>
        </div>

        {/* Live Alerts Footer (Desktop) */}
        <LiveAlertsBar sidebarCollapsed={sidebarCollapsed} />
      </div>
    </KitchenSearchProvider>
  );
}

