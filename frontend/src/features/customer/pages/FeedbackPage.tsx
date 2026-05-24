import React, { useState } from 'react';
import { ChevronLeft, MessageSquareText, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const recentReviews = [
    { name: 'Aarav', rating: 5, text: 'Fast table service and the biryani arrived hot.' },
    { name: 'Meera', rating: 4, text: 'Loved the QR ordering flow. Dessert could be quicker.' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0d17] text-white max-w-md mx-auto">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0d17]/95 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="rounded-full p-1.5 transition hover:bg-white/10"><ChevronLeft className="h-5 w-5" /></button>
          <div>
            <p className="text-sm font-semibold">Feedback</p>
            <p className="text-xs text-slate-400">Rate your dining experience</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-5">
        <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }} className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h1 className="text-2xl font-bold">How was your meal?</h1>
          <p className="mt-2 text-sm text-slate-400">Your feedback helps the restaurant improve service and food quality.</p>

          <div className="my-6 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button key={value} type="button" onClick={() => setRating(value)} className="rounded-full p-1">
                <Star className={`h-8 w-8 ${value <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
              </button>
            ))}
          </div>

          <textarea value={review} onChange={(event) => setReview(event.target.value)} required minLength={5} rows={5} placeholder="Tell us what went well or what can be better..." className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder-slate-500 focus:border-orange-500" />
          <button className="mt-4 w-full rounded-2xl bg-orange-500 py-3 font-bold transition hover:bg-orange-600">Submit Feedback</button>
          {submitted && <p className="mt-4 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">Thanks. Your feedback has been submitted.</p>}
        </form>

        <section className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquareText className="h-4 w-4 text-orange-400" />
            <h2 className="text-base font-bold">Recent reviews</h2>
          </div>
          <div className="space-y-3">
            {[...(submitted ? [{ name: 'You', rating, text: review }] : []), ...recentReviews].map((item, index) => (
              <div key={`${item.name}-${index}`} className="rounded-2xl border border-white/10 bg-black/10 p-3">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star key={value} className={`h-3 w-3 ${value <= item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-400">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default FeedbackPage;
