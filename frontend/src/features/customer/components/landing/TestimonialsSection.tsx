import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Burger Kings',
    role: 'Customer',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Burger Kings',
    role: 'Customer',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    text: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Burger Kings',
    role: 'Customer',
    avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
    text: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-10">
      <h2
        className="text-xl sm:text-2xl font-bold text-white text-center mb-6"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        What customers says?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="p-5 sm:p-6 rounded-2xl bg-[#2a1800]/60 border border-amber-900/30 text-center"
          >
            {/* Avatar */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-full h-full rounded-full object-cover border-2 border-amber-500/40"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                <Star className="w-2.5 h-2.5 fill-stone-900 text-stone-900" />
              </span>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-0.5 mb-3">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mb-4">
              "{t.text}"
            </p>
            <p className="text-amber-400 font-semibold text-sm">{t.name}</p>
            <p className="text-stone-600 text-[10px] uppercase tracking-widest mt-0.5">{t.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
