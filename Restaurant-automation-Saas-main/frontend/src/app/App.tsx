import React, { useState } from 'react';
import LandingPage from '../features/customer/pages/LandingPage';
import CustomerDashboard from '../features/customer/pages/CustomerDashboard';

export type AppPage = 'landing' | 'dashboard';

const App = () => {
  const [page, setPage] = useState<AppPage>('landing');

  return (
    <main className="min-h-screen bg-[#050814] text-white">
      {page === 'landing' ? (
        <LandingPage onEnterApp={() => setPage('dashboard')} />
      ) : (
        <CustomerDashboard onBack={() => setPage('landing')} />
      )}
    </main>
  );
};

export default App;
