import React, { useState, useMemo, useEffect } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ImageWatermark } from './ImageWatermark';
import { VerifiedBadge } from './VerifiedBadge';
import { getMarketPriceIntelligence } from '../utils/marketPriceIntelligence';
import {
  X,
  ShieldCheck,
  Bookmark,
  Share2,
  Phone,
  MessageSquare,
  Lock,
  ArrowLeftRight,
  CheckCircle2,
  MapPin,
  Award,
  Star,
  ChevronDown,
  ChevronUp,
  Shield,
  Scale,
  ExternalLink,
} from 'lucide-react';

export const CollectibleDetailModal: React.FC = () => {
  const {
    selectedCollectible,
    setSelectedCollectible,
    collectibles,
    formatPrice,
    watchlist,
    toggleWatchlist,
    openChatForCollectible,
    setIsOfferModalOpen,
    setIsSwapModalOpen,
    setIsEscrowModalOpen,
    getSellerTrustScore,
    getSellerReviews,
    addReview,
    t,
  } = useMarketplace();

  const [copiedLink, setCopiedLink] = useState(false);
  const [showDirectContact, setShowDirectContact] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Reviews drawer / form state
  const [showReviews, setShowReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Reset per-item UI state when a different listing is opened (previously the
  // photo index and the revealed phone number leaked into the next item).
  const selectedId = selectedCollectible?.id;
  useEffect(() => {
    setActivePhotoIndex(0);
    setShowDirectContact(false);
    setShowReviews(false);
    setShowReviewForm(false);
    setCopiedLink(false);
  }, [selectedId]);

  // Close on Escape
  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCollectible(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, setSelectedCollectible]);

  // Similar items market price comparison
  const marketIntel = useMemo(() => {
    if (!selectedCollectible) return null;
    return getMarketPriceIntelligence(selectedCollectible, collectibles);
  }, [selectedCollectible, collectibles]);

  if (!selectedCollectible) return null;

  const sellerTrust = getSellerTrustScore(selectedCollectible.seller.id);
  const sellerReviews = getSellerReviews(selectedCollectible.seller.id);

  const allPhotos = [selectedCollectible.imageUrl, ...(selectedCollectible.additionalImages || [])];
  const currentPhoto = allPhotos[activePhotoIndex] || selectedCollectible.imageUrl;

  const isSaved = watchlist.includes(selectedCollectible.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    addReview({
      sellerId: selectedCollectible.seller.id,
      authorName: 'You (Verified Trader)',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      rating: ratingInput,
      comment: commentInput.trim(),
      itemTitle: selectedCollectible.title,
      verifiedPurchase: true,
      recommend: ratingInput >= 4,
    });

    setCommentInput('');
    setShowReviewForm(false);
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    // Native share sheet on phones (Telegram, WhatsApp…), clipboard elsewhere.
    if (navigator.share) {
      try {
        await navigator.share({ title: selectedCollectible.title, text: formatPrice(selectedCollectible.priceETB), url });
        return;
      } catch {
        /* user cancelled — fall through to copy */
      }
    }
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleClose = () => {
    setSelectedCollectible(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={selectedCollectible.title}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white dark:bg-[#1a1009] border border-slate-200 dark:border-[#473020] rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col transition-colors">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-[#473020] bg-slate-50 dark:bg-[#1a1009]">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#a8907f]">
            <span className="font-bold text-[#1b5e20] dark:text-[#c5a059] uppercase tracking-wider text-[11px]">
              {t.categoryNames[selectedCollectible.category] || selectedCollectible.category}
            </span>
            <span aria-hidden="true">·</span>
            <span>ID: {selectedCollectible.id}</span>
            <span aria-hidden="true">·</span>
            {selectedCollectible.authenticityGuaranteed && (
              <VerifiedBadge variant="listing" size="xs" label={t.card.verifiedListing} />
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWatchlist(selectedCollectible.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center ${
                isSaved
                  ? 'bg-[#1b5e20] text-white dark:bg-[#c5a059] dark:text-[#1e130c] border-transparent'
                  : 'bg-white dark:bg-[#251810] text-slate-600 dark:text-[#a8907f] hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-[#5a3a24]'
              }`}
              title={isSaved ? t.card.removeSaved : t.card.save}
              aria-label={isSaved ? t.card.removeSaved : t.card.save}
              aria-pressed={isSaved}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white dark:bg-[#251810] text-slate-600 dark:text-[#a8907f] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#5a3a24] transition-colors cursor-pointer relative min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Share"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && (
                <span className="absolute -bottom-8 right-0 bg-[#1b5e20] dark:bg-[#c5a059] text-white dark:text-[#1e130c] text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </button>

            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-white dark:bg-[#251810] text-slate-600 dark:text-[#a8907f] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#5a3a24] transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pb-20 sm:pb-6">
          {/* Left Column: Image & Details */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Clean Photo Container with Agoza Marketplace Label */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#140c07] border border-slate-200 dark:border-[#473020] shadow-sm">
              <ImageWatermark
                src={currentPhoto}
                alt={selectedCollectible.title}
                aspectRatio="aspect-[4/3]"
                size="lg"
                allowZoom={true}
                itemTitle={selectedCollectible.title}
                sellerName={selectedCollectible.seller.name}
              />
              <div className="absolute top-3 left-3 pointer-events-none bg-white/95 dark:bg-[#1e130c]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#5a3a24] text-xs font-semibold text-slate-800 dark:text-[#ede0d4] shadow-xs flex items-center gap-1.5 z-10">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{selectedCollectible.seller.city || selectedCollectible.seller.location}</span>
              </div>
            </div>

            {/* Photo Gallery Thumbnails (if multiple) & Watermark Security Notice */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
              {allPhotos.length > 1 && (
                <div className="flex items-center gap-2">
                  {allPhotos.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`w-12 h-12 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        activePhotoIndex === idx
                          ? 'border-[#1b5e20] dark:border-[#c5a059] scale-105 shadow-sm'
                          : 'border-slate-200 dark:border-[#5a3a24] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-700/50">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Click photo to inspect full size</span>
              </div>
            </div>

            {/* Description & Warranty / Specs */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs uppercase font-bold text-slate-500 dark:text-[#a8907f] tracking-wider mb-2">
                  Item Description & Specifications
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-[#ede0d4] leading-relaxed">
                  {selectedCollectible.description}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-[#251810] border border-slate-200 dark:border-[#473020] rounded-2xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-[#e2c17c] mb-1.5">
                  <Award className="w-4 h-4 text-[#1b5e20] dark:text-[#c5a059]" />
                  <span>Warranty, Verification & Documents</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-[#c4b19f] leading-relaxed">
                  {selectedCollectible.provenance}
                </p>
              </div>

              {/* Trade Interests */}
              {selectedCollectible.openToTrade && (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-400 mb-2">
                    <ArrowLeftRight className="w-4 h-4" />
                    <span>Seller is Open to P2P Swaps & Trade-in</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-emerald-900 dark:text-[#c3d6c9]">
                    {selectedCollectible.tradeInterests?.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-emerald-100/70 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700/50 px-2.5 py-1 rounded-lg"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Pricing & Purchase Module */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#a8907f] mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{selectedCollectible.origin}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{selectedCollectible.listedAt}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#f5f6f8] leading-snug">
                  {selectedCollectible.title}
                </h2>
              </div>

              {/* Price Box */}
              <div className="bg-slate-50 dark:bg-[#2d1c12] border border-slate-200 dark:border-[#473020] rounded-2xl p-4">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs text-slate-500 dark:text-[#a8907f] uppercase tracking-wider font-bold">
                    Asking Price
                  </span>
                  <span className="font-mono text-2xl font-bold text-[#1b5e20] dark:text-[#c5a059] tabular-nums">
                    {formatPrice(selectedCollectible.priceETB)}
                  </span>
                </div>

                <div className="space-y-2 text-xs pt-3 border-t border-slate-200 dark:border-[#473020] text-slate-600 dark:text-[#c4b19f]">
                  <div className="flex items-center justify-between">
                    <span>Physical Condition:</span>
                    <span className="font-bold text-slate-800 dark:text-[#ede0d4]">{selectedCollectible.condition}</span>
                  </div>
                  {selectedCollectible.brand && (
                    <div className="flex items-center justify-between">
                      <span>Brand / Manufacturer:</span>
                      <span className="font-bold text-slate-800 dark:text-[#ede0d4]">{selectedCollectible.brand}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>Created / Model:</span>
                    <span className="font-mono text-slate-800 dark:text-[#ede0d4] text-[11px]">{selectedCollectible.era}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>P2P Inspection:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11px]">Verified Safe Hub Ready</span>
                  </div>
                </div>
              </div>

              {/* Fair Market Price Intelligence & Similar Item Deals (Anti-Cheating & Competitiveness) */}
              {marketIntel && marketIntel.similarCount > 0 && (
                <div className="bg-amber-50/80 dark:bg-[#2d1c12] border border-amber-300 dark:border-[#5a3a24] rounded-2xl p-3.5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        Fair Market Price Intelligence
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/60">
                      {marketIntel.similarCount} Similar Listed
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                    Comparing similar listings on Agoza to ensure competitive market pricing and protect buyers from unfair pricing, unless materials differ in quality.
                  </p>

                  {/* Market Benchmark Range */}
                  <div className="flex items-center justify-between text-[10px] p-2 bg-white dark:bg-[#1e130c] rounded-xl border border-slate-200 dark:border-[#382214] font-mono">
                    <div>
                      <span className="text-slate-400 block">Lowest on Agoza</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatPrice(marketIntel.lowestPrice)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Market Average</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{formatPrice(marketIntel.averageMarketPrice)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Price Stance</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400 uppercase">
                        {marketIntel.pricePosition.replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Comparative Listings */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                      Comparative Deals & Material Differences:
                    </span>
                    {marketIntel.suggestions.slice(0, 2).map((sugg) => (
                      <div
                        key={sugg.item.id}
                        className="p-2.5 rounded-xl bg-white dark:bg-[#251810] border border-slate-200 dark:border-[#473020] text-xs space-y-1.5"
                      >
                        <div className="flex items-start gap-2.5">
                          {/* Comparative Item Image with Watermark */}
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-amber-400/50 bg-black">
                            <img src={sugg.item.imageUrl} alt="" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[7px] font-serif text-amber-300 text-center font-bold">
                              አጎዛ
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h5 className="font-semibold text-slate-900 dark:text-white truncate text-xs">
                                {sugg.item.title}
                              </h5>
                              <span className="font-mono font-bold text-xs ml-1 whitespace-nowrap text-[#1b5e20] dark:text-[#c5a059]">
                                {formatPrice(sugg.item.priceETB)}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
                              <span className="text-slate-500">{sugg.item.condition}</span>
                              <span className="text-slate-400">·</span>
                              <span
                                className={`font-mono font-bold ${
                                  sugg.priceDifferenceETB < 0
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                {sugg.priceDifferenceETB < 0
                                  ? `${formatPrice(Math.abs(sugg.priceDifferenceETB))} cheaper (${sugg.percentageDifference}%)`
                                  : `${formatPrice(sugg.priceDifferenceETB)} higher (+${sugg.percentageDifference}%)`}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quality & Material Difference Analysis */}
                        <div className="text-[10.5px] p-1.5 rounded-lg bg-slate-50 dark:bg-[#382214] border border-slate-100 dark:border-[#5a3a24] text-slate-700 dark:text-slate-300">
                          <span className="font-semibold text-amber-700 dark:text-amber-400 block mb-0.5">
                            {sugg.qualityAnalysis.hasQualityDifference ? '⚖️ Material & Quality Note:' : '⚖️ Condition Match:'}
                          </span>
                          <p className="text-[10px] leading-tight">
                            {sugg.qualityAnalysis.justificationReason}
                          </p>
                        </div>

                        {/* View Deal Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedCollectible(sugg.item)}
                          className="w-full py-1 text-[11px] font-semibold text-[#1b5e20] dark:text-[#c5a059] bg-[#1b5e20]/10 dark:bg-[#c5a059]/15 hover:bg-[#1b5e20]/20 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>Compare this alternative listing</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transaction Action Trio */}
              <div className="space-y-2.5">
                <button
                  onClick={() => setIsEscrowModalOpen(true)}
                  className="w-full py-3 px-4 bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#c5a059] dark:hover:bg-[#d6b068] text-white dark:text-[#1e130c] font-bold text-sm rounded-xl shadow transition-colors cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <Lock className="w-4 h-4 stroke-[2.5]" />
                  <span>{t.buyWithEscrow}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsOfferModalOpen(true)}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-[#473020] dark:hover:bg-[#5a3a24] text-slate-800 dark:text-[#ede0d4] font-bold text-xs rounded-xl border border-slate-200 dark:border-[#5a3a24] transition-colors cursor-pointer text-center min-h-[44px]"
                  >
                    {t.makeOffer}
                  </button>

                  {selectedCollectible.openToTrade ? (
                    <button
                      onClick={() => setIsSwapModalOpen(true)}
                      className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 dark:bg-[#172b22] dark:hover:bg-[#1e382d] text-emerald-800 dark:text-emerald-300 font-bold text-xs rounded-xl border border-emerald-300 dark:border-emerald-800/60 transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 min-h-[44px]"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>{t.proposeSwap}</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="py-2.5 px-3 bg-slate-100 dark:bg-[#251810] text-slate-400 text-xs rounded-xl border border-slate-200 dark:border-[#473020] text-center cursor-not-allowed min-h-[44px]"
                    >
                      Swaps Closed
                    </button>
                  )}
                </div>
              </div>

              {/* Seller Card (Jiji Ethiopia Style with Direct Call & Chat) */}
              <div className="bg-slate-50 dark:bg-[#251810] border border-slate-200 dark:border-[#473020] rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={selectedCollectible.seller.avatar}
                    alt={selectedCollectible.seller.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-300 dark:border-[#5a3a24]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-sm text-slate-900 dark:text-[#f2f3f7] truncate">
                        {selectedCollectible.seller.name}
                      </span>
                      <VerifiedBadge variant="seller" size="xs" label="Verified" />
                    </div>
                    <p className="text-xs text-[#1b5e20] dark:text-[#c5a059] font-medium mt-0.5">
                      {selectedCollectible.seller.badge}
                    </p>
                  </div>

                  <button
                    onClick={() => openChatForCollectible(selectedCollectible)}
                    className="p-3 bg-[#1b5e20] dark:bg-[#473020] hover:bg-[#25732b] text-white rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Direct Message Seller"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>

                {/* Seller Trust Score & Ratings Box */}
                <div className="mt-3 p-3 bg-white dark:bg-[#1a1009] rounded-xl border border-slate-200 dark:border-[#473020] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="font-bold text-xs text-slate-800 dark:text-white">
                        Seller Trust Score
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      {sellerTrust.score}% Trust Score
                    </span>
                  </div>

                  {/* Rating Stars & Review Count */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="font-bold text-slate-800 dark:text-white ml-1">
                        {(sellerTrust.score / 20).toFixed(1)}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        ({sellerReviews.length} verified reviews)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowReviews(!showReviews)}
                      className="text-[11px] font-semibold text-[#1b5e20] dark:text-[#c5a059] hover:underline cursor-pointer flex items-center gap-0.5"
                    >
                      <span>{showReviews ? 'Hide Reviews' : 'View Reviews'}</span>
                      {showReviews ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Trust Breakdown Metrics */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-[#473020] text-[10px]">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>Item Authenticity:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">100%</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>Safe Handshake:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">100%</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>Accurate Specs:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {sellerTrust.breakdown.accuracy * 20}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>Response Rate:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">Under 10m</span>
                    </div>
                  </div>

                  {/* Expandable Reviews List & Submit Form */}
                  {showReviews && (
                    <div className="pt-2 border-t border-slate-100 dark:border-[#473020] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          Buyer Reviews ({sellerReviews.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(!showReviewForm)}
                          className="text-[10px] font-bold text-[#1b5e20] dark:text-[#c5a059] hover:underline cursor-pointer"
                        >
                          {showReviewForm ? 'Cancel' : '+ Write Review'}
                        </button>
                      </div>

                      {reviewSubmitted && (
                        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Review submitted! Seller trust score updated.</span>
                        </div>
                      )}

                      {/* Write Review Form */}
                      {showReviewForm && (
                        <form onSubmit={handleReviewSubmit} className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#2d1c12] border border-slate-200 dark:border-[#5a3a24] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                              Your Rating:
                            </span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRatingInput(star)}
                                  className="cursor-pointer"
                                >
                                  <Star
                                    className={`w-4 h-4 ${
                                      star <= ratingInput
                                        ? 'text-amber-400 fill-current'
                                        : 'text-slate-300 dark:text-slate-600'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <textarea
                            rows={2}
                            placeholder="Share your experience with this seller (item condition, safe meetup, accuracy)..."
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            className="w-full bg-white dark:bg-[#1e130c] border border-slate-200 dark:border-[#5a3a24] rounded-lg p-2 text-xs text-slate-900 dark:text-white resize-none focus:outline-none focus:border-[#1b5e20]"
                            required
                          />

                          <button
                            type="submit"
                            className="w-full py-1.5 bg-[#1b5e20] dark:bg-[#c5a059] text-white dark:text-[#1e130c] font-bold text-xs rounded-lg shadow cursor-pointer hover:opacity-95"
                          >
                            Submit Trust Rating
                          </button>
                        </form>
                      )}

                      {/* Existing Reviews */}
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {sellerReviews.length === 0 ? (
                          <p className="text-[11px] text-slate-500 italic text-center py-2">
                            No reviews yet. Be the first to trade and review!
                          </p>
                        ) : (
                          sellerReviews.map((rev) => (
                            <div
                              key={rev.id}
                              className="p-2 rounded-lg bg-slate-50 dark:bg-[#2d1c12] border border-slate-100 dark:border-[#473020] text-[11px] space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                  {rev.authorName}
                                </span>
                                <div className="flex items-center text-amber-400 text-[10px]">
                                  {[...Array(rev.rating)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-current" />
                                  ))}
                                  <span className="text-slate-400 ml-1 text-[9px]">{rev.date}</span>
                                </div>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300">{rev.comment}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Contact Toggle */}
                <div className="mt-3">
                  {!showDirectContact ? (
                    <button
                      onClick={() => setShowDirectContact(true)}
                      className="w-full py-2.5 text-xs font-bold text-white bg-[#1b5e20] hover:bg-[#25732b] rounded-xl shadow transition-colors cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{t.showContact}</span>
                    </button>
                  ) : (
                    <div className="p-3 bg-white dark:bg-[#382214] rounded-xl border border-slate-200 dark:border-[#473020] text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Phone:</span>
                        <a
                          href={`tel:${selectedCollectible.seller.phone}`}
                          className="font-mono text-[#1b5e20] dark:text-emerald-400 font-bold hover:underline"
                        >
                          {selectedCollectible.seller.phone}
                        </a>
                      </div>
                      {selectedCollectible.seller.telegramHandle && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Telegram:</span>
                          <span className="text-blue-500 font-mono font-medium">
                            {selectedCollectible.seller.telegramHandle}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Safe Meetup Spot info */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-[#251810] border border-slate-200 dark:border-[#473020] text-xs">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-[#f0f1f5] block">Designated Safe Trade Hub:</span>
                  <span className="text-slate-600 dark:text-[#c4b19f]">{selectedCollectible.safeMeetupSpot}</span>
                </div>
              </div>
            </div>

            {/* Buyer Protection Guarantee */}
            <div className="pt-3 border-t border-slate-100 dark:border-[#382214] text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-[#48bb78] shrink-0" />
              <span>
                Protected by Agoza Buyer Safeguard. Funds are safely held until in-person inspection at designated safe hubs.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
