import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CustomerGestureCard } from './CustomerGestureCard';
import { PullToRefreshContainer } from './PullToRefreshContainer';
import { QuickInspectionModal } from './QuickInspectionModal';
import { HandshakeDealModal } from './HandshakeDealModal';
import { BunaBlessingToken } from './BunaBlessingToken';
import { CoffeeBeansIcon, JebenaIcon } from './EthiopianIcons';
import { HeroBanner } from './HeroBanner';
import { FilterBar } from './FilterBar';
import { CustomerWiseBar } from './CustomerWiseBar';
import {
  RotateCcw,
  X,
  MapPin,
  CheckCircle2,
  Grid3X3,
  Layers,
  Sparkles,
  Search,
} from 'lucide-react';
import {
  Collectible,
  CustomerDealAgreement,
} from '../types';

export const MarketplaceFeed: React.FC = () => {
  const {
    collectibles,
    filters,
    setFilters,
    resetFilters,
    setSelectedCollectible,
    t,
  } = useMarketplace();

  // Layout View Mode (Grid vs Compact)
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  // Customer Mobile Gestures & Deal State
  const [inspectingItem, setInspectingItem] = useState<Collectible | null>(null);
  const [activeDealAgreement, setActiveDealAgreement] = useState<CustomerDealAgreement | null>(null);
  const [isBunaBlessingOpen, setIsBunaBlessingOpen] = useState<boolean>(false);
  const [blessingTarget, setBlessingTarget] = useState<{ sellerName: string; itemTitle: string } | null>(null);
  const [dismissedItemIds, setDismissedItemIds] = useState<string[]>([]);
  const [gestureNotice, setGestureNotice] = useState<string | null>(null);

  const handleRefresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    setGestureNotice('Feed refreshed with fresh Ethiopian verified listings!');
    setTimeout(() => setGestureNotice(null), 3000);
  };

  const handleDismissItem = (id: string) => {
    setDismissedItemIds((prev) => [...prev, id]);
    setGestureNotice('Item passed and hidden from your feed.');
    setTimeout(() => setGestureNotice(null), 2500);
  };

  const handleTriggerSampleHandshake = () => {
    const sample = collectibles[0];
    if (sample) {
      setActiveDealAgreement({
        id: `deal-${Date.now()}`,
        collectibleId: sample.id,
        collectibleTitle: sample.title,
        collectibleImage: sample.imageUrl,
        sellerName: sample.seller.name,
        buyerName: 'You (Verified Buyer)',
        agreedPriceETB: Math.round(sample.priceETB * 0.92),
        originalPriceETB: sample.priceETB,
        safeHub: 'CBE HQ Vault & Trust Station (Addis Ababa)',
        contractHash: `AGZ-${Math.random().toString(36).substring(2, 8).toUpperCase()}-ETH`,
        timestamp: 'Just now',
        status: 'sealed',
      });
    }
  };

  // Instant filtering driven directly by MarketplaceContext's global filters
  const filteredCollectibles = useMemo(() => {
    return collectibles.filter((item) => {
      // Exclude passed/dismissed items
      if (dismissedItemIds.includes(item.id)) {
        return false;
      }

      // 1. Category Filter
      if (filters.category && filters.category !== 'all' && item.category !== filters.category) {
        return false;
      }

      // 1b. Subcategory Filter
      if (filters.subcategory && filters.subcategory !== 'all' && item.subcategory && item.subcategory !== filters.subcategory) {
        return false;
      }

      // 2. Physical Condition Filter
      if (filters.condition && filters.condition !== 'all' && item.condition !== filters.condition) {
        return false;
      }

      // 3. Location / Ethiopian City Filter
      if (filters.city && filters.city !== 'all' && filters.city !== 'All Ethiopia') {
        const cityLower = filters.city.toLowerCase();
        const matchesCity =
          (item.seller.city && item.seller.city.toLowerCase().includes(cityLower)) ||
          item.origin.toLowerCase().includes(cityLower) ||
          item.seller.location.toLowerCase().includes(cityLower);
        if (!matchesCity) return false;
      }

      // 4. Location Quick Filter from Hero
      if (filters.location && filters.location !== 'all') {
        const cleanLoc = filters.location.replace('Addis Ababa, ', '').toLowerCase();
        const matchesLoc = item.seller.location.toLowerCase().includes(cleanLoc) || item.origin.toLowerCase().includes(cleanLoc);
        if (!matchesLoc) return false;
      }

      // 5. Open To Trade / Barter Filter
      if (filters.openToTradeOnly && !item.openToTrade) {
        return false;
      }

      // 6. Max Budget Filter
      if (filters.maxPrice && filters.maxPrice > 0 && item.priceETB > filters.maxPrice) {
        return false;
      }

      // 7. Instant Search Query Filter
      if (filters.searchQuery?.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const searchTarget = (
          item.title +
          ' ' +
          item.description +
          ' ' +
          (item.brand || '') +
          ' ' +
          (item.model || '') +
          ' ' +
          item.condition +
          ' ' +
          item.origin +
          ' ' +
          item.seller.name +
          ' ' +
          (item.seller.city || '') +
          ' ' +
          (item.seller.location || '')
        ).toLowerCase();

        if (!searchTarget.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [collectibles, filters, dismissedItemIds]);

  // Instant sort
  const sortedCollectibles = useMemo(() => {
    return [...filteredCollectibles].sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.priceETB - b.priceETB;
      if (filters.sortBy === 'price-desc') return b.priceETB - a.priceETB;
      if (filters.sortBy === 'most-popular') return b.likesCount - a.likesCount;
      return 0; // 'latest' maintains default order
    });
  }, [filteredCollectibles, filters.sortBy]);

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    (filters.searchQuery && filters.searchQuery.trim()) ||
    (filters.category && filters.category !== 'all') ||
    (filters.subcategory && filters.subcategory !== 'all') ||
    (filters.city && filters.city !== 'all' && filters.city !== 'All Ethiopia') ||
    (filters.location && filters.location !== 'all') ||
    (filters.condition && filters.condition !== 'all') ||
    filters.openToTradeOnly ||
    (filters.maxPrice && filters.maxPrice > 0)
  );

  return (
    <div className="bg-slate-50 dark:bg-[#1e130c] transition-colors pb-16 lg:pb-0 min-h-screen">
      {/* Campaign Hero Banner */}
      <HeroBanner />

      {/* Customer-Wise Personalization Suite */}
      <CustomerWiseBar />

      {/* Full Sticky Category & Subcategory Filter Bar */}
      <FilterBar />

      {/* Main Items Feed Section */}
      <section id="marketplace-feed-section" className="scroll-mt-20">
        <PullToRefreshContainer onRefresh={handleRefresh}>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 pb-16 sm:pb-20">
            {/* Clean Feed Controls Header */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-[#382214]">
              {/* Item Counter & Live Indicator */}
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#f8edd6]">
                    {sortedCollectibles.length} Verified {sortedCollectibles.length === 1 ? 'Listing' : 'Listings'} Available
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-[#a8907f]">
                    In-person CBE safe hub exchange & escrow protected
                  </p>
                </div>
              </div>

              {/* View Mode & Deal Gestures Trigger */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Buna Blessing Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    const targetItem = sortedCollectibles[0];
                    if (targetItem) {
                      setBlessingTarget({
                        sellerName: targetItem.seller.name,
                        itemTitle: targetItem.title,
                      });
                    }
                    setIsBunaBlessingOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-600/10 hover:bg-amber-600/20 text-amber-900 dark:text-[#d4a373] dark:bg-[#342115] dark:hover:bg-[#452c1d] border border-amber-300 dark:border-[#473020] cursor-pointer flex items-center gap-1.5 transition-colors min-h-[36px]"
                  title="Ethiopian Buna Blessing (የቡና ምርቃት)"
                >
                  <JebenaIcon className="w-3.5 h-3.5 text-amber-700 dark:text-[#d4a373]" />
                  <span>Buna Blessing</span>
                </button>

                {/* Handshake Deal Modal Trigger */}
                <button
                  type="button"
                  onClick={handleTriggerSampleHandshake}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#251810] hover:bg-slate-100 dark:hover:bg-[#342115] text-slate-800 dark:text-[#f3ddc9] border border-slate-200 dark:border-[#473020] cursor-pointer flex items-center gap-1.5 transition-colors min-h-[36px]"
                  title="Preview Ethiopian Handshake Deal (ስምምነት)"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Handshake Deal</span>
                </button>

                {/* Grid / Compact View Switcher */}
                <div className="hidden sm:flex items-center bg-white dark:bg-[#251810] border border-slate-200 dark:border-[#473020] rounded-xl p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-[#1b5e20] text-white dark:bg-[#d4a373] dark:text-[#1e130c]'
                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                    title="Grid View (3-4 columns)"
                  >
                    <Grid3X3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('compact')}
                    className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                      viewMode === 'compact'
                        ? 'bg-[#1b5e20] text-white dark:bg-[#d4a373] dark:text-[#1e130c]'
                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                    title="Compact View"
                  >
                    <Layers className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Badges Strip (Instant 1-Click Clear) */}
            {hasActiveFilters && (
              <div className="mb-4 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-[#a8907f] mr-1">
                  Active Filters:
                </span>

                {filters.searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100/90 text-amber-950 dark:bg-[#342115] dark:text-[#f3ddc9] border border-amber-300 dark:border-[#473020]">
                    <span>Search: "{filters.searchQuery}"</span>
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                      className="p-0.5 hover:text-rose-600 cursor-pointer"
                      title="Remove search filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {filters.category && filters.category !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <span className="capitalize">{filters.category.replace('-', ' ')}</span>
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, category: 'all', subcategory: 'all' }))}
                      className="p-0.5 hover:text-rose-600 cursor-pointer"
                      title="Remove category filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {filters.subcategory && filters.subcategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <span className="capitalize">{filters.subcategory.replace('-', ' ')}</span>
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, subcategory: 'all' }))}
                      className="p-0.5 hover:text-rose-600 cursor-pointer"
                      title="Remove subcategory filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {filters.city && filters.city !== 'all' && filters.city !== 'All Ethiopia' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    <MapPin className="w-3 h-3 text-blue-500" />
                    <span>{filters.city}</span>
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, city: 'all' }))}
                      className="p-0.5 hover:text-rose-600 cursor-pointer"
                      title="Remove city filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {filters.location && filters.location !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    <span>{filters.location}</span>
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, location: 'all' }))}
                      className="p-0.5 hover:text-rose-600 cursor-pointer"
                      title="Remove location filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {filters.condition && filters.condition !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    <span>{filters.condition}</span>
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, condition: 'all' }))}
                      className="p-0.5 hover:text-rose-600 cursor-pointer"
                      title="Remove condition filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {filters.openToTradeOnly && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-900 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    <span>Swaps & Barter Only</span>
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, openToTradeOnly: false }))}
                      className="p-0.5 hover:text-rose-600 cursor-pointer"
                      title="Remove swap filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {filters.maxPrice && filters.maxPrice > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    <span>Under {filters.maxPrice.toLocaleString()} Br</span>
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, maxPrice: 0 }))}
                      className="p-0.5 hover:text-rose-600 cursor-pointer"
                      title="Remove budget filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 ml-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              </div>
            )}

            {/* Gesture Tip Bar */}
            <div className="mb-5 flex items-center justify-between gap-2 p-2.5 px-3.5 rounded-xl bg-amber-100/50 dark:bg-[#251810] border border-amber-200/60 dark:border-[#3d2719] text-xs">
              <div className="flex items-center gap-2">
                <CoffeeBeansIcon className="w-4 h-4 text-amber-700 dark:text-[#d4a373] shrink-0" />
                <span className="text-slate-700 dark:text-[#e4d4c4]">
                  <strong className="text-slate-900 dark:text-[#f8edd6]">Customer Gestures:</strong> Swipe card right to save to Watchlist · Long-press for Quick Inspection
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold hidden sm:inline">
                Instant P2P
              </span>
            </div>

            {/* Gesture Notice Toast */}
            {gestureNotice && (
              <div className="mb-4 p-3 rounded-xl bg-[#1b5e20] dark:bg-[#d4a373] text-white dark:text-[#1e130c] text-xs font-bold flex items-center justify-between shadow-md animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  <span>{gestureNotice}</span>
                </div>
                <button
                  onClick={() => setGestureNotice(null)}
                  className="p-1 hover:opacity-80 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Product Card Grid */}
            {sortedCollectibles.length > 0 ? (
              <div
                className={`grid gap-4 sm:gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {sortedCollectibles.map((item) => (
                  <CustomerGestureCard
                    key={item.id}
                    collectible={item}
                    onQuickInspect={(col) => setInspectingItem(col)}
                    onDismissItem={handleDismissItem}
                  />
                ))}
              </div>
            ) : (
              /* High quality Empty State */
              <div className="py-16 text-center bg-white dark:bg-[#251810] rounded-3xl border border-slate-200 dark:border-[#422919] p-8 max-w-lg mx-auto shadow-sm">
                <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-[#342318] border border-amber-200 dark:border-[#4d3221] flex items-center justify-center mx-auto text-amber-800 dark:text-[#d4a373] mb-4">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-[#fbf5ef] mb-2">
                  No matching items found
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#a8907f] mb-6 leading-relaxed">
                  No verified Ethiopian listings match your active filters or query. Try searching for phones, vehicles, electronics, or coffee.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                  {['Toyota RAV4', 'iPhone 15 Pro', 'MacBook M3', 'Yirgacheffe Coffee'].map((q) => (
                    <button
                      key={q}
                      onClick={() => setFilters((prev) => ({ ...prev, searchQuery: q }))}
                      className="px-3 py-1 text-xs rounded-lg bg-amber-100/70 hover:bg-amber-100 text-amber-900 dark:bg-[#342115] dark:text-[#d4a373] cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#d4a373] dark:hover:bg-[#e0b487] text-white dark:text-[#1e130c] font-bold text-xs rounded-xl shadow cursor-pointer transition-transform active:scale-95"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </PullToRefreshContainer>
      </section>

      {/* Customer Quick Inspection Modal with Pinch-To-Zoom */}
      <QuickInspectionModal
        collectible={inspectingItem}
        isOpen={!!inspectingItem}
        onClose={() => setInspectingItem(null)}
        onOpenFullDetail={(item) => setSelectedCollectible(item)}
      />

      {/* Handshake Deal Agreement Modal */}
      <HandshakeDealModal
        deal={activeDealAgreement}
        isOpen={!!activeDealAgreement}
        onClose={() => setActiveDealAgreement(null)}
      />

      {/* Ethiopian Coffee Blessing & Loyalty Token */}
      <BunaBlessingToken
        isOpen={isBunaBlessingOpen}
        onClose={() => setIsBunaBlessingOpen(false)}
        sellerName={blessingTarget?.sellerName || 'Almaz Tech'}
        itemTitle={blessingTarget?.itemTitle || 'iPhone 15 Pro Max 256GB'}
      />
    </div>
  );
};
