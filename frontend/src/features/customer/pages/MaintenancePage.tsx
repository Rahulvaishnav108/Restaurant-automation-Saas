import React from 'react';
import { Wrench, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MaintenancePageProps {
  title?: string;
  description?: string;
}

export default function MaintenancePage({
  title = 'Under Maintenance',
  description = 'This page is being built. Check back soon.',
}: MaintenancePageProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center pb-24 md:pb-6">
      {/* Icon */}
      <div className="w-20 h-20 rounded-3xl bg-[#FF9F00]/10 dark:bg-[#FF9F00]/15 flex items-center justify-center mb-5">
        <Wrench className="w-9 h-9 text-[#FF9F00]" />
      </div>

      {/* Text */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed mb-6">
        {description}
      </p>

      {/* Progress bar decoration */}
      <div className="w-48 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-gradient-to-r from-[#FF9F00] to-[#e68f00] rounded-full animate-pulse"
          style={{ width: '60%' }}
        />
      </div>

      <button
        onClick={() => navigate('/customer')}
        className="flex items-center gap-2 text-sm font-semibold text-[#FF9F00] hover:text-[#e68f00] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>
    </div>
  );
}
