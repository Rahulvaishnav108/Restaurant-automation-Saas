import React from 'react';
import { MessageCircle } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    date: 'Sept. 05, 2025',
    title: 'Taste the delicious foods in Asia',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop',
    comments: 3,
  },
  {
    id: 2,
    date: 'Sept. 05, 2025',
    title: 'Taste the delicious foods in Asia',
    image: 'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?q=80&w=600&auto=format&fit=crop',
    comments: 3,
  },
  {
    id: 3,
    date: 'Sept. 05, 2025',
    title: 'Taste the delicious foods in Asia',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop',
    comments: 3,
  },
];

export default function BlogSection() {
  return (
    <section className="py-10">
      <h2
        className="text-xl sm:text-2xl font-bold text-white text-center mb-6"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        Blog
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="rounded-2xl overflow-hidden bg-[#2a1800]/60 border border-[#FF9F00]/30 hover:border-[#FF9F00]/40 transition-all group cursor-pointer"
          >
            <div className="h-40 sm:h-44 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <p className="text-stone-500 text-xs mb-2">{post.date}</p>
              <h3 className="text-white font-semibold text-sm mb-3 leading-snug">{post.title}</h3>
              <div className="flex items-center justify-between">
                <button className="text-[#FF9F00] text-xs font-semibold hover:text-[#FF9F00]/80 transition-colors">
                  Read more
                </button>
                <div className="flex items-center gap-1 text-stone-500 text-xs">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {post.comments}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
