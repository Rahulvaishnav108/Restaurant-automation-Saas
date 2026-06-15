import React, { useState } from 'react';

const EMOJIS = [
  { id: 'bad', emoji: '😠', label: 'Very Bad' },
  { id: 'okay', emoji: '😐', label: 'Okay' },
  { id: 'good', emoji: '😊', label: 'Good' },
  { id: 'excellent', emoji: '🤩', label: 'Amazing!' },
];

const CATEGORIES = [
  { icon: 'restaurant', label: 'Food Quality', color: 'bg-green-100 text-green-600' },
  { icon: 'restaurant_menu', label: 'Taste', color: 'bg-orange-100 text-orange-600' },
  { icon: 'delivery_dining', label: 'Service Speed', color: 'bg-purple-100 text-purple-600' },
  { icon: 'inventory_2', label: 'Ambience', color: 'bg-blue-100 text-blue-600' },
];

export default function CustomerFeedbackPage() {
  const [selected, setSelected] = useState('excellent');
  const [ratings, setRatings] = useState<Record<string, number>>({
    'Food Quality': 5,
    Taste: 5,
    'Service Speed': 4,
    Ambience: 5,
  });
  const [feedback, setFeedback] = useState('');

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto h-full sd-custom-scrollbar">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-sd-on-surface font-sans">Rate Your Experience</h2>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm text-sd-on-surface-variant font-sans">Order #ORD-12456</p>
          <span className="bg-sd-secondary-container text-sd-on-secondary-container text-[10px] font-bold px-2 py-0.5 rounded-full font-sans">Served</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-sd-surface-variant sd-food-card-shadow flex flex-col sm:flex-row gap-5">
          <div className="w-full sm:w-1/3 h-40 rounded-xl bg-gradient-to-br from-sd-primary-fixed via-sd-primary-fixed-dim to-sd-primary-container/20 flex items-center justify-center shrink-0 overflow-hidden">
            <span className="material-symbols-outlined text-6xl text-sd-primary/30">lunch_dining</span>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-[10px] uppercase tracking-wider text-sd-on-surface-variant font-semibold mb-1 font-sans">Served on</p>
            <p className="text-base font-bold font-sans mb-3">24 May, 08:15 PM</p>
            <div className="p-3.5 bg-sd-surface-container-low rounded-xl">
              <p className="text-sm text-sd-on-surface-variant font-sans">Thank you for dining with us! We hope you enjoyed your meal and look forward to serving you again soon.</p>
            </div>
          </div>
        </div>

        {/* Emoji Rating */}
        <div className="bg-white rounded-2xl p-5 border border-sd-surface-variant sd-food-card-shadow flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-semibold text-sd-on-surface-variant mb-5 font-sans">How was your overall experience?</h3>
          <div className="flex justify-between w-full max-w-xs mb-5">
            {EMOJIS.map(({ id, emoji, label }) => {
              const isSelected = selected === id;
              return (
                <button
                  key={id}
                  onClick={() => setSelected(id)}
                  className={`flex flex-col items-center gap-1 group transition-all hover:scale-110 ${isSelected ? 'scale-110' : ''}`}
                >
                  <div className="relative">
                    <span className="text-3xl">{emoji}</span>
                    {isSelected && <div className="absolute -inset-1 bg-sd-primary-container/20 rounded-full -z-10 blur-sm" />}
                  </div>
                  <span className={`text-[11px] font-semibold font-sans ${isSelected ? 'text-sd-primary' : 'text-sd-on-surface-variant'}`}>{label}</span>
                </button>
              );
            })}
          </div>
          {selected && (
            <div className="w-full py-2 bg-sd-secondary-container/10 border border-sd-secondary-container/20 rounded-lg">
              <p className="text-sd-on-secondary-container font-bold text-sm font-sans">
                {EMOJIS.find((e) => e.id === selected)?.label} {selected === 'excellent' ? '😍' : ''}
              </p>
            </div>
          )}
        </div>

        {/* Category Ratings */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-sd-on-surface font-sans">Rate the following</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATEGORIES.map(({ icon, label, color }) => (
              <div
                key={label}
                className="bg-white p-4 rounded-xl border border-sd-surface-variant flex items-center gap-3 hover:border-sd-primary/30 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center shrink-0`}>
                  <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold font-sans">{label}</p>
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setRatings((prev) => ({ ...prev, [label]: star }))}>
                        <span
                          className={`material-symbols-outlined text-[20px] ${star <= (ratings[label] || 0) ? 'text-sd-primary' : 'text-sd-surface-container-high'}`}
                          style={{ fontVariationSettings: star <= (ratings[label] || 0) ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          star
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Text */}
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-bold text-sd-on-surface font-sans">Tell us more</h3>
          <div className="flex-1 bg-white rounded-xl border border-sd-surface-variant p-4 sd-food-card-shadow">
            <textarea
              className="w-full bg-transparent border-none focus:ring-0 text-sm font-sans text-sd-on-surface resize-none p-0 focus:outline-none"
              placeholder="Share your thoughts about your experience..."
              rows={5}
              maxLength={300}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <p className="text-right text-[11px] text-sd-on-surface-variant mt-2 font-sans">{feedback.length}/300</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-3 bg-white border border-sd-surface-variant rounded-xl text-sm font-bold hover:bg-sd-surface-container-low transition-colors font-sans">
              <span className="material-symbols-outlined text-sd-primary text-[18px]">add_a_photo</span>
              Add Photos
            </button>
            <button className="flex items-center justify-center gap-2 py-3 bg-white border border-sd-surface-variant rounded-xl text-sm font-bold hover:bg-sd-surface-container-low transition-colors font-sans">
              <span className="material-symbols-outlined text-sd-tertiary text-[18px]">support_agent</span>
              Write to Support
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="lg:col-span-3 mt-2">
          <button className="w-full max-w-md mx-auto block py-4 bg-sd-primary-container text-white rounded-2xl font-bold text-base shadow-xl hover:scale-[1.02] active:scale-95 transition-all font-sans flex items-center justify-center gap-3">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            Submit Feedback
          </button>
          <p className="text-center text-xs text-sd-on-surface-variant mt-3 font-sans">Thank you! Your feedback helps us improve.</p>
        </div>
      </div>
    </div>
  );
}
