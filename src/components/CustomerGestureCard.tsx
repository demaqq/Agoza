import React, { useState } from 'react';
import { Collectible } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import { useTouchGestures } from '../hooks/useTouchGestures';
import { Bookmark, MapPin, ArrowLeftRight, Eye, Check, Heart } from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';
import agozaLogoImg from '../assets/images/agoza_logo.svg';

interface CustomerGestureCardProps {
  collectible: Collectible;
  onQuickInspect: (collectible: Collectible) => void;
  onDismissItem?: (id: string) => void;
}

export const CustomerGestureCard: React.FC<CustomerGestureCardProps> = ({
  collectible,
  onQuickInspect,
  onDismissItem,
}) => {
  const {
    formatPrice,
    setSelectedCollectible,
    watchlist,
    toggleWatchlist,
    setIsOfferModalOpen,
    t,
  } = useMarketplace();

  const isSaved = watchlist.includes(collectible.id);
  const [swipeFeedback, setSwipeFeedback] = useState<string | null>(null);

  const handleSaveGesture = () => {
    toggleWatchlist(collectible.id);
    setSwipeFeedback(isSaved ? 'Removed from Saved' : 'Saved to Watchlist! (ተቀምጧል)');
    setTimeout(() => setSwipeFeedback(null), 1800);
  };

  const handleLongPress = () => {
    onQuickInspect(collectible);
  };

  const handleCardClick = (e?: React.MouseEvent) => {
    // Open product details modal when clicking on any post card
    setSelectedCollectible(collectible);
  };

  const { gestureState, bind } = useTouchGestures({
    threshold: 75,
    longPressDelay: 420,
    onSwipeRight: handleSaveGesture,
    onLongPress: handleLongPress,
    onTap: handleCardClick,
    enableMouseDrag: true,
  });

  // Calculate transform for tactile drag feedback (horizontal only for right swipe)
  const translateX = gestureState.isDragging ? Math.max(0, Math.min(100, gestureState.deltaX)) : 0;
  const rotateDeg = gestureState.isDragging ? (translateX / 100) * 3 : 0;

  return (
    <div className="relative group select-none">
      {/* Background Gesture Action Reveal Underlays */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-0">
        {/* Right Swipe: Save (Emerald) */}
        <div
          className={`absolute inset-y-0 left-0 w-1/2 bg-emerald-600/90 text-white flex items-center justify-start pl-6 gap-2 font-bold text-xs transition-opacity ${
            gestureState.direction === 'right' && gestureState.deltaX > 20 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Heart className="w-5 h-5 fill-current" />
          <span>Save (አስቀምጥ)</span>
        </div>
      </div>

      {/* Main Touch-Responsive Card Body */}
      <div
        {...bind}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${collectible.title}`}
        className="relative z-10 bg-white dark:bg-[#251810] border border-slate-200 dark:border-[#473020] hover:border-[#1b5e20] dark:hover:border-[#d4a373] rounded-2xl overflow-hidden flex flex-col transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1b5e20] dark:focus:ring-[#d4a373]"
        style={{
          transform: gestureState.isDragging
            ? `translate3d(${translateX}px, 0, 0) rotate(${rotateDeg}deg)`
            : 'translate3d(0, 0, 0)',
          transition: gestureState.isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        {/* Swipe Feedback Banner if triggered */}
        {swipeFeedback && (
          <div className="absolute top-2 inset-x-2 z-30 bg-[#1b5e20] dark:bg-[#d4a373] text-white dark:text-[#1e130c] text-xs font-bold py-1.5 px-3 rounded-xl shadow-lg flex items-center justify-center gap-1.5 animate-in fade-in slide-in-from-top-2">
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>{swipeFeedback}</span>
          </div>
        )}

        {/* Visual Slot - Clean Image with Logo Footer */}
        <div className="relative aspect-4/3 bg-slate-100 dark:bg-[#1a1009] overflow-hidden">
          <img
            src={collectible.imageUrl}
            alt={collectible.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-300 pointer-events-none"
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
            className="w-full h-full flex flex-col items-center justify-center bg-slate-200 dark:bg-[#1a1d29] p-6 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-[#1b5e20]/15 dark:bg-[#c5a059]/15 flex items-center justify-center text-[#1b5e20] dark:text-[#c5a059] mb-2 font-cinzel font-bold text-lg">
              AG
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium max-w-[180px] line-clamp-2">
              {collectible.title}
            </span>
          </div>

          {/* SINGLE CLEAN Image Footer: "Agoza Marketplace" Brand + City / Location */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent pt-4 pb-2 px-2.5 flex items-center justify-between text-white pointer-events-none select-none z-10">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 border border-amber-400 bg-amber-50">
                <img src={agozaLogoImg} alt="Agoza" className="w-full h-full object-cover" />
              </div>
              <span className="font-cinzel text-[10px] font-bold tracking-wider text-white drop-shadow-sm">
                Agoza Marketplace
              </span>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-amber-300 font-medium">
              <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate max-w-[110px] text-slate-200">
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
            className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center z-20 ${
              isSaved
                ? 'bg-[#1b5e20] text-white dark:bg-[#d4a373] dark:text-[#1e130c]'
                : 'bg-white/85 dark:bg-[#0c0d11]/75 text-slate-700 dark:text-[#9ca3af] hover:text-slate-900 dark:hover:text-white shadow-xs'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save ad (or swipe right)'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          {/* Quick Inspection Lens Shortcut Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickInspect(collectible);
            }}
            className="absolute bottom-9 right-2.5 p-2 rounded-xl bg-black/70 hover:bg-black/90 text-amber-300 backdrop-blur-md border border-amber-400/40 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center z-20 shadow-xs"
            title="Inspect preview (or long-press)"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Top Left Badges: Brand/Condition & Swaps */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5 max-w-[80%] z-10">
            {collectible.brand && (
              <div className="px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-wide bg-black/75 backdrop-blur-md text-white border border-white/20 shadow-xs">
                {collectible.brand}
              </div>
            )}
            {collectible.openToTrade && (
              <div className="bg-white/95 dark:bg-[#1a110a]/90 backdrop-blur-xs px-2 py-0.5 rounded-lg text-[10px] font-bold text-emerald-800 dark:text-[#d4a373] flex items-center gap-1 border border-emerald-300 dark:border-[#4d3221] shadow-xs">
                <ArrowLeftRight className="w-2.5 h-2.5" />
                <span>{t.openToSwaps}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Metadata Row: Category + Subcategory + Condition */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="font-bold uppercase tracking-wider text-[10px] text-[#1b5e20] dark:text-[#d4a373]">
                {collectible.category.replace('-', ' ')}
              </span>
              {collectible.subcategory && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 capitalize">
                    {collectible.subcategory.replace('-', ' ')}
                  </span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span className="text-[10px]">{collectible.condition}</span>
            </div>

            {/* Title with Verified Badge */}
            <div className="flex items-start justify-between gap-1 mb-1.5">
              <h3 className="font-bold text-sm text-slate-900 dark:text-[#f1f2f6] group-hover:text-[#1b5e20] dark:group-hover:text-[#d4a373] transition-colors line-clamp-2 leading-snug">
                {collectible.title}
              </h3>
            </div>

            {/* Verified Listing Status */}
            <div className="mb-2">
              <VerifiedBadge variant="listing" size="xs" label="Verified Authenticated" />
            </div>

            {/* Short Excerpt */}
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
              {collectible.description}
            </p>
          </div>

          {/* Pricing & Verified Seller Details */}
          <div className="pt-3 border-t border-slate-100 dark:border-[#3d2719] mt-2">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-[#a8907f] block">
                  {t.listingPrice}
                </span>
                <span className="font-mono text-base sm:text-lg font-bold text-[#1b5e20] dark:text-[#d4a373] tabular-nums">
                  {formatPrice(collectible.priceETB)}
                </span>
              </div>

              {/* Seller Reputation with Verified Seller Badge */}
              <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-[11px] text-slate-700 dark:text-[#cbd0dc]">
                  <span className="font-medium">{collectible.seller.name}</span>
                  <VerifiedBadge variant="seller" size="xs" label="Verified" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  ★ {collectible.seller.rating} ({collectible.seller.totalTrades} deals)
                </span>
              </div>
            </div>

            {/* Action Row (Accessible touch targets >= 44px) */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCollectible(collectible);
                  setIsOfferModalOpen(true);
                }}
                className="py-2.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-[#1a110a] dark:hover:bg-[#251810] text-slate-800 dark:text-[#e3e6ee] text-xs font-semibold rounded-xl border border-slate-200 dark:border-[#422919] transition-colors cursor-pointer text-center whitespace-nowrap min-h-[44px]"
              >
                {t.makeOffer}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCollectible(collectible);
                }}
                className="py-2.5 px-2 bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#d4a373] dark:hover:bg-[#e0b487] text-white dark:text-[#1e130c] text-xs font-bold rounded-xl transition-colors cursor-pointer text-center whitespace-nowrap min-h-[44px]"
              >
                {t.viewAndBuy}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
