import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { KitchenSearchProvider } from '../features/kitchen/components/dashboard/KitchenSearchContext';
import KitchenSidebar from '../features/kitchen/components/dashboard/KitchenSidebar';
import KitchenTopBar from '../features/kitchen/components/dashboard/KitchenTopBar';
import KitchenBottomNav from '../features/kitchen/components/dashboard/KitchenBottomNav';
import LiveAlertsBar from '../features/kitchen/components/dashboard/LiveAlertsBar';

export default function KitchenLayout(): JSX.Element {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <KitchenSearchProvider>
      <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
        {/* Desktop Sidebar */}
        <KitchenSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Area */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'
          }`}
        >
          <KitchenTopBar />

          {/* Page Content */}
          <main className="flex-1 overflow-hidden pb-16 lg:pb-14">
            <Outlet />
          </main>
        </div>

        {/* Live Alerts Footer (Desktop) */}
        <LiveAlertsBar />

        {/* Mobile Bottom Nav */}
        <KitchenBottomNav />
      </div>
    </KitchenSearchProvider>
  );
}
