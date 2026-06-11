import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  HelpCircle, 
  Clock, 
  Check, 
  Flame, 
  UtensilsCrossed, 
  MessagesSquare, 
  Clock3, 
  AlertCircle 
} from 'lucide-react';
import { useCustomerStore, MENU_ITEMS } from '../store/customer.store';

export default function OrderTrackingPage() {
  const navigate = useNavigate();
  const { orders, tableCode } = useCustomerStore();

  // Find most recent order or fall back to mock order
  const latestOrder = orders[0] || {
    id: '#ORD-12456',
    items: 'Veg Biryani x1, Paneer Tikka x1, Garlic Naan x1',
    total: 567,
    status: 'Preparing',
    eta: '15-20 mins'
  };

  const [progress, setProgress] = useState(65);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 95) {
          return prev + Math.floor(Math.random() * 3) + 1;
        }
        return prev;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const getStepIndex = (status: string) => {
    if (status === 'Placed') return 0;
    if (status === 'Preparing') return 1;
    if (status === 'Ready') return 2;
    if (status === 'Served') return 3;
    return 1; // Default to preparing
  };

  const currentStep = getStepIndex(latestOrder.status);

  // Helper to parse string items if we need images
  const parsedItems = latestOrder.items.split(', ').map(str => {
    const parts = str.split(' x');
    const name = parts[0];
    const qty = parseInt(parts[1]) || 1;
    const matchItem = MENU_ITEMS.find(m => m.name === name);
    return {
      name,
      qty,
      price: matchItem?.price || 249,
      img: matchItem?.img || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=100&q=80',
      desc: matchItem?.desc || 'Delicious chef special'
    };
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 px-6 py-6 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Order Tracking</h2>
            <div className="flex items-center gap-1 text-orange-500 text-xs font-bold mt-1">
              <MapPin className="w-3.5 h-3.5" /> <span>Table {tableCode}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-800 hover:bg-slate-50 text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5" /> Help
            </button>
            <button 
              onClick={() => navigate('/customer')}
              className="text-xs text-orange-500 font-bold hover:underline"
            >
              Back to Home
            </button>
          </div>
        </div>
      </header>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 w-full">
        
        {/* Left Column: Flow & Live Status (col-span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Order ID & Progress Tracker Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h3 className="text-base font-bold text-slate-950 dark:text-white">Order {latestOrder.id}</h3>
                <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5">Placed today, 07:28 PM</p>
              </div>
              <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                In Progress
              </span>
            </div>

            {/* Responsive Stepper */}
            <div className="relative flex justify-between items-start">
              {/* background connector lines */}
              <div className="absolute top-5 left-6 right-6 h-0.5 bg-slate-100 dark:bg-slate-850 -z-0" />
              <div 
                className="absolute top-5 left-6 h-0.5 bg-orange-500 -z-0 transition-all duration-500" 
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />

              {/* Step 1: Confirmed */}
              <div className="relative z-10 flex flex-col items-center text-center w-1/4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-sm border ${
                  currentStep >= 0 
                    ? 'bg-orange-500 text-white border-orange-500' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400'
                }`}>
                  <Check className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-bold ${currentStep >= 0 ? 'text-orange-500' : 'text-slate-400'}`}>Confirmed</span>
                <span className="text-[9px] text-slate-400 mt-0.5">07:28 PM</span>
              </div>

              {/* Step 2: Preparing */}
              <div className="relative z-10 flex flex-col items-center text-center w-1/4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-sm border transition-all ${
                  currentStep >= 1 
                    ? 'bg-orange-500 text-white border-orange-500 scale-105' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400'
                }`}>
                  <Flame className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-bold ${currentStep >= 1 ? 'text-orange-500' : 'text-slate-400'}`}>Preparing</span>
                <span className="text-[9px] text-slate-400 mt-0.5">07:35 PM</span>
              </div>

              {/* Step 3: Ready */}
              <div className="relative z-10 flex flex-col items-center text-center w-1/4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-sm border ${
                  currentStep >= 2 
                    ? 'bg-orange-500 text-white border-orange-500' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400'
                }`}>
                  <Clock className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-bold ${currentStep >= 2 ? 'text-orange-500' : 'text-slate-400'}`}>Ready</span>
                <span className="text-[9px] text-slate-400 mt-0.5">--:--</span>
              </div>

              {/* Step 4: Served */}
              <div className="relative z-10 flex flex-col items-center text-center w-1/4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-sm border ${
                  currentStep >= 3 
                    ? 'bg-orange-500 text-white border-orange-500' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400'
                }`}>
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-bold ${currentStep >= 3 ? 'text-orange-500' : 'text-slate-400'}`}>Served</span>
                <span className="text-[9px] text-slate-400 mt-0.5">--:--</span>
              </div>
            </div>
          </div>

          {/* Live Cooking Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col md:flex-row h-full">
            <div className="p-8 flex-1 flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-650 rounded-full animate-ping"></span>
                <span className="text-red-650 font-black text-[10px] uppercase tracking-wider">Live Cooking</span>
              </div>
              <h3 className="text-lg font-black leading-tight">
                Your order is <span className="text-orange-500">being prepared</span> 👨‍🍳
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                Our chef is cooking your delicious meal with absolute care. Fresh ingredients are being tossed!
              </p>
              
              <div className="w-full pt-2">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-orange-500 font-extrabold text-xs">{Math.floor(progress)}% Completed</span>
                  <span className="text-slate-400 text-[10px]">approx. 8 mins left</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 h-56 md:h-auto min-h-[220px] relative">
              <img 
                className="absolute inset-0 w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80"
                alt="Chef preparing biryani wok"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-slate-900 via-transparent to-transparent"></div>
            </div>
          </div>

          {/* Timeline detailed logs */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-950 dark:text-white">Order Status Logs</h3>
            <div className="space-y-6 relative pl-4 border-l border-slate-100 dark:border-slate-800/80 ml-2">
              
              <div className="relative">
                <div className="absolute -left-6.5 top-0.5 w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-bold">✓</div>
                <div>
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold">Order Confirmed</h4>
                    <span className="text-[10px] text-slate-400">07:28 PM</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Your table reservation order has been confirmed by kitchen staff.</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-6.5 top-0.5 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold"><Flame className="w-3 h-3" /></div>
                <div>
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-orange-500">Preparing</h4>
                    <span className="text-[10px] text-orange-500 font-bold">07:35 PM</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Chef and staff have started preparing your meal.</p>
                </div>
              </div>

              <div className="relative opacity-55">
                <div className="absolute -left-6.5 top-0.5 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-[10px] font-bold">•</div>
                <div>
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold">Ready to Serve</h4>
                    <span className="text-[10px] text-slate-400">--:--</span>
                  </div>
                  <p className="text-[10px] text-slate-550 dark:text-slate-400 mt-0.5">Your meal is ready to be delivered to your table.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Order Details & Support (col-span 4) */}
        <div className="lg:col-span-4 space-y-6 sticky top-20">
          
          {/* Order Details List Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-6">Order Details</h3>
            
            <div className="space-y-4 mb-6">
              {parsedItems.map((item, i) => (
                <div key={i} className="flex gap-3 items-center justify-between">
                  <div className="relative shrink-0">
                    <img 
                      src={item.img} 
                      alt={item.name} 
                      className="w-12 h-12 rounded-xl object-cover bg-slate-150"
                    />
                    <span className="absolute -top-1.5 -right-1.5 bg-slate-950 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold">
                      {item.qty}
                    </span>
                  </div>
                  <div className="flex-grow min-w-0 px-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
                    <p className="text-[9px] text-slate-400 truncate">{item.desc}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex justify-between items-center text-sm font-black text-slate-900 dark:text-white">
              <span>Total Paid</span>
              <span className="text-orange-500">₹{latestOrder.total}</span>
            </div>
          </div>

          {/* Time Remaining Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
              <Clock3 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold mb-0.5">Estimated Delivery Time</p>
              <h4 className="text-sm font-black text-orange-500">{latestOrder.eta}</h4>
            </div>
          </div>

          {/* Contact Support Chat */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                <MessagesSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Need anything?</h4>
                <p className="text-[10px] text-slate-400">Chat with table assistant</p>
              </div>
            </div>
            <button className="w-full py-2.5 rounded-xl border border-orange-500 text-orange-500 text-xs font-bold hover:bg-orange-500/5 transition-colors">
              Chat Now
            </button>
          </div>

          {/* Info Alert */}
          <div className="bg-slate-100 dark:bg-slate-850 p-4 rounded-2xl flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
              <strong>We will notify you</strong> when your food is prepared and ready to serve at Table {tableCode}.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
