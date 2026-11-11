import React, { useState, useRef, useEffect } from 'react';
import { Collectible } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  Tag,
  Bookmark,
  MessageSquare,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import agozaLogoImg from '../assets/images/agoza_logo.svg';

interface QuickInspectionModalProps {
  collectible: Collectible | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenFullDetail: (collectible: Collectible) => void;
}

export const QuickInspectionModal: React.FC<QuickInspectionModalProps> = ({
  collectible,
  isOpen,
  onClose,
  onOpenFullDetail,
}) => {
  const {
    formatPrice,
    watchlist,
    toggleWatchlist,
    setIsOfferModalOpen,
    setSelectedCollectible,
    openChatForCollectible,
    setIsEscrowModalOpen,
  } = useMarketplace();

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialPinchDistRef = useRef<number | null>(null);
  const initialScaleRef = useRef<number>(1);

  // Reset zoom on item change or modal close
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, collectible?.id]);

  // Keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !collectible) return null;

  const isSaved = watchlist.includes(collectible.id);

  // Zoom controls
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 3.5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.5, 1));
  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Double tap / double click to toggle zoom
  const handleDoubleClick = () => {
    if (scale > 1) {
      handleResetZoom();
    } else {
      setScale(2);
    }
  };

  // Touch Pinch-to-zoom handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // 2 fingers: pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      initialPinchDistRef.current = dist;
      initialScaleRef.current = scale;
    } else if (e.touches.length === 1 && scale > 1) {
      // 1 finger while zoomed: pan
      panStartRef.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      };
      setIsPanning(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistRef.current !== null) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      const ratio = dist / initialPinchDistRef.current;
      const newScale = Math.min(Math.max(initialScaleRef.current * ratio, 1), 3.5);
      setScale(newScale);
    } else if (e.touches.length === 1 && isPanning && scale > 1) {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      setPosition({
        x: currentX - panStartRef.current.x,
        y: currentY - panStartRef.current.y,
      });
    }
  };

  const handleTouchEnd = () => {
    initialPinchDistRef.current = null;
    setIsPanning(false);
  };

  // Mouse pan handlers for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && scale > 1) {
      setPosition({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-[#1e130c] border border-amber-900/30 dark:border-[#422919] rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header: Gesture cue + dismiss button */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-[#382316] bg-slate-50 dark:bg-[#251810]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 dark:bg-[#d4a373]/20 flex items-center justify-center text-amber-700 dark:text-[#d4a373]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-[#fbf5ef] leading-none">
                Customer Quick Inspection (የእቃው ፈጣን ቅኝት)
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-[#a8907f] mt-0.5">
                Pinch or scroll to inspect item texture, markings & details
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white dark:bg-[#342318] text-slate-500 dark:text-[#d7beaa] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#4d3221] cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="Close inspection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Zoomable Photo Canvas */}
        <div
          className="relative aspect-4/3 w-full bg-slate-950 overflow-hidden cursor-crosshair select-none touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onDoubleClick={handleDoubleClick}
        >
          {/* Main Image with Scale & Pan Transform */}
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-75 ease-out"
            style={{
              transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
              transformOrigin: 'center center',
            }}
          >
            <img
              src={collectible.imageUrl}
              alt={collectible.title}
              className="w-full h-full object-contain pointer-events-none"
              draggable={false}
            />
          </div>

          {/* Ethiopian Authenticity Hologram Seal Watermark */}
          <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md border border-amber-400/50 rounded-xl px-3 py-1.5 flex items-center gap-2 pointer-events-none shadow-lg">
            <div className="w-5 h-5 rounded-full overflow-hidden border border-amber-400 bg-amber-50">
              <img src={agozaLogoImg} alt="Agoza" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-[9px] font-mono font-bold tracking-wider text-amber-300 uppercase">
                Agoza Verified Seal
              </div>
              <div className="text-[8px] text-slate-300 font-serif">የተረጋገጠ ትክክለኛ ዕቃ</div>
            </div>
          </div>

          {/* Zoom Overlay Pill Controls */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-1 z-20 shadow-lg">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={scale <= 1}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono font-bold text-amber-300 px-1 min-w-[38px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={scale >= 3.5}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            {scale > 1 && (
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-1.5 rounded-xl text-amber-400 hover:bg-white/10 cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile gesture hint badge */}
          {scale === 1 && (
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs rounded-lg px-2.5 py-1 text-[10px] text-slate-300 pointer-events-none flex items-center gap-1.5 border border-white/5">
              <span>Double-tap or pinch to inspect</span>
            </div>
          )}
        </div>

        {/* Quick Inspection Summary Body */}
        <div className="p-4 sm:p-5 space-y-4 bg-white dark:bg-[#1e130c]">
          {/* Price & Location Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-[#d4a373]">
                  {collectible.category.replace('-', ' ')}
                </span>
                {collectible.subcategory && (
                  <span className="text-[10px] text-slate-400 dark:text-[#a8907f]">
                    · {collectible.subcategory.replace('-', ' ')}
                  </span>
                )}
                {collectible.rarity && (
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-300/40">
                    ★ {collectible.rarity}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#fbf5ef] leading-snug">
                {collectible.title}
              </h2>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 dark:text-[#a8907f] block font-medium">Asking Price</span>
              <span className="font-mono text-xl sm:text-2xl font-black text-[#1b5e20] dark:text-[#d4a373]">
                {formatPrice(collectible.priceETB)}
              </span>
            </div>
          </div>

          {/* Quick Specifications Pill Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#251810] border border-slate-200 dark:border-[#382316]">
              <span className="text-[10px] text-slate-400 dark:text-[#9e8471] block">Condition</span>
              <span className="font-semibold text-slate-800 dark:text-[#fbf5ef] truncate block">
                {collectible.condition}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#251810] border border-slate-200 dark:border-[#382316]">
              <span className="text-[10px] text-slate-400 dark:text-[#9e8471] block">Created / Era</span>
              <span className="font-semibold text-slate-800 dark:text-[#fbf5ef] truncate block">
                {collectible.era || 'Authentic'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#251810] border border-slate-200 dark:border-[#382316]">
              <span className="text-[10px] text-slate-400 dark:text-[#9e8471] block">Location</span>
              <span className="font-semibold text-slate-800 dark:text-[#fbf5ef] truncate flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-600 dark:text-[#d4a373] shrink-0" />
                <span>{collectible.seller.city || 'Addis Ababa'}</span>
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#251810] border border-slate-200 dark:border-[#382316]">
              <span className="text-[10px] text-slate-400 dark:text-[#9e8471] block">Safe Hub</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 truncate block">
                CBE / Telebirr Hub
              </span>
            </div>
          </div>

          {/* Seller Reputation Row */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 dark:bg-[#251810]/70 border border-amber-200 dark:border-[#382316]">
            <div className="flex items-center gap-2.5">
              <img
                src={collectible.seller.avatar}
                alt={collectible.seller.name}
                className="w-9 h-9 rounded-full object-cover border border-amber-300"
              />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-[#fbf5ef]">
                  {collectible.seller.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-[#a8907f] flex items-center gap-1">
                  <span>★ {collectible.seller.rating}</span>
                  <span>·</span>
                  <span>{collectible.seller.totalTrades} completed trades</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleWatchlist(collectible.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center ${
                isSaved
                  ? 'bg-[#1b5e20] text-white border-[#1b5e20] dark:bg-[#d4a373] dark:text-[#1e130c]'
                  : 'bg-white dark:bg-[#342318] text-slate-700 dark:text-[#d7beaa] border-slate-200 dark:border-[#4d3221]'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save ad'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* 1-Tap Customer Action Buttons (WCAG AA >= 44px) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                setSelectedCollectible(collectible);
                setIsOfferModalOpen(true);
              }}
              className="py-3 px-3 bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#d4a373] dark:hover:bg-[#e0b487] text-white dark:text-[#1e130c] font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Tag className="w-4 h-4" />
              <span>Make Offer (ዋጋ አቅርብ)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                openChatForCollectible(collectible);
              }}
              className="py-3 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-[#342318] dark:hover:bg-[#422919] text-slate-800 dark:text-[#fbf5ef] font-bold text-xs rounded-xl border border-slate-200 dark:border-[#4d3221] transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat & Bargain</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenFullDetail(collectible);
              }}
              className="py-3 px-3 bg-amber-500 hover:bg-amber-600 dark:bg-[#251810] dark:hover:bg-[#2f1f15] text-white dark:text-[#d4a373] font-bold text-xs rounded-xl border border-amber-600 dark:border-[#4d3221] transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <span>Full Details</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
