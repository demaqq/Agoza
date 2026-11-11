import React from 'react';
import { Collectible } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import { Bookmark, MapPin, ArrowRight } from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';
import { MarketInsightBadge } from './MarketInsightBadge';
import agozaLogoImg from '../assets/images/agoza_logo.svg';

interface CollectibleCardProps {
  collectible: Collectible;
}

export const CollectibleCard: React.FC<CollectibleCardProps> = ({ collectible }) => {
  const {
    formatPrice,
    setSelectedCollectible,
    watchlist,
    toggleWatchlist,
    t,
  } = useMarketplace();

  const isSaved = watchlist.includes(collectible.id);

  const handleCardClick = () => {
    setSelectedCollectible(collectible);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white dark:bg-[#181a24] border border-neutral-200/80 dark:border-[#2a2e42] hover:border-neutral-900 dark:hover:border-white rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
    >
      {/* Nike Visual Slot - Neutral Image Canvas with Subtle Hover Zoom */}
      <div
        onClick={() => setSelectedCollectible(collectible)}
        className="relative aspect-[4/3] bg-[#f6f6f6] dark:bg-[#11131c] overflow-hidden cursor-pointer"
        title="Click to view image and listing details"
      >
        <img
          src={collectible.imageUrl}
          alt={collectible.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
            if (target.nextElementSibling) {
              (target.nextElementSibling as HTMLElement).style.display = 'flex';
            }
          }}
        />

        {/* Fallback Container */}
        <div
          style={{ display: 'none' }}
          className="w-full h-full flex flex-col items-center justify-center bg-neutral-200 dark:bg-[#1a1d29] p-6 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-neutral-900/10 dark:bg-white/10 flex items-center justify-center text-neutral-900 dark:text-white mb-2 font-bold text-lg">
            AG
          </div>
          <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium max-w-[180px] line-clamp-2">
            {collectible.title}
          </span>
        </div>

        {/* SINGLE CLEAN Image Footer: "Agoza Marketplace" Brand + City / Location */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-4 pb-2 px-2.5 flex items-center justify-between text-white pointer-events-none select-none z-10">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 border border-white/50 bg-amber-50">
              <img src={agozaLogoImg} alt="Agoza" className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] font-bold tracking-wider text-white">
              Agoza Marketplace
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-neutral-200 font-medium">
            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate max-w-[110px]">
              {collectible.seller.city || collectible.seller.location.split(',')[0]}
            </span>
          </div>
        </div>

        {/* Top Right Save / Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWatchlist(collectible.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center z-10 ${
            isSaved
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
              : 'bg-white/90 dark:bg-black/75 text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white shadow-xs'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save ad'}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content Body: Nike Typographic Hierarchy */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Clean Unboxed Metadata: Category · City · Condition */}
          <div className="flex items-center gap-1 text-[11px] font-bold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase mb-1">
            <span>{collectible.category.replace('-', ' ')}</span>
            <span aria-hidden="true">·</span>
            <span>{collectible.seller.city || collectible.seller.location.split(',')[0]}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">{collectible.condition}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm text-neutral-900 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors line-clamp-2 leading-snug mb-2">
            {collectible.title}
          </h3>

          {/* Seller Reputation */}
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-3">
            <span className="font-medium truncate max-w-[120px]">{collectible.seller.name}</span>
            <span className="font-mono text-[11px] text-amber-600 dark:text-amber-400 font-bold">
              ★ {collectible.seller.rating} ({collectible.seller.totalTrades})
            </span>
          </div>
        </div>

        {/* Pricing & Buy CTA */}
        <div className="pt-2 border-t border-neutral-100 dark:border-[#25293c] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
              {t.listingPrice}
            </span>
            <span className="font-mono text-base lg:text-lg font-black text-neutral-900 dark:text-white tabular-nums">
              {formatPrice(collectible.priceETB)}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCollectible(collectible);
            }}
            className="py-2 px-4 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-extrabold tracking-wider uppercase rounded-full transition-all cursor-pointer whitespace-nowrap min-h-[38px] flex items-center gap-1.5 shadow-xs active:scale-95"
          >
            <span>Buy</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
