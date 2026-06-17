import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface Offer {
  id: number;
  discount: string;
  code: string;
  minOrder: number;
  image: string;
  gradientFrom: string;
  gradientTo: string;
}

const offers: Offer[] = [
  {
    id: 1,
    discount: 'FLAT 20% OFF',
    code: 'SAV22',
    minOrder: 199,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400&auto=format&fit=crop',
    gradientFrom: '#5c0a0a',
    gradientTo: '#2a0505',
  },
  {
    id: 2,
    discount: 'FLAT 20% OFF',
    code: 'SAV22',
    minOrder: 199,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop',
    gradientFrom: '#7c3800',
    gradientTo: '#2a1200',
  },
  {
    id: 3,
    discount: 'FLAT 20% OFF',
    code: 'SAV22',
    minOrder: 199,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop',
    gradientFrom: '#3b1a5c',
    gradientTo: '#1a0a2a',
  },
];

function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border transition-all ${
        copied
          ? 'bg-green-500/20 border-green-500/50 text-green-400'
          : 'bg-white/10 border-white/25 text-white hover:bg-white/20'
      }`}
      title={copied ? 'Copied!' : 'Copy code'}
    >
      {copied ? (
        <>
          <Check className="w-3 h-3" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          Code: {code}
        </>
      )}
    </button>
  );
}

export default function OffersDeals() {
  return (
    <section className="py-10">
      <h2
        className="text-xl sm:text-2xl font-bold text-white text-center mb-6"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        Offers &amp; Deals
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="relative rounded-2xl overflow-hidden flex items-center justify-between p-4 sm:p-5 gap-3 sm:gap-4 border border-white/10 hover:border-amber-500/30 transition-all cursor-pointer group"
            style={{
              background: `linear-gradient(135deg, ${offer.gradientFrom}, ${offer.gradientTo})`,
            }}
          >
            {/* Left */}
            <div className="flex flex-col gap-1.5 min-w-0">
              <p className="text-white text-lg sm:text-xl font-black leading-tight">{offer.discount}</p>
              <p className="text-white/55 text-[10px] sm:text-xs">
                On Min Order <span className="text-white font-semibold">₹{offer.minOrder}</span>
              </p>
              <CopyCodeButton code={offer.code} />
            </div>

            {/* Right: image */}
            <img
              src={offer.image}
              alt="offer"
              className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
