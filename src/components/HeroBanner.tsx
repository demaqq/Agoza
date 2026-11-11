import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ArrowRight, Plus } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setIsListModalOpen } = useMarketplace();

  const scrollToFeed = () => {
    const el = document.getElementById('marketplace-feed-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-neutral-900 text-white transition-colors">
      {/* Background Graphic / Campaign Background with Dark Scrim Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/src/assets/images/hero_p2p_marketplace_1793404546125.jpg"
          alt="Ethiopia P2P Marketplace"
          className="w-full h-full object-cover object-center filter contrast-125 brightness-75 scale-102"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12 sm:py-18 lg:py-24">
        <div className="max-w-3xl">
          {/* Nike Spot Kicker Tag */}
          <div className="flex items-center gap-2 text-xs font-black tracking-widest uppercase mb-3 text-neutral-300">
            <span className="bg-white text-black px-2 py-0.5 font-extrabold rounded-xs text-[10px]">VERIFIED DROP</span>
            <span>CBE SAFE HUB IN-PERSON EXCHANGE</span>
          </div>

          {/* Oversized Nike-Style Campaign Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter uppercase text-white leading-none text-balance mb-4">
            JUST DROPPED IN ADDIS.
          </h1>

          <p className="text-sm sm:text-lg text-neutral-300 font-medium leading-relaxed max-w-2xl mb-8">
            Explore authentic phones, vehicles, fashion, coffee, and electronics. Direct peer-to-peer trading protected by CBE Safe Hubs and Telebirr escrow across all Ethiopian regions.
          </p>

          {/* Twin Action CTA Buttons (Nike-Style Pill Buttons) */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={scrollToFeed}
              className="py-3 px-8 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs tracking-wider uppercase rounded-full shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-2 min-h-[44px]"
            >
              <span>Shop Latest Listings</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onClick={() => setIsListModalOpen(true)}
              className="py-3 px-8 bg-transparent hover:bg-white/10 text-white border-2 border-white font-extrabold text-xs tracking-wider uppercase rounded-full shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-2 min-h-[44px]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Post P2P Listing</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
