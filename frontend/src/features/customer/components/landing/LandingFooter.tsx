import React, { useState } from "react";
import { Twitter, Instagram, Youtube, Facebook, Linkedin } from "lucide-react";

export default function LandingFooter(): JSX.Element {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#111827] text-white pt-16 pb-8" data-purpose="main-footer">
      <div className="container mx-auto px-4">
        {/* Top footer columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Description */}
          <div>
            <div className="flex items-center gap-2 mb-6" data-purpose="footer-logo">
              <div className="bg-[#FF5722] p-1.5 rounded-lg flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                Resto<span className="text-[#FF5722]">Hub</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Your go-to platform to discover, reserve and enjoy the best restaurants near you.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FF5722] transition-colors text-gray-300 hover:text-white"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FF5722] transition-colors text-gray-300 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FF5722] transition-colors text-gray-300 hover:text-white"
                aria-label="Youtube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FF5722] transition-colors text-gray-300 hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FF5722] transition-colors text-gray-300 hover:text-white"
                aria-label="Linkedin"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-6 text-base tracking-wider uppercase text-gray-200">Quick Links</h4>
            <ul className="space-y-3.5 text-gray-400 text-sm font-semibold">
              <li>
                <a className="hover:text-[#FF5722] transition-colors" href="#">
                  Home
                </a>
              </li>
              <li>
                <a className="hover:text-[#FF5722] transition-colors" href="#restaurants">
                  Restaurants
                </a>
              </li>
              <li>
                <a className="hover:text-[#FF5722] transition-colors" href="#dishes">
                  Dishes
                </a>
              </li>
              <li>
                <a className="hover:text-[#FF5722] transition-colors" href="#offers">
                  Offers
                </a>
              </li>
            </ul>
          </div>

          {/* For Restaurants */}
          <div>
            <h4 className="font-bold mb-6 text-base tracking-wider uppercase text-gray-200">For Restaurants</h4>
            <ul className="space-y-3.5 text-gray-400 text-sm font-semibold">
              <li>
                <a className="hover:text-[#FF5722] transition-colors" href="#">
                  Add Restaurant
                </a>
              </li>
              <li>
                <a className="hover:text-[#FF5722] transition-colors" href="#">
                  Partner With Us
                </a>
              </li>
              <li>
                <a className="hover:text-[#FF5722] transition-colors" href="#">
                  Business Login
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div>
            <h4 className="font-bold mb-6 text-base tracking-wider uppercase text-gray-200">Subscribe</h4>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest updates and offers straight to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
              <input
                className="bg-transparent border-none focus:ring-0 text-sm flex-1 px-3 py-2 outline-none text-white placeholder:text-gray-500"
                placeholder="Enter your email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="bg-[#FF5722] hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 active:scale-95"
              >
                {subscribed ? "Subscribed!" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom footer copyright */}
        <div className="pt-8 border-t border-white/10 text-center text-gray-500 text-xs font-semibold">
          <p>© 2026 RestoHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
