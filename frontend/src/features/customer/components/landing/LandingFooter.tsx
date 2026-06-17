import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const quickLinks = ['Home', 'Restaurants', 'Reservations', 'How it Works', 'Related Solutions', 'Offers', 'My Orders'];
const supportLinks = ['Help Center', 'Contact Us', 'FAQ', 'Privacy Policy', 'Terms & Conditions', 'Refund Policy'];
const restaurantLinks = ['Partner With Us', 'Restaurant Login', 'Related Solutions', 'Pricing', 'Resources'];

export default function LandingFooter() {
  return (
    <footer className="bg-[#0e0700]/95 border-t border-amber-900/25 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">

        {/* Grid — 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand — full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-0.5 mb-3">
              <span className="text-amber-400 font-bold text-xl" style={{ fontFamily: "'Instrument Serif', serif" }}>
                Serve
              </span>
              <span className="text-white font-bold text-xl" style={{ fontFamily: "'Instrument Serif', serif" }}>
                Sphere
              </span>
            </div>
            <p className="text-stone-500 text-xs leading-relaxed max-w-xs">
              Explore top restaurants around you, enjoy real-time availability, and experience modern dining without the hassle.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l}>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="text-stone-500 hover:text-amber-400 text-xs transition-colors text-left bg-transparent border-none p-0 cursor-pointer"
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((l) => (
                <li key={l}>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="text-stone-500 hover:text-amber-400 text-xs transition-colors text-left bg-transparent border-none p-0 cursor-pointer"
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* For Restaurants */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">For Restaurants</h4>
            <ul className="space-y-2">
              {restaurantLinks.map((l) => (
                <li key={l}>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="text-stone-500 hover:text-amber-400 text-xs transition-colors text-left bg-transparent border-none p-0 cursor-pointer"
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-amber-900/25 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-stone-600 text-xs">
            © 2025 ServeSphere. All rights reserved.
          </p>
          <div className="flex items-center gap-2.5">
            {[
              { Icon: Facebook, url: 'https://facebook.com' },
              { Icon: Instagram, url: 'https://instagram.com' },
              { Icon: Twitter, url: 'https://twitter.com' },
              { Icon: Linkedin, url: 'https://linkedin.com' },
            ].map(({ Icon, url }, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2a1800] hover:bg-amber-500 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-all border border-amber-900/30 hover:border-amber-500"
              >
                <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
