import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  Sparkles, 
  Lock, 
  Award, 
  MessageSquare,
  Volume2,
  Bell,
  Trash2,
  Camera,
  Heart
} from 'lucide-react';
import { useCustomerStore, MENU_ITEMS } from '../store/customer.store';

export default function FeedbackPage() {
  const navigate = useNavigate();
  const { tableCode, orders } = useCustomerStore();

  const latestOrder = orders[0] || {
    id: '#ORD-12456',
    items: 'Veg Biryani x1, Paneer Tikka x1, Garlic Naan x1',
    total: 567,
    status: 'Preparing',
    eta: '15-20 mins'
  };

  const [overallRating, setOverallRating] = useState<'bad' | 'okay' | 'excellent'>('excellent');
  
  // Category star ratings state
  const [foodRating, setFoodRating] = useState(5);
  const [tasteRating, setTasteRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(4);
  const [packagingRating, setPackagingRating] = useState(5);
  
  const [thoughts, setThoughts] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit() {
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      navigate('/customer');
    }, 2500);
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 px-6 py-6 shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Rate Your Experience</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-550">Order {latestOrder.id}</span>
              <span className="bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                Delivered
              </span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/customer')}
            className="text-xs text-orange-500 font-bold hover:underline"
          >
            ← Skip Feedback
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 w-full">
        
        {/* Left Column: Emoji Rating & Stars Categories (col-span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Order Summary & Delivery Status Details */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-6">
            <img 
              src="https://images.unsplash.com/photo-1544025162-d76694265947?w=300&q=80" 
              alt="Delivered Order" 
              className="w-full md:w-36 h-36 object-cover rounded-2xl shrink-0 bg-slate-100"
            />
            <div className="flex-grow flex flex-col justify-center space-y-3">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Delivered on</p>
              <h3 className="text-base font-black">Today, 08:15 PM</h3>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100/50 dark:border-slate-800/30">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Thank you for dining with us! We hope you loved the fresh food, hygiene and taste. Please rate your experience.
                </p>
              </div>
            </div>
          </div>

          {/* Emoji Rating Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400">How was your overall experience?</h3>
            
            <div className="flex justify-center gap-8 w-full max-w-xs">
              {/* Bad */}
              <div 
                onClick={() => setOverallRating('bad')}
                className={`flex flex-col items-center gap-1 cursor-pointer group transition-transform hover:scale-105 ${
                  overallRating === 'bad' ? 'scale-110 font-bold text-orange-500' : 'opacity-50'
                }`}
              >
                <span className="text-4.5xl select-none">😠</span>
                <span className="text-[10px]">Very Bad</span>
              </div>

              {/* Okay */}
              <div 
                onClick={() => setOverallRating('okay')}
                className={`flex flex-col items-center gap-1 cursor-pointer group transition-transform hover:scale-105 ${
                  overallRating === 'okay' ? 'scale-110 font-bold text-orange-500' : 'opacity-50'
                }`}
              >
                <span className="text-4.5xl select-none">😐</span>
                <span className="text-[10px]">Okay</span>
              </div>

              {/* Excellent */}
              <div 
                onClick={() => setOverallRating('excellent')}
                className={`flex flex-col items-center gap-1 cursor-pointer group transition-transform hover:scale-105 ${
                  overallRating === 'excellent' ? 'scale-110 font-bold text-orange-500' : 'opacity-50'
                }`}
              >
                <span className="text-4.5xl select-none">🤩</span>
                <span className="text-[10px]">Amazing!</span>
              </div>
            </div>

            <div className="w-full max-w-xs py-2 bg-green-500/10 border border-green-500/10 rounded-xl text-green-500 text-xs font-bold">
              {overallRating === 'excellent' ? 'Amazing! 😍' : overallRating === 'okay' ? 'Okay 😐' : 'Very Bad 😠'}
            </div>
          </div>

          {/* Stars Ratings Categories */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400">Rate specific categories</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Food Quality */}
              <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-xs font-bold">Food Quality</p>
                  <div className="flex gap-1 mt-1 text-orange-500 cursor-pointer">
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} onClick={() => setFoodRating(s)}>
                        <Star className={`w-4 h-4 ${s <= foodRating ? 'fill-current' : 'text-slate-300 dark:text-slate-700'}`} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Taste */}
              <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-xs font-bold">Taste</p>
                  <div className="flex gap-1 mt-1 text-orange-500 cursor-pointer">
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} onClick={() => setTasteRating(s)}>
                        <Star className={`w-4 h-4 ${s <= tasteRating ? 'fill-current' : 'text-slate-300 dark:text-slate-700'}`} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Delivery Time */}
              <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-xs font-bold">Service Time</p>
                  <div className="flex gap-1 mt-1 text-orange-500 cursor-pointer">
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} onClick={() => setDeliveryRating(s)}>
                        <Star className={`w-4 h-4 ${s <= deliveryRating ? 'fill-current' : 'text-slate-300 dark:text-slate-700'}`} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Packaging */}
              <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-xs font-bold">Table Cleanliness</p>
                  <div className="flex gap-1 mt-1 text-orange-500 cursor-pointer">
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} onClick={() => setPackagingRating(s)}>
                        <Star className={`w-4 h-4 ${s <= packagingRating ? 'fill-current' : 'text-slate-300 dark:text-slate-700'}`} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Text Feedback & Submit (col-span 4) */}
        <div className="lg:col-span-4 space-y-6 sticky top-20">
          
          {/* Write Comments Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400">Tell us more</h3>
            
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col min-h-[140px]">
              <textarea 
                value={thoughts}
                onChange={(e) => setThoughts(e.target.value.slice(0, 300))}
                placeholder="Share your experience about food quality, taste, service cleanliness..."
                className="w-full flex-grow bg-transparent border-none focus:ring-0 text-xs font-body-md text-slate-700 dark:text-slate-300 resize-none p-0 focus:outline-none"
              />
              <span className="text-right text-[9px] text-slate-400 mt-2 font-bold">{thoughts.length}/300</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 text-slate-500 hover:text-orange-500 text-xs font-bold rounded-xl transition-all">
                <Camera className="w-3.5 h-3.5" /> Add Photos
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 text-slate-500 hover:text-orange-500 text-xs font-bold rounded-xl transition-all">
                <Volume2 className="w-3.5 h-3.5" /> Voice Note
              </button>
            </div>
          </div>

          {/* Why Feedback matters details */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
              <Award className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-bold">Your Feedback Matters</h4>
                <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5">We use this to improve meals, cleaning & waiter support.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
              <Lock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-bold">100% Secure & Genuine</h4>
                <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5">Ratings are encrypted and private. We value your feedback.</p>
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="space-y-4">
            {isSubmitted && (
              <div className="p-3 bg-green-500/10 text-green-500 rounded-xl text-center text-xs font-bold border border-green-500/20">
                ❤️ Thank you! Feedback submitted.
              </div>
            )}
            <button 
              onClick={handleSubmit}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 transition-colors"
            >
              <Heart className="w-3.5 h-3.5 fill-current" /> Submit Feedback
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
