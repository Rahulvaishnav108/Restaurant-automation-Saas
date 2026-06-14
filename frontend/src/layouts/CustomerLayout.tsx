import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { CartProvider } from '../features/customer/components/dashboard/CartContext';
import { SearchProvider } from '../features/customer/components/dashboard/SearchContext';
import CustomerSidebar from '../features/customer/components/dashboard/CustomerSidebar';
import CustomerTopBar from '../features/customer/components/dashboard/CustomerTopBar';
import CustomerBottomNav from '../features/customer/components/dashboard/CustomerBottomNav';
import CartSidebar from '../features/customer/components/dashboard/CartSidebar';

export default function CustomerLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();

  const [prevPath, setPrevPath] = useState(location.pathname);

  // Show cart panel only on home/menu pages
  const showCartPanel = ['/customer/home', '/customer/menu', '/customer'].some((p) =>
    location.pathname === p || location.pathname.startsWith(p + '/')
  );
  // But not on subpages like checkout, orders, etc.
  const cartVisible =
    showCartPanel &&
    !location.pathname.includes('/checkout') &&
    !location.pathname.includes('/orders') &&
    !location.pathname.includes('/reservations') &&
    !location.pathname.includes('/feedback') &&
    !location.pathname.includes('/profile');

  // Automatically close cart drawer on non-persistent pages when route changes
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    if (!cartVisible) {
      setCartOpen(false);
    }
  }

  return (
    <CartProvider>
      <SearchProvider>
        <div className="flex h-screen overflow-hidden bg-sd-surface customer-panel">
          {/* Desktop Sidebar */}
          <CustomerSidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Main area */}
          <div
            className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
              sidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-64'
            } ${cartVisible && cartOpen ? 'lg:mr-[380px]' : ''}`}
          >
            {/* Top bar */}
            <CustomerTopBar onToggleCart={() => setCartOpen(!cartOpen)} />

            {/* Page content */}
            <main className="flex-1 overflow-hidden">
              <Outlet />
            </main>
          </div>

          {/* Cart Sidebar */}
          {!location.pathname.includes('/checkout') && (
            <CartSidebar
              isOpen={cartOpen}
              onClose={() => setCartOpen(!cartOpen)}
              isPersistent={cartVisible}
            />
          )}

          {/* Mobile Bottom Nav */}
          <CustomerBottomNav />
        </div>
      </SearchProvider>
    </CartProvider>
  );
}
