import React, { useState, useEffect } from 'react';

const STEPS = [
  { icon: 'assignment_turned_in', label: 'Confirmed', time: '07:28 PM' },
  { icon: 'skillet', label: 'Preparing', time: '07:35 PM' },
  { icon: 'room_service', label: 'Ready', time: '--:--' },
  { icon: 'check_circle', label: 'Served', time: '--:--' },
];

export default function CustomerOrderTrackingPage() {
  const [progress, setProgress] = useState(65);
  const activeStep = 1; // 0-indexed, currently "Preparing"

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 95 ? prev + Math.random() * 0.5 : prev));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto h-full sd-custom-scrollbar">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-sd-on-surface font-sans">Order Tracking</h2>
        <div className="flex items-center gap-1 text-sd-primary cursor-pointer hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined text-[16px]">location_on</span>
          <span className="text-sm font-semibold font-sans">Table T07</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order ID & Stepper */}
          <div className="bg-white rounded-2xl p-6 border border-sd-outline-variant sd-food-card-shadow">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-base font-bold text-sd-on-surface font-sans">Order #ORD-12456</h3>
                <p className="text-xs text-sd-on-surface-variant font-sans">Placed on 24 May, 07:28 PM</p>
              </div>
              <span className="bg-sd-secondary-container text-sd-on-secondary-container px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 font-sans">
                <span className="w-2 h-2 bg-sd-secondary rounded-full animate-pulse" />
                In Progress
              </span>
            </div>

            {/* Stepper */}
            <div className="relative flex justify-between items-start">
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-sd-surface-variant" />
              <div className="absolute top-6 left-0 h-0.5 bg-sd-primary-container transition-all" style={{ width: `${((activeStep + 0.5) / (STEPS.length - 1)) * 100}%` }} />
              {STEPS.map((step, i) => {
                const isDone = i < activeStep;
                const isActive = i === activeStep;
                const isFuture = i > activeStep;
                return (
                  <div key={step.label} className={`relative z-10 flex flex-col items-center text-center w-1/4 ${isFuture ? 'opacity-40' : ''}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      isActive ? 'bg-sd-primary-container text-white shadow-lg scale-110' :
                      isDone ? 'border-2 border-sd-primary-container bg-white text-sd-primary-container shadow-md' :
                      'border-2 border-sd-outline-variant bg-white text-sd-on-surface-variant'
                    }`}>
                      <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
                    </div>
                    <span className={`text-xs font-semibold font-sans ${isActive ? 'text-sd-primary-container' : isDone ? 'text-sd-primary' : ''}`}>{step.label}</span>
                    <span className={`text-[10px] font-sans mt-0.5 ${isActive ? 'text-sd-primary font-bold' : 'text-sd-on-surface-variant'}`}>{step.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Cooking */}
          <div className="bg-white rounded-2xl overflow-hidden border border-sd-outline-variant sd-food-card-shadow flex flex-col md:flex-row">
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
                <span className="text-red-600 font-bold text-xs tracking-wider font-sans">LIVE COOKING</span>
              </div>
              <h3 className="text-xl font-bold mb-2 font-sans">
                Your order is <span className="text-sd-primary-container">being prepared</span> 👨‍🍳
              </h3>
              <p className="text-sm text-sd-on-surface-variant mb-6 max-w-sm font-sans">
                Our chef is cooking your delicious meal with love and care.
              </p>
              <div className="w-full">
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-sd-primary-container font-bold text-sm font-sans">{Math.floor(progress)}% Completed</span>
                  <span className="text-sd-on-surface-variant text-xs font-sans">approx. 8 mins left</span>
                </div>
                <div className="h-3 w-full bg-sd-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-sd-primary-container rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
            <div className="flex-1 h-52 md:h-auto min-h-[200px] relative">
              <img
                className="absolute inset-0 w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOuzvhhHsEDrrMH1coqv2a10CTYgQjDCWUHxrjrXawjcY9-pGVNmcP6l2fOekd9G8ogTDdrwi3v3FAqmnyv-FMWr7GZgFEtURv64ncIWHLbbC1p8CmBf2QrQhcisBAZGxNLEeTa_UWYSyJuPmIJNrTllaLa7I2f2xugfXa8nR_ZuL5nv_DrXIxnd-p2G1ZckDlcVi7MY5pm2oPSk8TNTYbTg8gdvia6Q8sP6J0xBZbiXkFqx17ntQUyHn9Y_sl1oTr9Pczq1C62Zs"
                alt="Chef cooking"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent md:from-white md:via-white/50 md:to-transparent" />
            </div>
          </div>

          {/* Status Log */}
          <div className="bg-white rounded-2xl p-6 border border-sd-outline-variant sd-food-card-shadow">
            <h3 className="text-base font-bold text-sd-on-surface mb-5 font-sans">Order Status</h3>
            <div className="space-y-5">
              {[
                { icon: 'check', label: 'Order Confirmed', time: '07:28 PM', desc: 'Your order has been confirmed.', color: 'bg-sd-secondary-container text-sd-secondary', active: false },
                { icon: 'skillet', label: 'Preparing', time: '07:35 PM', desc: 'Chef is preparing your order.', color: 'bg-sd-primary-container/10 text-sd-primary-container', active: true },
                { icon: 'room_service', label: 'Ready to Serve', time: '--:--', desc: 'Your order will be ready soon.', color: 'bg-sd-surface-container text-sd-on-surface-variant', active: false, faded: true },
                { icon: 'restaurant', label: 'Order Served', time: '--:--', desc: 'Enjoy your meal! 🍴', color: 'bg-sd-surface-container text-sd-on-surface-variant', active: false, faded: true },
              ].map((s, i) => (
                <div key={i} className={`flex gap-4 ${s.faded ? 'opacity-50' : ''}`}>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${s.color}`}>
                      <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                    </div>
                    {i < 3 && <div className="w-0.5 h-8 bg-sd-surface-variant mt-2" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className={`text-sm font-bold font-sans ${s.active ? 'text-sd-primary-container' : ''}`}>{s.label}</h4>
                      <span className={`text-xs font-sans ${s.active ? 'text-sd-primary font-bold' : 'text-sd-on-surface-variant'}`}>{s.time}</span>
                    </div>
                    <p className="text-xs text-sd-on-surface-variant font-sans mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-5">
          {/* Order Details */}
          <div className="bg-white rounded-2xl p-5 border border-sd-outline-variant sd-food-card-shadow">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-sd-on-surface font-sans">Order Details</h3>
              <span className="text-sd-primary-container font-bold text-sm font-sans">3 Items</span>
            </div>
            <div className="space-y-3 mb-6">
              {['Veg Biryani', 'Paneer Tikka', 'Garlic Naan'].map((name, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-xl bg-sd-surface-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-sd-on-surface-variant/50 text-[18px]">restaurant</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sd-on-surface text-sm font-sans">{name}</h4>
                    <p className="text-[10px] text-sd-on-surface-variant font-sans">No onion • Less spicy</p>
                  </div>
                  <span className="font-bold text-sd-on-surface text-sm font-sans">₹{[249, 229, 89][i]}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-sd-surface-variant flex justify-between items-center">
              <span className="text-base font-bold text-sd-on-surface font-sans">Total</span>
              <span className="text-base font-bold text-sd-primary-container font-sans">₹567</span>
            </div>
          </div>

          {/* Estimated Time */}
          <div className="bg-white rounded-2xl p-5 border border-sd-outline-variant sd-food-card-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-sd-primary-container/10 flex items-center justify-center text-sd-primary-container shrink-0">
              <span className="material-symbols-outlined text-3xl">schedule</span>
            </div>
            <div>
              <p className="text-xs text-sd-on-surface-variant font-sans">Estimated Time</p>
              <h4 className="text-base font-bold text-sd-primary-container font-sans">15-20 mins</h4>
              <p className="text-[10px] text-sd-on-surface-variant font-sans">We&apos;ll notify you when it&apos;s ready.</p>
            </div>
          </div>

          {/* Support */}
          <div className="bg-white rounded-2xl p-5 border border-sd-outline-variant sd-food-card-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-sd-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-sd-on-surface-variant text-xl">forum</span>
              </div>
              <div>
                <h4 className="text-sm font-bold font-sans">Need anything?</h4>
                <p className="text-[10px] text-sd-on-surface-variant font-sans">Chat with our support team</p>
              </div>
            </div>
            <button className="w-full py-2.5 rounded-xl border border-sd-primary-container text-sd-primary-container font-bold text-sm hover:bg-sd-primary-container/5 transition-colors font-sans">
              Chat Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
