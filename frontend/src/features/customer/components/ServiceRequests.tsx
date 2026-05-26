import React from 'react';
import { BellRing, Droplets, Sparkles, UserRoundCheck } from 'lucide-react';

export type ServiceRequestItem = {
  id: string;
  label: string;
  description: string;
  type: 'waiter' | 'water' | 'cleaning' | 'other';
};

type ServiceRequestsProps = {
  requests?: ServiceRequestItem[];
  onRequest?: (request: ServiceRequestItem) => void;
};

const DEFAULT_REQUESTS: ServiceRequestItem[] = [
  { id: 'waiter', label: 'Waiter Request', description: 'Call staff to your table', type: 'waiter' },
  { id: 'water', label: 'Water Request', description: 'Ask for drinking water', type: 'water' },
  { id: 'cleaning', label: 'Cleaning Request', description: 'Request table cleaning', type: 'cleaning' },
];

const ICONS = {
  waiter: UserRoundCheck,
  water: Droplets,
  cleaning: Sparkles,
  other: BellRing,
};

const ServiceRequests: React.FC<ServiceRequestsProps> = ({ requests = DEFAULT_REQUESTS, onRequest }) => {
  return (
    <div className="space-y-3">
      {requests.map((request) => {
        const Icon = ICONS[request.type];

        return (
          <button
            key={request.id}
            onClick={() => onRequest?.(request)}
            className="w-full flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 hover:border-orange-500/30 transition text-left"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <Icon className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold text-white">{request.label}</span>
              <span className="block text-xs text-slate-400">{request.description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ServiceRequests;
