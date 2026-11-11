import React, { useState } from 'react';
import { CustomerDealAgreement } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Copy,
  MapPin,
  Award,
} from 'lucide-react';
import {
  CoffeeBeansIcon,
  JebenaIcon,
} from './EthiopianIcons';

interface HandshakeDealModalProps {
  deal: CustomerDealAgreement | null;
  isOpen: boolean;
  onClose: () => void;
  onProceedToEscrow?: (deal: CustomerDealAgreement) => void;
}

export const HandshakeDealModal: React.FC<HandshakeDealModalProps> = ({
  deal,
  isOpen,
  onClose,
  onProceedToEscrow,
}) => {
  const { formatPrice, setIsEscrowModalOpen, setSelectedCollectible, collectibles } = useMarketplace();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !deal) return null;

  const handleCopyDealCode = () => {
    navigator.clipboard?.writeText(deal.contractHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProceedEscrow = () => {
    onClose();
    if (onProceedToEscrow) {
      onProceedToEscrow(deal);
    } else {
      const item = collectibles.find((c) => c.id === deal.collectibleId);
      if (item) {
        setSelectedCollectible(item);
      }
      setIsEscrowModalOpen(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-[#1e130c] border border-amber-500/40 dark:border-[#4d3221] rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ethiopian Flag Top Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-amber-400 to-rose-600" />

        {/* Header Bar */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-slate-100 dark:border-[#382316] bg-amber-50/60 dark:bg-[#251810]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-[#d4a373]/20 flex items-center justify-center text-amber-700 dark:text-[#d4a373]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-sm sm:text-base font-bold text-slate-900 dark:text-[#fbf5ef] leading-tight">
                Ethiopian Deal Handshake (የንግድ ስምምነት)
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-[#a8907f]">
                Mutual Customer Agreement Sealed with Buna Honor
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white dark:bg-[#342318] text-slate-500 dark:text-[#d7beaa] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#4d3221] cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Handshake Visual Ceremony */}
        <div className="p-6 text-center space-y-5 bg-white dark:bg-[#1e130c]">
          {/* Animated Handshake Vector with Coffee Sparks */}
          <div className="relative mx-auto w-24 h-24 rounded-full bg-amber-100 dark:bg-[#2d1b11] border-2 border-amber-400 dark:border-[#d4a373] flex items-center justify-center shadow-inner">
            {/* Handshake SVG */}
            <svg
              viewBox="0 0 48 48"
              fill="none"
              className="w-14 h-14 text-amber-800 dark:text-[#d4a373] animate-pulse"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 26L18 34L26 26L34 34L42 26"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 20L22 14C23.5 12.5 26 12.5 27.5 14L34 20.5"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M20 26L25 21C26 20 27.5 20 28.5 21L30 22.5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="24" cy="8" r="3" fill="#c5a059" />
            </svg>

            {/* Coffee Bean Confetti Badges */}
            <div className="absolute -top-1 -right-1 p-1 rounded-full bg-[#1b5e20] text-white shadow">
              <CoffeeBeansIcon className="w-3.5 h-3.5" />
            </div>
            <div className="absolute -bottom-1 -left-1 p-1 rounded-full bg-amber-600 text-white shadow">
              <JebenaIcon className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-700 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ደህና ሁን / ስምምነቱ ጸድቋል (Handshake Sealed!)</span>
            </div>
            <h2 className="text-xl font-cinzel font-bold text-slate-900 dark:text-[#fbf5ef]">
              Bargain Concluded at {formatPrice(deal.agreedPriceETB)}
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#a8907f] max-w-sm mx-auto mt-1">
              Buyer <strong>{deal.buyerName}</strong> and Seller <strong>{deal.sellerName}</strong> have locked terms with verified inspection guarantee.
            </p>
          </div>

          {/* Deal Certificate Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#251810] border border-slate-200 dark:border-[#422919] text-left space-y-3">
            {/* Item preview */}
            <div className="flex items-center gap-3">
              <img
                src={deal.collectibleImage}
                alt={deal.collectibleTitle}
                className="w-14 h-14 rounded-xl object-cover border border-amber-300 dark:border-[#52331f]"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-[#fbf5ef] truncate">
                  {deal.collectibleTitle}
                </h4>
                <div className="text-[11px] text-slate-500 dark:text-[#a8907f] flex items-center gap-1.5 mt-0.5">
                  <span>Agreed Price:</span>
                  <span className="font-mono font-bold text-[#1b5e20] dark:text-[#d4a373]">
                    {formatPrice(deal.agreedPriceETB)}
                  </span>
                </div>
              </div>
            </div>

            {/* Meetup Hub & Contract Hash */}
            <div className="pt-2 border-t border-slate-200 dark:border-[#382316] grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 dark:text-[#9e8471] block">Inspection Safe Hub:</span>
                <span className="font-semibold text-slate-800 dark:text-[#fbf5ef] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-600 dark:text-[#d4a373]" />
                  <span>{deal.safeHub}</span>
                </span>
              </div>

              <div>
                <span className="text-slate-400 dark:text-[#9e8471] block">Contract Hash:</span>
                <button
                  type="button"
                  onClick={handleCopyDealCode}
                  className="font-mono text-[10px] text-amber-700 dark:text-[#d4a373] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{deal.contractHash}</span>
                  <Copy className="w-3 h-3" />
                  {copied && <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>}
                </button>
              </div>
            </div>
          </div>

          {/* Customer Protection Notice */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-[#1a110a] border border-amber-200 dark:border-[#382316] text-[11px] text-slate-600 dark:text-[#c5a059] text-left">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>Customer Security Notice:</strong> Both parties are protected under Agoza's verified physical handoff protocol. Payment stays in escrow until physical inspection.
            </span>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleProceedEscrow}
              className="py-3 px-4 bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#d4a373] dark:hover:bg-[#e0b487] text-white dark:text-[#1e130c] font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Lock Escrow Protection</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-[#251810] dark:hover:bg-[#342318] text-slate-800 dark:text-[#fbf5ef] font-bold text-xs rounded-xl border border-slate-200 dark:border-[#4d3221] transition-all cursor-pointer min-h-[44px]"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
